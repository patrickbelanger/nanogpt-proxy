import { useTranslation } from 'react-i18next';
import { Group, Title } from '@mantine/core';
import { IconUsersPlus } from '@tabler/icons-react';
import UsersTable from '../customs/users-table.tsx';
import { useUser } from '../../hooks/useUser.ts';

function AdministerForm() {
  const { t } = useTranslation();
  const { toggleEnabled } = useUser();

  return (
    <>
      <Group gap="xs" align="center" mb="xs">
        <IconUsersPlus size={22} />
        <Title order={3}>{t('menu.items.administer')}</Title>
      </Group>
      <UsersTable
        onApproveDisapproveUser={(user) => {
          console.info('Approve/DisapproveUser ' + user);
          toggleEnabled(user);
        }}
        onEditUser={(user) => {
          console.info('Edit ' + user);
          // ouvrir un drawer / modal avec le user
        }}
        onDeleteUser={(user) => {
          console.info('Delete ' + user);
          // ouvrir un confirm, puis call delete endpoint
        }}
        onBulkEnable={(users) => {
          console.info('Bulk enabled' + users);
          // call endpoint bulk enable
        }}
        onBulkDisable={(users) => {
          console.info('Bulk disabled' + users);
          // call endpoint bulk disable
        }}
      />
    </>
  );
}

export default AdministerForm;
