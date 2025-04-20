// vite.config.cjs
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

// Export the configuration object
module.exports = defineConfig({
  // Add plugins, like the React plugin
  plugins: [react()],
  // Configure build options
  build: {
    // Set a warning limit for chunk size (in kB)
    chunkSizeWarningLimit: 1000,
  }, // <-- Added missing closing brace for the 'build' object
}); // <-- Added missing closing brace for the 'defineConfig' call
