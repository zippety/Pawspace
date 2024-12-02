import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { supabase } from '../../../utils/supabase';
import { Property } from '../../../types/property';
import { BookingManagement } from '../../../components/property/BookingManagement';
import { startTransaction } from '../../../utils/sentry';

interface PropertyManagementPageProps {
  property: Property;
}

export default function PropertyManagementPage({ property }: PropertyManagementPageProps) {
  const router = useRouter();

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Property Not Found</h1>
        <button
          onClick={() => router.push('/properties')}
          className="text-primary-600 hover:text-primary-700"
        >
          View All Properties
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              <p className="mt-1 text-sm text-gray-500">{property.address}</p>
            </div>
            <button
              onClick={() => router.push(`/property/${property.id}`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View Property
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <BookingManagement property={property} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const transaction = startTransaction({
    name: 'getServerSideProps_propertyManagement',
    data: { propertyId: params?.id },
  });

  try {
    // Get the current user
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) throw authError;

    if (!session) {
      transaction?.setStatus('not_authenticated');
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    // Get the property
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', params?.id)
      .single();

    if (propertyError) throw propertyError;

    // Check if the current user is the property owner
    if (property.ownerId !== session.user.id) {
      transaction?.setStatus('unauthorized');
      return {
        redirect: {
          destination: '/properties',
          permanent: false,
        },
      };
    }

    transaction?.setStatus('ok');
    return {
      props: {
        property,
      },
    };
  } catch (error) {
    transaction?.setStatus('error');
    return {
      redirect: {
        destination: '/properties',
        permanent: false,
      },
    };
  } finally {
    transaction?.end();
  }
};
