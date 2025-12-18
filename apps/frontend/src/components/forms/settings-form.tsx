import { IconSettings } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Box, Center, Group, Loader, Paper, Stack, Switch, Text, Title } from '@mantine/core';
import { useConfiguration } from '../../hooks/useConfiguration.ts';
import type { ConfigurationDto } from '../../dtos/configuration.dto.ts';

type SwitchItem = {
  key: keyof ConfigurationDto;
  labelKey: string;
  descriptionKey: string;
};

type SettingsGroup = {
  id: string;
  titleKey: string;
  descriptionKey?: string;
  switches: SwitchItem[];
};

const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    id: 'auth',
    titleKey: 'settings.groups.login.title',
    descriptionKey: 'settings.groups.login.description',
    switches: [
      {
        key: 'forgetPassword',
        labelKey: 'settings.forgetPassword.label',
        descriptionKey: 'settings.forgetPassword.description',
      },
      {
        key: 'registration',
        labelKey: 'settings.registration.label',
        descriptionKey: 'settings.registration.description',
      },
      {
        key: 'reviewPendingRegistration',
        labelKey: 'settings.reviewPendingRegistration.label',
        descriptionKey: 'settings.reviewPendingRegistration.description',
      },
    ],
  },
];

function SettingsForm() {
  const { t } = useTranslation();
  const { config, isLoading, isUpdating, error, updateConfigAsync } = useConfiguration();

  const handleToggle = async (key: keyof ConfigurationDto, value: boolean) => {
    await updateConfigAsync({ [key]: value } as Partial<ConfigurationDto>);
  };

  return (
    <>
      <Group gap="xs" align="center" mb="xs">
        <IconSettings size={22} />
        <Title order={3}>{t('menu.items.settings')}</Title>
      </Group>

      {isLoading && (
        <Center mih={120}>
          <Loader size="sm" />
        </Center>
      )}

      {error && (
        <Text c="red" size="sm" mb="sm">
          {t('settings.errors.load')}
        </Text>
      )}

      {config && (
        <Stack gap="lg">
          {SETTINGS_GROUPS.map((group) => (
            <Paper key={group.id} withBorder shadow="sm" p="lg" radius="md">
              <Box mb="md">
                <Text fw={700}>{t(group.titleKey)}</Text>
                {group.descriptionKey && (
                  <Text size="xs" c="dimmed">
                    {t(group.descriptionKey)}
                  </Text>
                )}
              </Box>

              <Stack gap="md">
                {group.switches.map((item) => (
                  <Box key={item.key}>
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <div>
                        <Text fw={500}>{t(item.labelKey)}</Text>
                        <Text size="xs" c="dimmed">
                          {t(item.descriptionKey)}
                        </Text>
                      </div>

                      <Switch
                        checked={Boolean(config[item.key])}
                        disabled={isUpdating}
                        onChange={(event) => handleToggle(item.key, event.currentTarget.checked)}
                      />
                    </Group>
                  </Box>
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </>
  );
}

export default SettingsForm;
