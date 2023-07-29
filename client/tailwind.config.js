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
                bgGray1: '#333333',
                bgGray2: '#222222',
                bgGray3: '#111111',
                sky400: '#38bdf8',
                gray400: '#9ca3af',
                gray700: '#374151',
            }
        }
    },
    plugins: []
}
