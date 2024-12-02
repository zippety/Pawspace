# List Property Page Documentation

## Overview
The List Property Page is a form-based interface that allows property owners to list their spaces on PawSpace. It closely follows the Sniffspot design pattern and user flow.

## Component Location
`/src/components/ListPropertyPage.tsx`

## Features

### 1. Form Fields
- Street Address Input
  - Text input with autocomplete support
  - Displays current address with map preview

- Property Details
  - Fencing status dropdown
  - Property size selection
  - Photo upload functionality

- Terms Agreement
  - Checkbox for terms acceptance
  - Links to policy documents

### 2. Map Integration
- Interactive OpenStreetMap display
- Marker showing property location
- Automatic centering based on address

### 3. Photo Upload
- Multiple photo upload support
- Desktop upload button
- Mobile upload option
- Progress indicators
- File type validation

## State Management

```typescript
interface FormData {
  address: string;
  isFenced: string;
  size: string;
  photos: File[];
}
```

## User Flow
1. Enter street address
2. Verify location on map
3. Select fencing status
4. Choose property size
5. Upload photos (optional)
6. Accept terms
7. Submit listing

## UI Components

### Form Elements
- Text inputs with labels
- Dropdown selects
- Checkbox for terms
- Submit button
- Photo upload button

### Styling
- Consistent green brand color
- Clean, minimal design
- Responsive layout
- Clear typography hierarchy

## Validation Rules

### Required Fields
- Street address
- Fencing status
- Property size
- Terms agreement

### Photo Upload
- Accepts: jpg, png, webp
- Max size: 10MB per photo
- Recommended: 10+ photos

## Error Handling
- Form validation errors
- Map loading failures
- Photo upload issues
- Network connectivity problems

## Dependencies
- React
- React Router DOM
- Leaflet/React Leaflet
- Tailwind CSS

## Integration Points

### API Endpoints
```typescript
POST /api/listings/create
POST /api/photos/upload
GET /api/geocode
```

### External Services
- OpenStreetMap for mapping
- Geocoding service
- Image processing service

## Testing Scenarios

### Unit Tests
- Form validation
- Photo upload handling
- Map marker placement
- Terms agreement logic

### Integration Tests
- Address verification
- Photo upload flow
- Form submission
- Map integration

### UI Tests
- Responsive layout
- Button states
- Error messages
- Loading states

## Performance Considerations

### Optimizations
- Lazy loading for map
- Image compression
- Debounced address lookup
- Progressive form loading

### Metrics
- Time to interactive
- Photo upload speed
- Map rendering time
- Form submission latency

## Accessibility

### ARIA Labels
```html
aria-label="Street address input"
aria-required="true"
aria-invalid="false"
```

### Keyboard Navigation
- Tab order
- Focus management
- Button accessibility
- Form field labels

## Future Enhancements
1. Real-time address validation
2. Drag-and-drop photo upload
3. Virtual property tour upload
4. Social media integration
5. Property preview mode

## Related Components
- `MapComponent`
- `PhotoUploader`
- `AddressAutocomplete`
- `TermsAgreement`

## Usage Example
```tsx
import { ListPropertyPage } from '../components/ListPropertyPage';

function App() {
  return (
    <Routes>
      <Route path="/list-property" element={<ListPropertyPage />} />
    </Routes>
  );
}
```

## Maintenance Notes
- Regular map API updates
- Photo storage optimization
- Form field validation rules
- Terms and conditions updates
- Accessibility compliance checks
