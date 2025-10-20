import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import ViteSitemap from 'vite-plugin-sitemap'
import { createHtmlPlugin } from 'vite-plugin-html'
// https://vite.dev/config/

const routes = [
    { path: '/', name: 'Home' },
    { path: '/topic', name: 'Topic' },
]

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        ViteSitemap({
            hostname: 'https://opic.io.vn',
            dynamicRoutes: routes.map((route) => route.path),
            generateRobotsTxt: true,
        }),
        createHtmlPlugin({
            minify: true,
            inject: {
                data: {
                    title: 'Default Title',
                    description: 'Default Description',
                },
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom', 'react-router-dom'],
                },
            },
        },
    },
})
