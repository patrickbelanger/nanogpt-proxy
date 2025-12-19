import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

import PasswordStrengthMeter from '../password-strength-meter';
import i18nTest from '../../../i18ntest.ts';
import { renderWithProviders } from '../../../__tests__/utilities/test.utilities.tsx';

describe('<PasswordStrengthMeter />', () => {
  beforeEach(async () => {
    await i18nTest.changeLanguage('en');
  });

  it('renders base rules when password is empty', () => {
    /* Act*/
    renderWithProviders(<PasswordStrengthMeter password="" />);

    /* Assert */
    expect(screen.getByText('Password strength')).toBeInTheDocument();

    expect(screen.getByText('At least 6 characters')).toBeInTheDocument();
    expect(screen.getByText('At least one uppercase letter (A–Z)')).toBeInTheDocument();
    expect(screen.getByText('At least one lowercase letter (a–z)')).toBeInTheDocument();
    expect(
      screen.getByText('At least one special character (e.g. ! @ # $ % & *)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Must not contain your username or email part')).toBeInTheDocument();
  });

  it('shows "weak" label for a very weak password', () => {
    /* Act */
    renderWithProviders(<PasswordStrengthMeter password="123" />);

    /* Assert */
    expect(screen.getByText(/Password strength.*:.*Weak/i)).toBeInTheDocument();
  });

  it('shows "fair" label for a weak password', () => {
    /* Act */
    renderWithProviders(<PasswordStrengthMeter password="abc" />);

    /* Assert */
    expect(screen.getByText(/Password strength.*:.*Fair/i)).toBeInTheDocument();
  });

  it('gives full strength (100) for a strong password without username/email', () => {
    /* Arrange */
    const strongPassword = 'Abcdef1!';

    /* Act */
    renderWithProviders(<PasswordStrengthMeter password={strongPassword} />);

    const progress = screen.getByRole('progressbar') as HTMLElement;
    const value = progress.getAttribute('aria-valuenow');

    /* Assert */
    expect(value).toBe('100');
    expect(screen.getByText(/Password strength.*:.*Strong/i)).toBeInTheDocument();
  });

  it('reduces strength when password contains the username part', () => {
    /* Arrange */
    const password = 'Abcusername1!';
    const username = 'username@example.com';

    /* Act */
    renderWithProviders(<PasswordStrengthMeter password={password} usernameOrEmail={username} />);

    const progress = screen.getByRole('progressbar') as HTMLElement;
    const value = progress.getAttribute('aria-valuenow');

    /* Assert */
    expect(value).toBe('80');

    expect(screen.getByText(/Password strength.*:.*Strong/i)).toBeInTheDocument();
  });

  it('keeps full strength when username is not provided', () => {
    /* Arrange */
    const password = 'Abcusername1!';

    /* Act */
    renderWithProviders(<PasswordStrengthMeter password={password} />);

    const progress = screen.getByRole('progressbar') as HTMLElement;
    const value = progress.getAttribute('aria-valuenow');

    /* Assert */
    expect(value).toBe('100');
  });
});
