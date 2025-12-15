import { Group, Title } from '@mantine/core';
import classes from './top-header.module.scss';
import LanguageSwitcher from '../droplists/language-switcher.tsx';

function TopHeader() {
  return (
    <Group h="100%" px="md" justify="space-between" className={classes.topHeader}>
      <Title order={4}>NanoGPT Proxy</Title>
      <LanguageSwitcher />
    </Group>
  );
}

export default TopHeader;
