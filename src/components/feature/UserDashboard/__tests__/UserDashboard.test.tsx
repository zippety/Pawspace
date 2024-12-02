import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserDashboard } from '../UserDashboard';
import { BrowserRouter } from 'react-router-dom';

// Mock child components
jest.mock('../BookingHistory', () => ({
  BookingHistory: () => <div data-testid="booking-history">Booking History</div>,
}));

jest.mock('../UserProfile', () => ({
  UserProfile: () => <div data-testid="user-profile">User Profile</div>,
}));

jest.mock('../UserPreferences', () => ({
  UserPreferences: () => <div data-testid="user-preferences">User Preferences</div>,
}));

jest.mock('../SavedSpaces', () => ({
  SavedSpaces: () => <div data-testid="saved-spaces">Saved Spaces</div>,
}));

describe('UserDashboard', () => {
  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <UserDashboard />
      </BrowserRouter>
    );
  };

  it('renders without crashing', () => {
    renderDashboard();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('displays all tab options', () => {
    renderDashboard();
    expect(screen.getByText(/bookings/i)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/preferences/i)).toBeInTheDocument();
    expect(screen.getByText(/saved spaces/i)).toBeInTheDocument();
  });

  it('shows booking history by default', () => {
    renderDashboard();
    expect(screen.getByTestId('booking-history')).toBeInTheDocument();
  });

  it('switches tabs correctly when clicked', () => {
    renderDashboard();

    // Click profile tab
    fireEvent.click(screen.getByText(/profile/i));
    expect(screen.getByTestId('user-profile')).toBeInTheDocument();

    // Click preferences tab
    fireEvent.click(screen.getByText(/preferences/i));
    expect(screen.getByTestId('user-preferences')).toBeInTheDocument();

    // Click saved spaces tab
    fireEvent.click(screen.getByText(/saved spaces/i));
    expect(screen.getByTestId('saved-spaces')).toBeInTheDocument();
  });

  it('maintains tab selection after re-render', () => {
    renderDashboard();

    // Switch to preferences tab
    fireEvent.click(screen.getByText(/preferences/i));
    expect(screen.getByTestId('user-preferences')).toBeInTheDocument();

    // Re-render component
    renderDashboard();
    expect(screen.getByTestId('user-preferences')).toBeInTheDocument();
  });
});
