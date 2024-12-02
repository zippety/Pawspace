import { Icon } from 'leaflet';
import type { LocationType } from '../types';

const defaultIcon = new Icon({
  iconUrl: '/icons/paw-print.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const getMarkerIcon = (_type: LocationType) => defaultIcon;
