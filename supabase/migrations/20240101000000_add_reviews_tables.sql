-- Create property_reviews table
CREATE TABLE IF NOT EXISTS public.property_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    visit_date TIMESTAMP WITH TIME ZONE,
    verified BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    host_response TEXT,
    host_response_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, user_id)
);

-- Create review_images table
CREATE TABLE IF NOT EXISTS public.review_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    review_id UUID REFERENCES public.property_reviews(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create review_reports table
CREATE TABLE IF NOT EXISTS public.review_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    review_id UUID REFERENCES public.property_reviews(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, user_id)
);

-- Create function to increment helpful count
CREATE OR REPLACE FUNCTION increment_review_helpful(review_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.property_reviews
    SET helpful_count = helpful_count + 1
    WHERE id = review_id;
END;
$$;

-- Create RLS policies
ALTER TABLE public.property_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;

-- Property reviews policies
CREATE POLICY "Anyone can view property reviews"
    ON public.property_reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create reviews for properties they've booked"
    ON public.property_reviews FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE property_id = property_reviews.property_id
            AND user_id = auth.uid()
            AND status = 'completed'
        )
    );

CREATE POLICY "Users can update their own reviews"
    ON public.property_reviews FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews"
    ON public.property_reviews FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Review images policies
CREATE POLICY "Anyone can view review images"
    ON public.review_images FOR SELECT
    USING (true);

CREATE POLICY "Users can add images to their reviews"
    ON public.review_images FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.property_reviews
            WHERE id = review_images.review_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their review images"
    ON public.review_images FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.property_reviews
            WHERE id = review_images.review_id
            AND user_id = auth.uid()
        )
    );

-- Review reports policies
CREATE POLICY "Only admins can view review reports"
    ON public.review_reports FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Authenticated users can create review reports"
    ON public.review_reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

-- Update properties table to add review stats
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2),
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Create function to update property review stats
CREATE OR REPLACE FUNCTION update_property_review_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE public.properties
        SET
            average_rating = (
                SELECT ROUND(AVG(rating)::numeric, 2)
                FROM public.property_reviews
                WHERE property_id = NEW.property_id
            ),
            review_count = (
                SELECT COUNT(*)
                FROM public.property_reviews
                WHERE property_id = NEW.property_id
            )
        WHERE id = NEW.property_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.properties
        SET
            average_rating = (
                SELECT ROUND(AVG(rating)::numeric, 2)
                FROM public.property_reviews
                WHERE property_id = OLD.property_id
            ),
            review_count = (
                SELECT COUNT(*)
                FROM public.property_reviews
                WHERE property_id = OLD.property_id
            )
        WHERE id = OLD.property_id;
    END IF;
    RETURN NULL;
END;
$$;

-- Create trigger for updating property review stats
CREATE TRIGGER update_property_review_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.property_reviews
FOR EACH ROW
EXECUTE FUNCTION update_property_review_stats();
