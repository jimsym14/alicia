import { defineConfig } from 'vite'

export default defineConfig({
  assetsInclude: ['**/*.heic', '**/*.HEIC', '**/*.heif', '**/*.HEIF'],
  server: {
    port: 3000,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
  },
})
