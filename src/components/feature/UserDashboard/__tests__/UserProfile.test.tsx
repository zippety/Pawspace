import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from '../UserProfile';

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '123-456-7890',
  bio: 'Dog lover and outdoor enthusiast',
  avatar: 'https://example.com/avatar.jpg',
};

// Mock API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockUser),
    ok: true,
  })
) as jest.Mock;

describe('UserProfile', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders user profile form with data', async () => {
    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123-456-7890')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Dog lover and outdoor enthusiast')).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });

    // Clear required fields
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);

    userEvent.clear(nameInput);
    userEvent.clear(emailInput);

    // Try to submit form
    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    });

    // Enter invalid email
    const emailInput = screen.getByLabelText(/email/i);
    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'invalid-email');

    // Try to submit form
    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('handles successful profile update', async () => {
    const mockUpdateResponse = { success: true, message: 'Profile updated successfully' };
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUpdateResponse),
        ok: true,
      })
    );

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });

    // Update name
    const nameInput = screen.getByLabelText(/name/i);
    userEvent.clear(nameInput);
    userEvent.type(nameInput, 'Jane Doe');

    // Submit form
    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });
  });

  it('handles avatar upload', async () => {
    render(<UserProfile />);

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const input = screen.getByLabelText(/upload avatar/i);

    userEvent.upload(input, file);

    await waitFor(() => {
      expect(input.files![0]).toBe(file);
      expect(input.files!.length).toBe(1);
    });
  });

  it('handles error during profile update', async () => {
    // Mock API error
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to update profile'))
    );

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });

    // Try to submit form
    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(screen.getByText(/failed to update profile/i)).toBeInTheDocument();
    });
  });
});
