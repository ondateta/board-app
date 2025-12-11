import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    strictPort: false,
    allowedHosts: ['5173-ivb81e93032p5h52qjqi2.e2b.app', '.e2b.app'],
  },
	plugins: [sveltekit()]
});
