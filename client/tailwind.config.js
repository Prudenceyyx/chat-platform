/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{html,js,jsx,tsx}'],
  extend: {
    transitionProperty: {
      'bg': 'background',
    }
  }
};
