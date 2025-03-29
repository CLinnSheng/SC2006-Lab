/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App. {js,jsx,ts,tsx}", "./<custom directory>/**/*.{is,jsx,ts, tsx}"],  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
