import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'resolve-ts-js-extension',
        resolveId(source, importer) {
          if (importer && (source.startsWith('.') || source.startsWith('@/')) && source.endsWith('.js')) {
            const relativePath = source.startsWith('@/') 
              ? path.resolve(process.cwd(), source.substring(2))
              : path.resolve(path.dirname(importer), source);
            const tsPath = relativePath.slice(0, -3) + '.ts';
            const tsxPath = relativePath.slice(0, -3) + '.tsx';
            
            if (fs.existsSync(tsxPath)) {
              return tsxPath;
            }
            if (fs.existsSync(tsPath)) {
              return tsPath;
            }
          }
          return null;
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
