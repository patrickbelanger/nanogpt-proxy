import { describe, it, expect } from 'vitest';
import {
  validatePasswordRaw,
  PASSWORD_MIN_LENGTH,
  SPECIAL_CHARS_REGEX,
  type PasswordValidationResult,
} from '../password-validation.utilities';

describe('validatePasswordRaw', () => {
  it('returns valid=true when all rules are satisfied', () => {
    /* Arrange */
    const password = 'Abcdef!';

    /* Act */
    const result: PasswordValidationResult = validatePasswordRaw(password);

    /* Assert */
    expect(result).toEqual({ valid: true });
  });

  it('fails with rule "min" when password is shorter than PASSWORD_MIN_LENGTH', () => {
    /* Arrange */
    const shortPassword = 'Ab!a'; // length < 6

    /* Act */
    const result = validatePasswordRaw(shortPassword);

    /* Assert */
    expect(result.valid).toBe(false);
    expect(result.failedRule).toBe('min');
  });

  it('accepts a password exactly at PASSWORD_MIN_LENGTH when all other rules pass', () => {
    /* Arrange */
    const base = 'Ab!'; // 3 chars, we add lowercases to reach min length
    const paddingLength = PASSWORD_MIN_LENGTH - base.length;
    const password = base + 'a'.repeat(paddingLength); // ex: "Ab!aaa" for min=6

    /* Act */
    const result = validatePasswordRaw(password);

    /* Assert */
    expect(password.length).toBeGreaterThanOrEqual(PASSWORD_MIN_LENGTH);
    expect(result.valid).toBe(true);
    expect(result.failedRule).toBeUndefined();
  });

  it('fails with rule "uppercase" when missing uppercase letters', () => {
    /* Arrange */
    const password = 'abcdef!'; // no A-Z

    /* Act */
    const result = validatePasswordRaw(password);

    /* Assert */
    expect(result.valid).toBe(false);
    expect(result.failedRule).toBe('uppercase');
  });

  it('fails with rule "lowercase" when missing lowercase letters', () => {
    /* Arrange */
    const password = 'ABCDEF!'; // no a-z

    /* Act */
    const result = validatePasswordRaw(password);

    /* Assert */
    expect(result.valid).toBe(false);
    expect(result.failedRule).toBe('lowercase');
  });

  it('fails with rule "special" when missing special characters', () => {
    /* Arrange */
    const password = 'Abcdef1'; // no special char from SPECIAL_CHARS_REGEX

    /* Act */
    const result = validatePasswordRaw(password);

    /* Assert */
    expect(result.valid).toBe(false);
    expect(result.failedRule).toBe('special');
  });

  it('trims the password before validation', () => {
    /* Arrange */
    const password = '   Abcdef!   ';

    /* Act */
    const result = validatePasswordRaw(password);

    /* Assert */
    expect(result.valid).toBe(true);
    expect(result.failedRule).toBeUndefined();
  });

  it('uses SPECIAL_CHARS_REGEX consistently for special character detection', () => {
    /* Arrange */
    const specialChars = '!@#$%^&*()-_=+[{]}\\;:,.<>/?';
    const hasSpecial = SPECIAL_CHARS_REGEX.test(specialChars);

    /* Assert */
    expect(hasSpecial).toBe(true);

    const password = `Abcdef${specialChars[0]}`;
    const result = validatePasswordRaw(password);
    expect(result.valid).toBe(true);
  });
});
