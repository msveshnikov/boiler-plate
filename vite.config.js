import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
        sentryVitePlugin({
            org: 'maxsoft',
            project: 'auto-research'
        })
    ],

    build: {
        sourcemap: true
    }
});
