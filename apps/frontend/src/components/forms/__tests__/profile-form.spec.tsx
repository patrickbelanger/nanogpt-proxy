import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

import ProfileForm from '../profile-form.tsx';
import { renderWithProviders } from '../../../__tests__/utilities/test.utilities';
import i18nTest from '../../../i18ntest';

describe('<ProfileForm />', () => {
  beforeEach(async () => {
    await i18nTest.changeLanguage('en');
  });

  it('renders the translated title and the icon', () => {
    /* Arrange */
    renderWithProviders(<ProfileForm />);

    /* Act */
    const heading = screen.getByRole('heading', {
      level: 3,
      name: /profile/i,
    });

    /* Assert */
    expect(heading).toBeInTheDocument();

    const iconSvg = document.querySelector('svg');
    expect(iconSvg).toBeInTheDocument();
  });
});
