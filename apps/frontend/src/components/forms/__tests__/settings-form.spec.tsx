import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

import { renderWithProviders } from '../../../__tests__/utilities/test.utilities';
import i18nTest from '../../../i18ntest';
import SettingsForm from '../settings-form.tsx';

describe('<SettingsForm />', () => {
  beforeEach(async () => {
    await i18nTest.changeLanguage('en');
  });

  it('renders the translated title and the icon', () => {
    /* Arrange */
    renderWithProviders(<SettingsForm />);

    /* Act */
    const heading = screen.getByRole('heading', {
      level: 3,
      name: /settings/i,
    });

    /* Assert */
    expect(heading).toBeInTheDocument();

    const iconSvg = document.querySelector('svg');
    expect(iconSvg).toBeInTheDocument();
  });
});
