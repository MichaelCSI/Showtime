/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            textColor: {
                primary: '#fffff0',
                secondary: '#000000',
                tertiary: '#d3d3d3',
                goldOakland: '#fbc901'
            },
            colors: {
                bg1: '#01260c',
                bg2: '#013a12',
                bg3: '#014d18',
                gold: '#b59410',
                ivory: '#fffff0'
            }
        }
    },
    plugins: []
}
