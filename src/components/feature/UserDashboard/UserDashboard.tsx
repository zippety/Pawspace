import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { BookingHistory } from './BookingHistory';
import { UserProfile } from './UserProfile';
import { UserPreferences } from './UserPreferences';
import { SavedSpaces } from './SavedSpaces';

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
}

interface UserDashboardProps {
  userData: UserData;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ userData }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { name: 'Bookings', icon: '📅' },
    { name: 'Profile', icon: '👤' },
    { name: 'Preferences', icon: '⚙️' },
    { name: 'Saved Spaces', icon: '❤️' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userData.name}!</h1>
          <p className="text-gray-600 mt-1">Manage your PawSpace experience</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{userData.email}</span>
          {userData.avatar && (
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-12 h-12 rounded-full"
            />
          )}
        </div>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `w-full rounded-lg py-3 text-sm font-medium leading-5
                ${
                  selected
                    ? 'bg-white text-primary shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary'
                }
                `
              }
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </span>
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6">
          <Tab.Panel>
            <BookingHistory userId={userData.id} />
          </Tab.Panel>

          <Tab.Panel>
            <UserProfile
              userData={userData}
              onUpdate={(data) => {
                // TODO: Implement profile update
                console.log('Updating profile:', data);
              }}
            />
          </Tab.Panel>

          <Tab.Panel>
            <UserPreferences
              userId={userData.id}
              onUpdate={(preferences) => {
                // TODO: Implement preferences update
                console.log('Updating preferences:', preferences);
              }}
            />
          </Tab.Panel>

          <Tab.Panel>
            <SavedSpaces userId={userData.id} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          Quick Tips 🐾
        </h2>
        <ul className="list-disc list-inside space-y-2 text-blue-700">
          <li>View and manage your upcoming bookings in the Bookings tab</li>
          <li>Keep your profile information up to date for better communication</li>
          <li>Set your preferences to get personalized space recommendations</li>
          <li>Save your favorite spaces for quick access later</li>
        </ul>
      </div>
    </div>
  );
};
