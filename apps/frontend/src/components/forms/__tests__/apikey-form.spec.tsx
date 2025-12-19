import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

import ApiKeyForm from '../apikey-form.tsx';
import { renderWithProviders } from '../../../__tests__/utilities/test.utilities';
import i18nTest from '../../../i18ntest';

describe('<ApiKeyForm />', () => {
  beforeEach(async () => {
    await i18nTest.changeLanguage('en');
  });

  it('renders the translated title and the icon', () => {
    /* Arrange */
    renderWithProviders(<ApiKeyForm />);

    /* Act */
    const heading = screen.getByRole('heading', {
      level: 3,
      name: /api key/i,
    });

    /* Assert */
    expect(heading).toBeInTheDocument();

    const iconSvg = document.querySelector('svg');
    expect(iconSvg).toBeInTheDocument();
  });
});
