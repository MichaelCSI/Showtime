/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            textColor: {
                primary: '#fffff0',
                secondary: '#000000'
            },
            colors: {
                bg1: '#aaaaaa',
                bg2: '#cccccc',
                bg3: '#ffffff',
                bg4: '#333333',
                bg5: '#222222',
                bg6: '#111111',
            }
        }
    },
    plugins: []
}
