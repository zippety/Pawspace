import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Upload, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultCenter = {
  lat: 43.6532,
  lng: -79.3832
};

export default function ListingModal({ isOpen, onClose }: ListingModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedLocation, setSelectedLocation] = React.useState(defaultCenter);

  const onSubmit = (data: any) => {
    console.log({ ...data, location: selectedLocation });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">List Your Dog Park Space</h2>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Space Name
                    </label>
                    <input
                      {...register('name', { required: true })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Riverside Dog Haven"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">Name is required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register('description', { required: true })}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Describe your space..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size (acres)
                      </label>
                      <input
                        type="number"
                        {...register('size', { required: true, min: 0.1 })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price per hour
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          {...register('price', { required: true, min: 1 })}
                          className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="h-64 rounded-lg overflow-hidden">
                      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                        <GoogleMap
                          mapContainerStyle={{ width: '100%', height: '100%' }}
                          center={defaultCenter}
                          zoom={10}
                          onClick={(e) => {
                            if (e.latLng) {
                              setSelectedLocation({
                                lat: e.latLng.lat(),
                                lng: e.latLng.lng(),
                              });
                            }
                          }}
                        >
                          {selectedLocation && (
                            <Marker position={selectedLocation} />
                          )}
                        </GoogleMap>
                      </LoadScript>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Photos
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500">
                            <span>Upload files</span>
                            <input
                              type="file"
                              multiple
                              className="sr-only"
                              {...register('photos')}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB each
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                    >
                      List Space
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
