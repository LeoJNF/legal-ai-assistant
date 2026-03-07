import {
  formatDate,
  formatFileSize,
  truncateText,
  slugify,
  isOverdue,
  daysUntilDeadline,
  addBusinessDays,
  calculateBusinessDays,
} from '../utils';

describe('Shared Utils', () => {
  describe('formatDate', () => {
    it('should format a date to Brazilian format', () => {
      const date = new Date('2024-01-15T00:00:00.000Z');
      const result = formatDate(date);
      expect(result).toMatch(/15\/01\/2024/);
    });

    it('should accept a string date', () => {
      const result = formatDate('2024-03-20T00:00:00.000Z');
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe('formatFileSize', () => {
    it('should format 0 bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    });

    it('should format partial MB', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });
  });

  describe('truncateText', () => {
    it('should not truncate short text', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe(text);
    });

    it('should truncate long text with ellipsis', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text, 20);
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBe(23);
    });
  });

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should handle accented characters', () => {
      expect(slugify('Petição Jurídica')).toBe('peticao-juridica');
    });

    it('should handle multiple spaces and special chars', () => {
      expect(slugify('Habeas Corpus!!!')).toBe('habeas-corpus');
    });
  });

  describe('isOverdue', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(isOverdue(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date('2099-12-31');
      expect(isOverdue(futureDate)).toBe(false);
    });
  });

  describe('daysUntilDeadline', () => {
    it('should return negative for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(daysUntilDeadline(pastDate)).toBeLessThan(0);
    });

    it('should return positive for future dates', () => {
      const futureDate = new Date('2099-12-31');
      expect(daysUntilDeadline(futureDate)).toBeGreaterThan(0);
    });
  });

  describe('calculateBusinessDays', () => {
    it('should count business days between dates', () => {
      const start = new Date('2024-01-01'); // Monday
      const end = new Date('2024-01-07'); // Sunday
      const days = calculateBusinessDays(start, end);
      expect(days).toBe(5); // Mon-Fri
    });
  });

  describe('addBusinessDays', () => {
    it('should add business days skipping weekends', () => {
      const friday = new Date('2024-01-05'); // Friday
      const result = addBusinessDays(friday, 1);
      expect(result.getDay()).toBe(1); // Should be Monday
    });
  });
});
