import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../apis/api';
import { getAccessToken } from '../utilities/cookies.utilities';
import { api } from '../apis/axios-client.ts';
import type { UsersDto } from '../dtos/users.dto';
import type { PageDto } from '../components/elements/tables/pagination-types.ts';

export type UpdateUserPayload = {
  email: string;
  password?: string;
  api_key?: string;
  role?: string;
  enabled?: boolean;
};

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

export function useUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation<UsersDto, Error, UpdateUserPayload>({
    mutationFn: putUser,
    async onSuccess(updatedUser) {
      queryClient.setQueriesData<PageDto<UsersDto>>(
        { queryKey: ['users'], exact: false },
        (old) => {
          if (!old) return old;
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

  const toggleEnabled = (user: UsersDto) => {
    mutation.mutate({
      email: user.email,
      enabled: !user.enabled,
    });
  };

  return {
    updateUser: mutation.mutate,
    updateUserAsync: mutation.mutateAsync,
    toggleEnabled,
    ...mutation,
  };
}
