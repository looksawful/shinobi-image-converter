import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
	plugins: [react()],
	base: '/shinobi-image-converter/',
	server: { port: 5173 },
	resolve: {
		alias: {
			'cropperjs/dist/cropper.css': path.resolve(__dirname, 'node_modules/cropperjs/dist/cropper.css'),
		},
	},
	build: {
		outDir: '../docs',
	},
});
