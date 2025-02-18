export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true, // Helpful for debugging
  },
  server: {
    host: true,
  },
});
