/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Including jsx and ts extensions for React projects
  ],
  theme: {
    extend: {
      backgroundImage: {
        'library-background': "url('/home/shreyas/cc-5/cc5-ds-algorithms/Backend/Library-management-system/library/src/assets/lib-background.avif')",
      },
      // You can extend Tailwind's default theme here
    },
  },
  plugins: [],
}
