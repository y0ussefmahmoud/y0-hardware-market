// ===== Security Utilities Tests =====
// Unit tests for security utilities

import { rateLimit, sanitizeInput, isValidEmail, isValidPhone, rateLimitMap, validateCSRFToken } from '../security';

describe('Security Utilities', () => {
  describe('rateLimit', () => {
    beforeEach(() => {
      // Clear the rate limit map before each test
      rateLimitMap.clear();
    });

    it('should allow requests within limit', async () => {
      const identifier = 'test-user';
      const result = await rateLimit(identifier, 5, 60000);
      
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should block requests exceeding limit', async () => {
      const identifier = 'test-user';
      
      // Make 5 requests (at limit)
      for (let i = 0; i < 5; i++) {
        await rateLimit(identifier, 5, 60000);
      }
      
      // 6th request should be blocked
      const result = await rateLimit(identifier, 5, 60000);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize HTML tags', () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate Egyptian phone numbers', () => {
      expect(isValidPhone('01012345678')).toBe(true);
      expect(isValidPhone('01112345678')).toBe(true);
      expect(isValidPhone('01212345678')).toBe(true);
      expect(isValidPhone('01512345678')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('12345678')).toBe(false);
      expect(isValidPhone('0101234567')).toBe(false);
      expect(isValidPhone('010123456789')).toBe(false);
    });
  });

  describe('validateCSRFToken', () => {
    it('should accept matching tokens', () => {
      expect(validateCSRFToken('abc', 'abc')).toBe(true);
    });

    it('should reject mismatched tokens', () => {
      expect(validateCSRFToken('abc', 'def')).toBe(false);
    });
  });
});
