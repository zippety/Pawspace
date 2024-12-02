import React from 'react';
import { useForm } from 'react-hook-form';
import type { TravelPreferences } from '../../types';

interface PreferenceFormProps {
  onSubmit: (preferences: TravelPreferences) => void;
}

export function PreferenceForm({ onSubmit }: PreferenceFormProps) {
  const { register, handleSubmit } = useForm<TravelPreferences>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Budget (CAD)
        </label>
        <input
          type="number"
          {...register('budget', { required: true, min: 100 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter your budget"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Length of Stay (days)
        </label>
        <input
          type="number"
          {...register('lengthOfStay', { required: true, min: 1 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Number of days"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Travel Style
        </label>
        <select
          {...register('travelStyle', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select your travel style</option>
          <option value="luxury">Luxury</option>
          <option value="budget">Budget</option>
          <option value="adventure">Adventure</option>
          <option value="family">Family-friendly</option>
          <option value="romantic">Romantic</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Must-have Amenities
        </label>
        <div className="mt-2 space-y-2">
          {['wifi', 'pool', 'parking', 'restaurant', 'spa'].map((amenity) => (
            <label key={amenity} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                {...register('amenities')}
                value={amenity}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferred Season
        </label>
        <select
          {...register('season', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select preferred season</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="fall">Fall</option>
          <option value="winter">Winter</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Start Planning
      </button>
    </form>
  );
}
