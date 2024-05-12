/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        'roomName-color': '#373d4b',
        'roomDate-color': '#08d9d6',
        'roomMessage1-color': '#9ee46e',
        'roomMessage2-color': '#ebebeb'
      }
    }
  },
  plugins: []
}
