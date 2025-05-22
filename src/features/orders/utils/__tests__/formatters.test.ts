
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDateTimeLocal } from '../formatters';

describe('formatters utils', () => {
  describe('formatCurrency', () => {
    it('should format a number as BRL currency', () => {
      const result = formatCurrency(1234.56);
      expect(result).toMatch(/^R\$\s1.234,56$/);
    });

    it('should handle zero values', () => {
      const result = formatCurrency(0);
      expect(result).toMatch(/^R\$\s0,00$/);
    });

    it('should handle undefined values', () => {
      const result = formatCurrency(undefined);
      expect(result).toMatch(/^R\$\s0,00$/);
    });
  });

  describe('formatDateTimeLocal', () => {
    it('should format date string to local date and time', () => {
      const date = '2023-01-15T14:30:00.000Z';
      const formattedDate = formatDateTimeLocal(date);
      
      expect(formattedDate).toContain('2023');
    });
  });
});
