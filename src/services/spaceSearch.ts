import { z } from 'zod';

// Validation schemas
export const SearchFiltersSchema = z.object({
  query: z.string(),
  location: z.string(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minRating: z.number().min(1).max(5).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(12)
});

export const SpaceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  rating: z.number(),
  location: z.string(),
  amenities: z.array(z.string()).optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
});

export type SearchFilters = z.infer<typeof SearchFiltersSchema>;
export type Space = z.infer<typeof SpaceSchema>;

export interface SearchResponse {
  spaces: Space[];
  total: number;
  page: number;
  totalPages: number;
}

class SpaceSearchService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async searchSpaces(filters: SearchFilters): Promise<SearchResponse> {
    try {
      // Validate filters
      const validatedFilters = SearchFiltersSchema.parse(filters);

      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(validatedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      // Make API request
      const response = await fetch(`${this.baseUrl}/spaces/search?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate response data
      const spaces = data.spaces.map((space: unknown) => SpaceSchema.parse(space));

      return {
        spaces,
        total: data.total,
        page: data.page,
        totalPages: data.totalPages
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.message}`);
      }
      throw error;
    }
  }

  async getSpaceById(id: string): Promise<Space> {
    try {
      const response = await fetch(`${this.baseUrl}/spaces/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch space: ${response.statusText}`);
      }

      const data = await response.json();
      return SpaceSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.message}`);
      }
      throw error;
    }
  }

  async getSuggestedSpaces(location: string): Promise<Space[]> {
    try {
      const response = await fetch(`${this.baseUrl}/spaces/suggested?location=${encodeURIComponent(location)}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch suggested spaces: ${response.statusText}`);
      }

      const data = await response.json();
      return data.map((space: unknown) => SpaceSchema.parse(space));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.message}`);
      }
      throw error;
    }
  }
}

export const spaceSearchService = new SpaceSearchService();
export default spaceSearchService;
