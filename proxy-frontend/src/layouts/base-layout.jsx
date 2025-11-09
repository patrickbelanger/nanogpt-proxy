import { Outlet } from 'react-router';
import { Container } from '@mantine/core';
import TopHeader from '../components/navigations/top-header.jsx';

function BaseLayout() {
  return (
    <>
      <TopHeader />
      <Container size="xs">
        <Outlet />
      </Container>
    </>
  );
}

export default BaseLayout;
