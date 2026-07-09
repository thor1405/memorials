import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services.html'),
        collection: resolve(__dirname, 'collection.html'),
        craftsmanship: resolve(__dirname, 'craftsmanship.html'),
        locations: resolve(__dirname, 'locations.html'),
        inquire: resolve(__dirname, 'inquire.html')
      }
    }
  }
});
