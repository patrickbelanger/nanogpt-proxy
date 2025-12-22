import { Badge, Button, Group, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { PaginatedTable } from '../elements/tables/paginated-table';
import { fetchUsersPage } from '../../apis/users-api';
import { getAccessToken } from '../../utilities/cookies.utilities.ts';
import { API_BASE_URL } from '../../apis/api.ts';
import { IconEdit, IconTrash, IconUserCheck, IconUserX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { PaginationParams, PageDto } from '../elements/tables/pagination-types';
import type { UsePageQuery } from '../../hooks/usePageQuery';
import type { UsersDto } from '../../dtos/users.dto';
import type { ColumnDef } from '../elements/tables/column-def';

type UsersTableProps = {
  onApproveDisapproveUser?: (user: UsersDto) => void;
  onEditUser?: (user: UsersDto) => void;
  onDeleteUser?: (user: UsersDto) => void;
  onBulkDisable?: (users: UsersDto[]) => void;
  onBulkEnable?: (users: UsersDto[]) => void;
};

function UsersTable(props: UsersTableProps) {
  const { onApproveDisapproveUser, onEditUser, onDeleteUser, onBulkDisable, onBulkEnable } = props;
  const { t } = useTranslation();

  const columns: ColumnDef<UsersDto>[] = [
    {
      key: 'email',
      header: t('tables.administer.columns.email'),
      sortable: true,
    },
    {
      key: 'role',
      header: t('tables.administer.columns.role'),
      width: 120,
      sortable: true,
      render: (row) => (
        <Badge color={row.role === 'ADMIN' ? 'red' : 'blue'} variant="light">
          {t(`tables.administer.labels.${row.role.toLowerCase()}`)}
        </Badge>
      ),
    },
    {
      key: 'enabled',
      header: t('tables.administer.columns.enabled'),
      width: 135,
      sortable: true,
      render: (row) => (
        <Badge color={row.enabled ? 'green' : 'gray'} variant={row.enabled ? 'filled' : 'outline'}>
          {row.enabled
            ? t('tables.administer.labels.enabled')
            : t('tables.administer.labels.disabled')}
        </Badge>
      ),
    },
    {
      key: 'api_key',
      header: t('tables.administer.columns.apiKey'),
      sortable: false,
      width: 110,
      render: (row) =>
        row.api_key ? (
          <Text size="sm">••••••••••••</Text>
        ) : (
          <Text size="sm" c="dimmed">
            {t('tables.administer.labels.none')}
          </Text>
        ),
    },
  ];

  const useUsersPage: UsePageQuery<UsersDto> = (params: PaginationParams) =>
    useQuery<PageDto<UsersDto>, Error>({
      queryKey: ['users', params],
      queryFn: () => {
        const token = getAccessToken();
        if (!token) {
          throw new Error('Missing access token');
        }

        return fetchUsersPage(API_BASE_URL, token, params);
      },
      placeholderData: (prevData) => prevData,
    });

  return (
    <PaginatedTable<UsersDto>
      getRowId={(u) => u.email}
      columns={columns}
      initialLimit={10}
      usePageQuery={useUsersPage}
      renderActions={(row) => (
        <Group>
          {onApproveDisapproveUser && (
            <UnstyledButton
              size="xs"
              onClick={() => onApproveDisapproveUser(row)}
              disabled={row.role === 'ADMIN'}
              style={{
                cursor: row.role === 'ADMIN' ? 'not-allowed' : 'pointer',
                opacity: row.role === 'ADMIN' ? 0.5 : 1,
              }}
            >
              <Tooltip
                arrowOffset={50}
                arrowSize={8}
                label={row.enabled ? 'Disable user' : 'Enable user'}
                withArrow
                position="bottom"
              >
                {row.enabled ? <IconUserX /> : <IconUserCheck />}
              </Tooltip>
            </UnstyledButton>
          )}
          {onEditUser && (
            <UnstyledButton size="xs" onClick={() => onEditUser(row)}>
              <Tooltip arrowOffset={50} arrowSize={8} label="Edit user" withArrow position="bottom">
                <IconEdit />
              </Tooltip>
            </UnstyledButton>
          )}

          {onDeleteUser && (
            <UnstyledButton
              size="xs"
              onClick={() => onDeleteUser(row)}
              disabled={row.role === 'ADMIN'}
              style={{
                cursor: row.role === 'ADMIN' ? 'not-allowed' : 'pointer',
                opacity: row.role === 'ADMIN' ? 0.5 : 1,
              }}
            >
              <Tooltip
                arrowOffset={50}
                arrowSize={8}
                label="Delete user"
                withArrow
                position="bottom"
              >
                <IconTrash />
              </Tooltip>
            </UnstyledButton>
          )}
        </Group>
      )}
      renderBottomBar={(selected) => (
        <>
          {onBulkEnable && (
            <Button size="xs" variant="light" color="green" onClick={() => onBulkEnable(selected)}>
              {t('tables.administer.buttons.enableSelected')}
            </Button>
          )}
          {onBulkDisable && (
            <Button
              size="xs"
              variant="light"
              color="orange"
              onClick={() => onBulkDisable(selected)}
            >
              {t('tables.administer.buttons.disableSelected')}
            </Button>
          )}
        </>
      )}
    />
  );
}

export default UsersTable;
