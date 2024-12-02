import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { defaultIcon } from '../utils/leaflet-setup';
import { Link } from 'react-router-dom';

interface FormData {
  address: string;
  isFenced: string;
  size: string;
  photos: File[];
}

export const ListPropertyPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    address: '15 Field Sparroway, North York, Ontario, M2H',
    isFenced: '',
    size: '',
    photos: []
  });

  const [position] = useState<[number, number]>([43.7615, -79.4111]); // Default to North York coordinates

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        photos: [...Array.from(e.target.files!)]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/pawspace-logo.svg"
            alt="PawSpace"
            className="h-8"
          />
        </div>

        {/* Form Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          List your property on PawSpace!
        </h1>

        {/* Form */}
        <form className="space-y-6">
          {/* Street Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Street address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Map */}
          <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
            <MapContainer
              center={position}
              zoom={15}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={position} icon={defaultIcon} />
            </MapContainer>
          </div>

          {/* Is spot fenced */}
          <div>
            <label htmlFor="isFenced" className="block text-sm font-medium text-gray-700">
              Is your spot fenced?
            </label>
            <select
              id="isFenced"
              name="isFenced"
              value={formData.isFenced}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Please choose</option>
              <option value="fully">Fully fenced</option>
              <option value="partially">Partially fenced</option>
              <option value="no">Not fenced</option>
            </select>
          </div>

          {/* Spot size */}
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              How large is your spot?
            </label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Please choose</option>
              <option value="small">Small (under 0.25 acres)</option>
              <option value="medium">Medium (0.25-1 acres)</option>
              <option value="large">Large (over 1 acre)</option>
            </select>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Add photos <span className="text-gray-500">(optional)</span>
            </label>
            <p className="text-sm text-gray-500 mb-2">
              10+ photos recommended. Include the space, fencing and parking area.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <button
                type="button"
                onClick={() => document.getElementById('photo-upload')?.click()}
                className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Upload photos
              </button>
              <input
                type="file"
                id="photo-upload"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-2">
                Click the button to upload your spot's photos
              </p>
            </div>

            {/* Mobile Upload Option */}
            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Take photos with your phone</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                You can continue this process on your mobile device.
              </p>
              <button
                type="button"
                className="mt-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Get started
              </button>
            </div>
          </div>

          {/* Terms and Submit */}
          <div className="space-y-4">
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-500">
                I agree to our{' '}
                <Link to="/inclusion-policy" className="text-green-600 hover:text-green-500">
                  Inclusion Policy
                </Link>
                ,{' '}
                <Link to="/waiver" className="text-green-600 hover:text-green-500">
                  Waiver & Release
                </Link>
                {' '}and{' '}
                <Link to="/terms" className="text-green-600 hover:text-green-500">
                  Terms of Service
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white rounded-md py-2 px-4 text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Publish spot!
            </button>

            <p className="text-sm text-gray-500 text-center">
              You'll be able to manage your spot information and pricing in the following step.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListPropertyPage;
