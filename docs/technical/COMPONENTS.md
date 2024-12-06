# PawSpace Components Documentation

## Overview
This document provides comprehensive documentation for all major components in PawSpace.

## Page Components

### 1. Become Host Page
**Location**: `/src/components/BecomeHostPage.tsx`

#### Purpose
Landing page designed to attract and convert property owners into PawSpace hosts.

#### Key Sections
1. **Hero Section**
   - Full-screen layout with background image
   - White overlay card with main content
   - Components:
     - Logo
     - Main heading
     - Earnings highlight ($3,000/month)
     - Primary CTA button

2. **Features Section**
   - Three-column layout
   - Benefits of hosting
   - Success stories

#### State Management
- Uses local state for form handling
- Integrates with global authentication state

### 2. Directory Page
**Location**: `/src/components/DirectoryPage.tsx`

#### Purpose
Main search and discovery interface for users to find pet-friendly spaces.

#### Key Components
1. **Map View**
   - Interactive Leaflet map
   - Custom markers for locations
   - Popup information windows
   - Zoom controls

2. **Search Interface**
   - Location search with autocomplete
   - Filter options
   - Sort functionality

3. **Listing Cards**
   - Property images
   - Basic information
   - Pricing
   - Availability status

#### Technical Implementation
- Uses Leaflet for map functionality
- Implements custom hooks for search and filtering
- Responsive grid layout for listings

### 3. List Property Page
**Location**: `/src/components/ListPropertyPage.tsx`

#### Purpose
Interface for hosts to list their properties and spaces.

#### Features
1. **Property Details Form**
   - Basic information
   - Location details
   - Amenities selection
   - Pricing setup

2. **Image Upload**
   - Multiple image upload
   - Preview functionality
   - Image optimization

#### State Management
- Form state using React Hook Form
- Image upload state
- Validation logic

## Shared Components

### 1. Navigation
**Location**: `/src/components/Navigation/`
- Header component
- Mobile menu
- User menu dropdown

### 2. UI Elements
**Location**: `/src/components/UI/`
- Buttons
- Input fields
- Cards
- Modal windows

### 3. Maps
**Location**: `/src/components/Maps/`
- Map container
- Custom markers
- Location search

## Component Dependencies
```
Navigation
└── Header
    ├── UserMenu
    └── MobileMenu

Pages
├── BecomeHostPage
│   ├── Hero
│   └── Features
├── DirectoryPage
│   ├── Map
│   ├── SearchBar
│   └── ListingGrid
└── ListPropertyPage
    ├── PropertyForm
    └── ImageUpload
```

## State Management
- Global state using Zustand
- Form state with React Hook Form
- Map state with Leaflet hooks

## Best Practices
1. Component organization follows atomic design principles
2. Consistent prop interfaces
3. Proper error boundary implementation
4. Performance optimization through lazy loading
5. Accessibility considerations in all interactive elements
