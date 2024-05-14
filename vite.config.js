import { defineConfig } from 'vite';

const config = () => {
    return defineConfig({
        base: './',
        server: {
            host: 'localhost',
            port: 8000
        }
    });
};

export default config;
