module.exports = {
  content: [
    "./templates/**/*.twig",
    "./components/**/*.twig"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
};
