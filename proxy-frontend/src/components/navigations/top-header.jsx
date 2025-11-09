import { Box, Group } from '@mantine/core';

function TopHeader() {
  return (
    <Box pb={120}>
      <header>
        <Group justify="space-between" h="100%">
          NanoGPT Proxy
        </Group>
      </header>
    </Box>
  );
}

export default TopHeader;
