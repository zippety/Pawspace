import React, { useState, useCallback } from 'react';
import { Star, Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useDropzone } from 'react-dropzone';

interface ReviewFormProps {
  onSubmit: (review: {
    rating: number;
    comment: string;
    images: File[];
  }) => Promise<void>;
  className?: string;
}

export function ReviewForm({ onSubmit, className }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const isValid = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValid && isValidSize;
    });

    if (validFiles.length + images.length > 5) {
      setError('You can only upload up to 5 images');
      return;
    }

    setImages(prev => [...prev, ...validFiles]);
    setError(null);
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5
  });

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (comment.trim().length < 10) {
      setError('Please write a review with at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        comment: comment.trim(),
        images,
      });
      // Reset form
      setRating(0);
      setComment('');
      setImages([]);
    } catch (error) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6 bg-white rounded-xl p-6 shadow-sm', className)}>
      <h3 className="text-lg font-medium text-gray-900">Write a Review</h3>

      {/* Rating */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Overall Rating
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none group"
            >
              <Star
                className={cn(
                  'w-8 h-8 transition-all duration-200',
                  (hoverRating || rating) >= value
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 group-hover:text-yellow-200'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Review Text */}
      <div className="space-y-2">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700"
        >
          Your Review
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={cn(
            'block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors duration-200',
            error && !comment ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'
          )}
          placeholder="Share your experience with this property..."
          minLength={10}
          required
        />
        <p className="text-sm text-gray-500">
          Minimum 10 characters ({comment.length} / 10)
        </p>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Add Photos (optional)
        </label>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-full object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Dropzone */}
        {images.length < 5 && (
          <div
            {...getRootProps()}
            className={cn(
              'cursor-pointer border-2 border-dashed rounded-lg p-6 transition-colors duration-200',
              isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400',
              error && 'border-red-300'
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center text-center">
              {isDragActive ? (
                <>
                  <Upload className="w-8 h-8 text-primary-500 mb-2" />
                  <p className="text-primary-700">Drop your images here</p>
                </>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-600">
                    Drag &amp; drop images here, or click to select
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Up to 5 images (max 5MB each)
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-all duration-200',
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
        )}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
}
