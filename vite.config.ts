import path from 'path';
import { loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression';
import html from 'vite-plugin-html';

export default ({ command, mode }) => {
  // 获取环境变量
  const envParams = loadEnv(mode, './');
  const VITE_BUILDENV = envParams.VITE_BUILDENV;
  const outDir = VITE_BUILDENV === 'prod' ? 'dist' : VITE_BUILDENV;
  let config = {
    plugins: [
      vue(),
      html({
        inject: {
          injectData: {
            title: envParams.VITE_SYSTEM_NAME
          }
        },
        minify: true
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    base: './',
    clearScreen: false,
    server: {
      host: '0.0.0.0',
      port: 9621,
      open: true,
      strictPort: true
    },
    build: {
      assetsDir: 'assets',
      outDir: outDir
    }
  };
  command !== 'serve' && config.plugins.push(viteCompression());
  return config;
};
