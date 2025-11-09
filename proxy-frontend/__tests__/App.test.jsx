import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../src/App.jsx';

describe('<App />', () => {
  beforeEach(() => {});

  it('renders', () => {
    const queryClient = new QueryClient();

    const { container } = render(
      <MantineProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MantineProvider>,
    );

    expect(container).toBeInTheDocument();
  });
});
