import { defineConfig } from 'vite';

// GitHub Pages serves the site from /ascii-webcam/, the dev server from /
export default defineConfig(({ command }) => ({
    base: command === 'build' ? '/ascii-webcam/' : '/',
}));
