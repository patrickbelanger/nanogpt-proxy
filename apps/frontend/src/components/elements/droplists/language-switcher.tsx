import { Menu, Button, Group, Text } from '@mantine/core';
import { IconLanguage, IconCheck, IconChevronDown } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

type LanguageOption = {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
};

const LANGUAGES: LanguageOption[] = [
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const current = LANGUAGES.find((lang) => i18n.language?.startsWith(lang.code)) ?? LANGUAGES[0];

  const handleChange = async (code: string) => {
    if (code === i18n.language) return;
    await i18n.changeLanguage(code);
  };

  return (
    <Menu shadow="md" width={220} position="bottom-end" withinPortal>
      <Menu.Target>
        <Button
          variant="subtle"
          size="xs"
          radius="xl"
          leftSection={<IconLanguage size={16} />}
          rightSection={<IconChevronDown size={14} />}
        >
          <Group gap={6}>
            <span>{current.flag}</span>
            <Text size="xs">{current.nativeLabel}</Text>
          </Group>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {LANGUAGES.map((lang) => (
          <Menu.Item
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            leftSection={<span>{lang.flag}</span>}
            rightSection={current.code === lang.code ? <IconCheck size={14} /> : null}
          >
            <Group gap="xs" wrap="nowrap">
              <Text size="sm">{lang.nativeLabel}</Text>
              <Text size="xs" c="dimmed">
                ({lang.label})
              </Text>
            </Group>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

export default LanguageSwitcher;
