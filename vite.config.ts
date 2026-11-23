import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Determines the base URL for GitHub Pages or local deployment
const getBase = () => {
  if (process.env.VITE_BASE_PATH) {
    return process.env.VITE_BASE_PATH;
  }
  if (process.env.GITHUB_REPOSITORY) {
    const repo = process.env.GITHUB_REPOSITORY.split('/')[1];
    return `/${repo}/`;
  }
  // Default to relative path for maximum portability across local & static hosts
  return './';
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: getBase(),
});
