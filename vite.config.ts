import { defineConfig } from 'vite';

import { fileURLToPath, URL } from 'node:url';
import fs from 'fs';

import vue from '@vitejs/plugin-vue';
import type { UserConfig } from 'vite';

import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import topLevelAwait from 'vite-plugin-top-level-await';

const features =
  fs
    .readFileSync('./README.md', 'utf-8')
    .match(/## Features([\s\S]*?)##/)?.[1]
    .split('\n- [x] ')
    .map((line) => line.trim())
    .filter((line) => line) ?? [];

// https://vitejs.dev/config/
const config = {
  base: '/RecipeHelper',
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
          resolveIcons: true
        })
      ]
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i: any) => `__tla_${i}`
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url))
    }
  },
  define: {
    'import.meta.env.FEATURES': JSON.stringify(features)
  }
} satisfies UserConfig;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'tauri') {
    config.base = '';
  }
  if (mode === 'gitee') {
    config.base = '/recipe-helper';
  }
  return config;
});
