import { defineConfig } from 'vite';

import config from './vite.config.base';

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
