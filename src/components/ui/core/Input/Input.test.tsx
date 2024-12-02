import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('border-gray-300');
  });

  it('renders with label', () => {
    render(<Input label="Username" placeholder="Enter username" />);
    const label = screen.getByText('Username');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'username');
    expect(screen.getByPlaceholderText('Enter username')).toHaveAttribute('id', 'username');
  });

  it('renders different variants', () => {
    const { rerender } = render(<Input variant="error" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');

    rerender(<Input variant="success" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-green-500');
  });

  it('renders different sizes', () => {
    const { rerender } = render(<Input size="sm" />);
    expect(screen.getByRole('textbox')).toHaveClass('h-8');

    rerender(<Input size="default" />);
    expect(screen.getByRole('textbox')).toHaveClass('h-10');

    rerender(<Input size="lg" />);
    expect(screen.getByRole('textbox')).toHaveClass('h-12');
  });

  it('renders full width input', () => {
    render(<Input fullWidth />);
    expect(screen.getByRole('textbox')).toHaveClass('w-full');
  });

  it('renders with error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders with icons', () => {
    const leftIcon = <span data-testid="left-icon">🔍</span>;
    const rightIcon = <span data-testid="right-icon">✓</span>;

    render(<Input leftIcon={leftIcon} rightIcon={rightIcon} />);

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('pl-10', 'pr-10');
  });

  it('handles user input', async () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test');

    expect(handleChange).toHaveBeenCalledTimes(4);
    expect(input).toHaveValue('test');
  });

  it('handles disabled state', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('maintains accessibility attributes', () => {
    render(
      <Input
        label="Email"
        error="Invalid email"
        aria-label="Email input"
        aria-required="true"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Email input');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
  });
});
