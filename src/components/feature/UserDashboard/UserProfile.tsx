import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfileProps {
  userData: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phoneNumber?: string;
    bio?: string;
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  onUpdate: (data: ProfileFormData) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userData, onUpdate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      bio: userData.bio,
      notifications: {
        email: userData.notifications?.email ?? true,
        sms: userData.notifications?.sms ?? false,
        push: userData.notifications?.push ?? true,
      },
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onUpdate)} className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-3xl text-gray-500">
                  {userData.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark"
              onClick={() => {
                // TODO: Implement avatar upload
                console.log('Upload avatar');
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Profile Settings</h2>
            <p className="text-gray-600">Update your personal information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phoneNumber')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              {...register('bio')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Tell us about you and your dogs..."
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('notifications.email')}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label className="ml-3 block text-sm text-gray-700">
                  Email notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('notifications.sms')}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label className="ml-3 block text-sm text-gray-700">
                  SMS notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('notifications.push')}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label className="ml-3 block text-sm text-gray-700">
                  Push notifications
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={() => {
              // TODO: Implement password change
              console.log('Change password');
            }}
          >
            Change Password
          </button>
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
