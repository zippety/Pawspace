import React from 'react';
import {
  Coffee,
  PawPrint,
  Waves,
  Mountain,
  Fence,
  Target,
  Beach,
  Home,
  Dog,
  Trees
} from 'lucide-react';
import type { LocationType } from '../types';

export const getLocationTypeIcon = (type: LocationType) => {
  const icons: Record<LocationType, React.ReactNode> = {
    catCafe: <Coffee className="h-4 w-4" />,
    dogPark: <PawPrint className="h-4 w-4" />,
    waterPark: <Waves className="h-4 w-4" />,
    hikingTrail: <Mountain className="h-4 w-4" />,
    fencedPark: <Fence className="h-4 w-4" />,
    agilityPark: <Target className="h-4 w-4" />,
    dogBeach: <Beach className="h-4 w-4" />,
    indoorFacility: <Home className="h-4 w-4" />,
    smallDogArea: <Dog className="h-4 w-4" />,
    openField: <Trees className="h-4 w-4" />
  };

  return icons[type];
};
