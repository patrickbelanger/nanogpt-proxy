import { IconSettings } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Box, Center, Group, Loader, Paper, Stack, Switch, Text, Title } from '@mantine/core';
import { useConfiguration } from '../../hooks/useConfiguration.ts';
import type { ConfigurationDto } from '../../dtos/configuration.dto.ts';

const SWITCHES: {
  key: keyof ConfigurationDto;
  labelKey: string;
  descriptionKey: string;
}[] = [
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
];

function SettingsForm() {
  const { t } = useTranslation();

  const { config, isLoading, error, isUpdating, updateConfigAsync } = useConfiguration();

  const isError = Boolean(error);

  return (
    <>
      <Group mb="md" gap="xs" align="center">
        <IconSettings size={24} />
        <Title order={3}>{t('menu.items.settings')}</Title>
      </Group>

      <Paper withBorder shadow="sm" p="lg" radius="md">
        {isLoading && (
          <Center mih={80}>
            <Loader size="sm" />
          </Center>
        )}

        {isError && (
          <Text c="red" size="sm" mb="sm">
            {t('settings.errors.load')}
          </Text>
        )}

        {config && (
          <Stack gap="md">
            {SWITCHES.map((item) => (
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
                    onChange={(event) =>
                      updateConfigAsync({
                        [item.key]: event.currentTarget.checked,
                      } as Partial<ConfigurationDto>)
                    }
                  />
                </Group>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </>
  );
}

export default SettingsForm;
