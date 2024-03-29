import {defineConfig} from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy'


export default defineConfig({
    plugins: [
        react(),
        legacy({
            targets: ['Safari >= 15'],
            additionalLegacyPolyfills: ['regenerator-runtime/runtime']
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});