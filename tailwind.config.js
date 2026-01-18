/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        destructive: "#ef4444",
      },
    },
  },
  plugins: [],
};
