// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // Export Vite configuration
// export default defineConfig({
//   plugins: [react()],
//   base: '/', // Use '/' for root deployment. Update if deploying under a subpath.
//   build: {
//     outDir: 'dist', // Output directory for the build files
//     sourcemap: true, // Generate source maps for easier debugging
//     rollupOptions: {
//       // Optional: Fine-tune Rollup settings if needed
//       output: {
//         manualChunks: {
//           vendor: ['react', 'react-dom'], // Split vendor libraries for better caching
//         },
//       },
//     },
//   },
//   server: {
//     host: true, // Allow external access (useful for local development)
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Export Vite configuration
export default defineConfig({
  plugins: [react()],
  base: '/', // Use '/' for root deployment. Update if deploying under a subpath.
  build: {
    outDir: 'dist', // Output directory for the build files
    sourcemap: true, // Generate source maps for easier debugging
    rollupOptions: {
      // Optional: Fine-tune Rollup settings if needed
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Split vendor libraries for better caching
        },
      },
    },
  },
  server: {
    host: true, // Allow external access (useful for local development)
  },
  // Add custom server middleware for sitemap.xml
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Optional: Create alias for easier imports
    },
  },
});
