export const PASSWORD_MIN_LENGTH = 6;
export const SPECIAL_CHARS_REGEX = /[!@#$%^&*()\-_=+[{}\];:,.<>/?]/;

export type PasswordRuleId = 'min' | 'uppercase' | 'lowercase' | 'special';

export type PasswordValidationResult = {
  valid: boolean;
  failedRule?: PasswordRuleId;
};

export function validatePasswordRaw(value: string): PasswordValidationResult {
  const trimmed = value.trim();

  if (trimmed.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, failedRule: 'min' };
  }
  if (!/[A-Z]/.test(trimmed)) {
    return { valid: false, failedRule: 'uppercase' };
  }
  if (!/[a-z]/.test(trimmed)) {
    return { valid: false, failedRule: 'lowercase' };
  }
  if (!SPECIAL_CHARS_REGEX.test(trimmed)) {
    return { valid: false, failedRule: 'special' };
  }

  return { valid: true };
}
