import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/technology-tracker/',
    root: '.',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: 'index.html'
        }
    },
    publicDir: 'public',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    server: {
        port: 5173,
        open: true // Автоматически открывать браузер
    }
})