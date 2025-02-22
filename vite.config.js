import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ssr from 'vite-plugin-ssr/plugin';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    ssr(),
    sitemap({
      hostname: 'https://taxall.co.in', // Your domain name
      readable: true, // Makes sitemap easier to read (optional)
    }),
  ],
  base: '/',
});
