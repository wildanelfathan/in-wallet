import {
  formatCurrency,
  formatDate,
  formatPhoneNumber,
  formatCardNumber,
} from '../formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats USD correctly', () => {
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
      expect(formatCurrency(0.99, 'USD')).toBe('$0.99');
      expect(formatCurrency(1000000, 'USD')).toBe('$1,000,000.00');
      expect(formatCurrency(-1234.56, 'USD')).toBe('-$1,234.56');
    });

    it('formats EUR correctly', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
      expect(formatCurrency(0.99, 'EUR')).toBe('€0.99');
      expect(formatCurrency(1000000, 'EUR')).toBe('€1,000,000.00');
      expect(formatCurrency(-1234.56, 'EUR')).toBe('-€1,234.56');
    });

    it('formats GBP correctly', () => {
      expect(formatCurrency(1234.56, 'GBP')).toBe('£1,234.56');
      expect(formatCurrency(0.99, 'GBP')).toBe('£0.99');
      expect(formatCurrency(1000000, 'GBP')).toBe('£1,000,000.00');
      expect(formatCurrency(-1234.56, 'GBP')).toBe('-£1,234.56');
    });

    it('always shows 2 decimal places', () => {
      expect(formatCurrency(1234, 'USD')).toBe('$1,234.00');
      expect(formatCurrency(1234.5, 'USD')).toBe('$1,234.50');
      expect(formatCurrency(1234.567, 'USD')).toBe('$1,234.57');
    });
  });

  describe('formatDate', () => {
    it('formats dates correctly', () => {
      const date = new Date('2024-03-15T14:30:00Z');
      expect(formatDate(date)).toBe('Mar 15, 2024, 2:30 PM');
    });

    it('handles different timezones correctly', () => {
      const date = new Date('2024-03-15T00:00:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Mar 1[45], 2024/); // Depends on timezone
    });

    it('formats dates with single-digit days', () => {
      const date = new Date('2024-03-05T14:30:00Z');
      expect(formatDate(date)).toBe('Mar 5, 2024, 2:30 PM');
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats US phone numbers correctly', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
      expect(formatPhoneNumber('0001234567')).toBe('(000) 123-4567');
    });

    it('handles phone numbers with non-digit characters', () => {
      expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890');
      expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890');
    });

    it('returns original string if format does not match', () => {
      expect(formatPhoneNumber('12345')).toBe('12345');
      expect(formatPhoneNumber('1234567890123')).toBe('1234567890123');
    });
  });

  describe('formatCardNumber', () => {
    it('formats card numbers with spaces', () => {
      expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
      expect(formatCardNumber('5555555555554444')).toBe('5555 5555 5555 4444');
    });

    it('handles card numbers with existing spaces', () => {
      expect(formatCardNumber('4111 1111 1111 1111')).toBe('4111 1111 1111 1111');
    });

    it('handles card numbers with non-digit characters', () => {
      expect(formatCardNumber('4111-1111-1111-1111')).toBe('4111 1111 1111 1111');
    });

    it('returns original string if format does not match', () => {
      expect(formatCardNumber('411111')).toBe('411111');
      expect(formatCardNumber('41111111111111111')).toBe('41111111111111111');
    });
  });
}); 