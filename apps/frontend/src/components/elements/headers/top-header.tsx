import { Burger, Group, Title } from '@mantine/core';
import classes from './top-header.module.scss';
import LanguageSwitcher from '../droplists/language-switcher.tsx';

export type TopHeaderProps = {
  displayBurgerButton?: boolean;
  navbarOpened?: boolean;
  onToggleNavbar?: () => void;
};

function TopHeader({
  displayBurgerButton = false,
  navbarOpened = false,
  onToggleNavbar,
}: TopHeaderProps) {
  const shouldShowBurger = displayBurgerButton && typeof onToggleNavbar === 'function';

  return (
    <Group h="100%" px="md" justify="space-between" className={classes.topHeader}>
      {shouldShowBurger && (
        <Burger opened={navbarOpened} onClick={onToggleNavbar} hiddenFrom="sm" size="sm" />
      )}

      <Title order={4}>NanoGPT Proxy</Title>
      <LanguageSwitcher />
    </Group>
  );
}

export default TopHeader;
