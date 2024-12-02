import { formatCurrency, formatDate } from '../formatters';

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(10.5)).toBe('$10.50');
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('formatDate', () => {
  it('formats dates correctly', () => {
    const date = new Date('2024-03-15T12:00:00');
    expect(formatDate(date)).toBe('March 15, 2024');
  });
});
