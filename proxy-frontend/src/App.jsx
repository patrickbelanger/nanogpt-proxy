import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router';
import BaseLayout from './layouts/base-layout.jsx';

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BaseLayout />}>
            <Route index element={<>Index Level</>} />
          </Route>
          <Route path="*" element={<>Not Found</>} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
