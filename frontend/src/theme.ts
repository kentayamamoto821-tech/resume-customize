import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  globalCss: {
    html: { scrollBehavior: 'smooth' },
    body: { bg: 'bg', color: 'fg' },
  },
  theme: {
    tokens: {
      fonts: {
        heading: {
          value: `'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`,
        },
        body: {
          value: `'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`,
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
