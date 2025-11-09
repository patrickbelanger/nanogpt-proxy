import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router';

export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<>App</>} exact />
          <Route path="*" element={<>Not Found</>} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
