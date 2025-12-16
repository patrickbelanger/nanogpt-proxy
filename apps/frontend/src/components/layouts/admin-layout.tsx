import { Outlet } from 'react-router';
import { AppShell, Container } from '@mantine/core';
import TopHeader from '../elements/headers/top-header.tsx';
import Navbar from '../navigation/nav-bar.tsx';

function AdminLayout() {
  return (
    <AppShell padding="md" header={{ height: 60 }} navbar={{ width: 260, breakpoint: 'xs' }}>
      <AppShell.Header>
        <TopHeader />
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Container size="lg" px="md">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default AdminLayout;
