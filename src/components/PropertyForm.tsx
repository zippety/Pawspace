import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Property, PropertyRules } from '../types/property';
import { FormField } from './forms/FormField';
import { usePropertyStore } from '../store/propertyStore';
import { Plus, X, Upload } from 'lucide-react';
import { startTransaction, reportError } from '../utils/sentry';

// Zod schema for form validation
const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  pricePerHour: z.number().min(1, 'Price must be greater than 0'),
  size: z.number().min(1, 'Size must be greater than 0'),
  location: z.object({
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    province: z.string().min(2, 'Province is required'),
    postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/, 'Invalid postal code format'),
    country: z.string().min(2, 'Country is required'),
  }),
  rules: z.object({
    maxDogs: z.number().min(1, 'Maximum number of dogs is required'),
    dogSizeRestrictions: z.array(z.enum(['small', 'medium', 'large'])),
    vaccineRequired: z.boolean(),
    spayNeuterRequired: z.boolean(),
    additionalRules: z.array(z.string()),
  }),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  availability: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
    isAvailable: z.boolean(),
  })),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  initialData?: Partial<Property>;
  onSuccess?: () => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  onSuccess
}) => {
  const { createProperty, updateProperty } = usePropertyStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      ...initialData,
      rules: {
        maxDogs: 1,
        dogSizeRestrictions: [],
        vaccineRequired: true,
        spayNeuterRequired: true,
        additionalRules: [],
        ...initialData?.rules,
      },
      features: initialData?.features || [],
      availability: initialData?.availability || [
        {
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true,
        },
      ],
    },
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } =
    useFieldArray({ control, name: 'features' });

  const { fields: ruleFields, append: appendRule, remove: removeRule } =
    useFieldArray({ control, name: 'rules.additionalRules' });

  const { fields: availabilityFields, append: appendAvailability, remove: removeAvailability } =
    useFieldArray({ control, name: 'availability' });

  const onSubmit = async (data: PropertyFormData) => {
    const transaction = startTransaction('propertyForm', 'form-submission');

    try {
      if (initialData?.id) {
        await updateProperty(initialData.id, data);
      } else {
        await createProperty(data);
      }
      onSuccess?.();
    } catch (error) {
      reportError(error as Error, {
        component: 'PropertyForm',
        action: initialData?.id ? 'update' : 'create',
      });
    } finally {
      transaction?.finish();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">
          {initialData ? 'Edit Property' : 'Create New Property'}
        </h2>

        {/* Basic Information */}
        <div className="space-y-6">
          <FormField
            label="Title"
            name="title"
            register={register}
            error={errors.title}
            required
          />

          <FormField
            label="Description"
            name="description"
            register={register}
            error={errors.description}
            required
          >
            <textarea
              {...register('description')}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Price per Hour"
              name="pricePerHour"
              type="number"
              register={register}
              error={errors.pricePerHour}
              required
            />

            <FormField
              label="Size (sq ft)"
              name="size"
              type="number"
              register={register}
              error={errors.size}
              required
            />
          </div>
        </div>

        {/* Location */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Address"
              name="location.address"
              register={register}
              error={errors.location?.address}
              required
            />

            <FormField
              label="City"
              name="location.city"
              register={register}
              error={errors.location?.city}
              required
            />

            <FormField
              label="Province"
              name="location.province"
              register={register}
              error={errors.location?.province}
              required
            />

            <FormField
              label="Postal Code"
              name="location.postalCode"
              register={register}
              error={errors.location?.postalCode}
              required
            />
          </div>
        </div>

        {/* Rules */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Rules</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Maximum Dogs"
              name="rules.maxDogs"
              type="number"
              register={register}
              error={errors.rules?.maxDogs}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Allowed Dog Sizes
              </label>
              <div className="flex gap-4">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('rules.dogSizeRestrictions')}
                      value={size}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-600 capitalize">
                      {size}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('rules.vaccineRequired')}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">
                Require Vaccination
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('rules.spayNeuterRequired')}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">
                Require Spay/Neuter
              </span>
            </label>
          </div>

          {/* Additional Rules */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Rules
            </label>
            {ruleFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                  {...register(`rules.additionalRules.${index}`)}
                  className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter rule"
                />
                <button
                  type="button"
                  onClick={() => removeRule(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendRule('')}
              className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Rule
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Features</h3>
          {featureFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <input
                {...register(`features.${index}`)}
                className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter feature"
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendFeature('')}
            className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Feature
          </button>
        </div>

        {/* Availability */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Availability</h3>
          {availabilityFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <select
                {...register(`availability.${index}.dayOfWeek`)}
                className="px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {[
                  'Sunday',
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                ].map((day, i) => (
                  <option key={day} value={i}>
                    {day}
                  </option>
                ))}
              </select>

              <input
                type="time"
                {...register(`availability.${index}.startTime`)}
                className="px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />

              <input
                type="time"
                {...register(`availability.${index}.endTime`)}
                className="px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />

              <div className="flex items-center">
                <label className="flex items-center flex-1">
                  <input
                    type="checkbox"
                    {...register(`availability.${index}.isAvailable`)}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-600">Available</span>
                </label>

                <button
                  type="button"
                  onClick={() => removeAvailability(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendAvailability({
                dayOfWeek: 1,
                startTime: '09:00',
                endTime: '17:00',
                isAvailable: true,
              })
            }
            className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Availability
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-3 px-4 rounded-md text-white font-medium
              ${isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Property' : 'Create Property'}
          </button>
        </div>
      </div>
    </form>
  );
};
