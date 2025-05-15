import {defineConfig} from 'tailwindcss'

export default defineConfig({
    content:[
        './index.html',
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme:{
        extends:{
            colors:{
                'board-light': '#f0d9b5',
        'board-dark': '#b58863',
        // Shape colors
        'shape-1': 'rgb(255 87 51 / 0.5)',  // Coral with transparency
        'shape-2': 'rgb(51 255 87 / 0.5)',  // Green with transparency
        'shape-3': 'rgb(51 87 255 / 0.5)',  // Blue with transparency
        'shape-4': 'rgb(240 51 255 / 0.5)', // Magenta with transparency
        'shape-5': 'rgb(255 51 168 / 0.5)', // Pink with transparency
        'shape-6': 'rgb(51 255 245 / 0.5)', // Cyan with transparency
        'shape-7': 'rgb(255 240 51 / 0.5)', // Yellow with transparency
        'shape-8': 'rgb(255 140 51 / 0.5)', // Orange with transparency
            }
        }
    }
})