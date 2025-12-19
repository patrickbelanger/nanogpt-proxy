import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

import AdministerForm from '../administer-form';
import { renderWithProviders } from '../../../__tests__/utilities/test.utilities';
import i18nTest from '../../../i18ntest';

describe('<AdministerForm />', () => {
  beforeEach(async () => {
    await i18nTest.changeLanguage('en');
  });

  it('renders the translated title and the icon', () => {
    /* Arrange */
    renderWithProviders(<AdministerForm />);

    /* Act */
    const heading = screen.getByRole('heading', {
      level: 3,
      name: /administer/i,
    });

    /* Assert */
    expect(heading).toBeInTheDocument();

    const iconSvg = document.querySelector('svg');
    expect(iconSvg).toBeInTheDocument();
  });
});
