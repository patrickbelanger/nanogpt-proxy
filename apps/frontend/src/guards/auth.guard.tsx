import { Center, Loader } from '@mantine/core';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export function AuthGuard() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
