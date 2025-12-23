import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../apis/api';
import { getAccessToken } from '../utilities/cookies.utilities';
import { api } from '../apis/axios-client.ts';
import type { UserRole, UsersDto } from '../dtos/users.dto';
import type { PageDto } from '../components/elements/tables/pagination-types.ts';

export type DeleteUserPayload = {
  email: string;
};

export type UpdateUserPayload = {
  email: string;
  password?: string;
  api_key?: string;
  role?: UserRole;
  enabled?: boolean;
};

async function deleteUser(payload: DeleteUserPayload): Promise<void> {
  const token = getAccessToken();

  if (!token) {
    throw new Error('Missing access token');
  }

  await api.delete<void>(`${API_BASE_URL}/v1/users`, {
    data: payload,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

async function putUser(payload: UpdateUserPayload): Promise<UsersDto> {
  const token = getAccessToken();

  if (!token) {
    throw new Error('Missing access token');
  }

  const response = await api.put<UsersDto>(`${API_BASE_URL}/v1/users`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}

async function putUsers(payload: UpdateUserPayload[]): Promise<UsersDto[]> {
  const token = getAccessToken();

  if (!token) {
    throw new Error('Missing access token');
  }

  const response = await api.put<UsersDto[]>(`${API_BASE_URL}/v1/users/bulk`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}

export function useUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation<UsersDto, Error, UpdateUserPayload>({
    mutationFn: putUser,
    async onSuccess(updatedUser) {
      queryClient.setQueriesData<PageDto<UsersDto>>(
        { queryKey: ['users'], exact: false },
        (old) => {
          if (!old) {
            return old;
          }
          return {
            ...old,
            data: old.data.map((u) => (u.email === updatedUser.email ? updatedUser : u)),
          };
        },
      );

      await queryClient.invalidateQueries({
        queryKey: ['users'],
        refetchType: 'active',
      });
    },
  });

  const deleteMutation = useMutation<void, Error, DeleteUserPayload>({
    mutationFn: deleteUser,
    async onSuccess(_, payload) {
      queryClient.setQueriesData<PageDto<UsersDto>>(
        { queryKey: ['users'], exact: false },
        (old) => {
          if (!old) {
            return old;
          }

          const newData = old.data.filter((u) => u.email !== payload.email);

          return {
            ...old,
            data: newData,
            meta: {
              ...old.meta,
              totalItems: old.meta.totalItems - 1,
            },
          };
        },
      );
    },
  });

  const bulkMutation = useMutation<UsersDto[], Error, UpdateUserPayload[]>({
    mutationFn: putUsers,
    async onSuccess(_, payload) {
      const patchByEmail = new Map<string, UpdateUserPayload>();
      payload.forEach((p) => {
        patchByEmail.set(p.email, p);
      });

      queryClient.setQueriesData<PageDto<UsersDto>>(
        { queryKey: ['users'], exact: false },
        (old) => {
          if (!old) {
            return old;
          }

          return {
            ...old,
            data: old.data.map((u) => {
              const patch = patchByEmail.get(u.email);
              if (!patch) {
                return u;
              }

              return {
                ...u,
                ...(patch.role !== undefined ? { role: patch.role } : null),
                ...(patch.enabled !== undefined ? { enabled: patch.enabled } : null),
                ...(patch.api_key !== undefined ? { api_key: patch.api_key } : null),
              };
            }),
          };
        },
      );

      await queryClient.invalidateQueries({
        queryKey: ['users'],
        refetchType: 'active',
      });
    },
  });

  const bulkEnable = (users: UsersDto[]) => {
    const payload: UpdateUserPayload[] = users
      .filter((u) => u.role !== 'ADMIN')
      .map((u) => ({
        email: u.email,
        enabled: true,
      }));
    bulkMutation.mutate(payload);
  };

  const bulkDisable = (users: UsersDto[]) => {
    const payload: UpdateUserPayload[] = users
      .filter((u) => u.role !== 'ADMIN')
      .map((u) => ({
        email: u.email,
        enabled: false,
      }));
    bulkMutation.mutate(payload);
  };

  const toggleEnabled = (user: UsersDto) => {
    mutation.mutate({
      email: user.email,
      enabled: !user.enabled,
    });
  };

  return {
    updateUser: mutation.mutate,
    updateUserAsync: mutation.mutateAsync,
    deleteUser: deleteMutation.mutate,
    bulkEnable,
    bulkDisable,
    toggleEnabled,
    ...mutation,
  };
}
