/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            textColor: {
                primary: '#fffff0',
                secondary: '#000000',
                tertiary: '#d3d3d3'
            },
            colors: {
                bg1: '#2e8bc0',
                bg2: '#145da0',
                bg3: '#0c2d48',
                bg4: '#000000',
                bg5: '#111111',
                bg6: '#222222',
                bg7: '#01260c',
                bg8: '#013a12',
                bg9: '#014d18',
            }
        }
    },
    plugins: []
}
