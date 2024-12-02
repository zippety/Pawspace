import React from 'react';
import { format } from 'date-fns';
import { UserProfile, HostStats } from '../../types/user';
import { cn } from '../../utils/cn';
import { Shield, Clock, MessageCircle, Star, Award, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { withErrorBoundary } from '../../utils/errorTracking';
import { useOwnerData } from '../../hooks/useOwnerData';

interface PropertyOwnerInfoProps {
  ownerId: string;
  className?: string;
}

function PropertyOwnerInfoContent({ ownerId, className }: PropertyOwnerInfoProps) {
  const { owner, hostStats, isLoading, error, refetch } = useOwnerData(ownerId);

  const formatResponseTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  };

  if (isLoading) {
    return (
      <div className={cn('bg-white rounded-lg shadow-sm p-6 animate-pulse', className)}>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('bg-white rounded-lg shadow-sm p-6', className)}>
        <div className="flex flex-col items-center text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Failed to load host information</h3>
            <p className="text-sm text-gray-500 mt-1">
              {error.message}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!owner || !hostStats) {
    return null;
  }

  return (
    <div className={cn('bg-white rounded-lg shadow-sm p-6', className)}>
      {/* Owner Header */}
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={owner.avatar || '/default-avatar.png'}
            alt={owner.fullName}
            className="w-16 h-16 rounded-full object-cover"
          />
          {owner.verificationStatus === 'verified' && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">{owner.fullName}</h3>
            {owner.verificationStatus === 'verified' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Verified Host
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Hosting since {format(new Date(owner.hostingSince || owner.joinedDate), 'MMMM yyyy')}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">{hostStats.totalBookings}+ bookings</p>
            <p className="text-xs text-gray-500">Trusted host</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {formatResponseTime(hostStats.avgResponseTime)}
            </p>
            <p className="text-xs text-gray-500">Average response time</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-purple-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">{hostStats.responseRate}%</p>
            <p className="text-xs text-gray-500">Response rate</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">{hostStats.rating.toFixed(1)}</p>
            <p className="text-xs text-gray-500">{hostStats.reviewCount} reviews</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      {owner.badges && owner.badges.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Host Achievements</h4>
          <div className="flex flex-wrap gap-2">
            {owner.badges.map((badge) => (
              <div
                key={badge.id}
                className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                <Award className="w-4 h-4 mr-1" />
                {badge.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const PropertyOwnerInfo = withErrorBoundary('PropertyOwnerInfo')(PropertyOwnerInfoContent);
