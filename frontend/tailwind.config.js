/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brandColor: "#B37BFF",
        textColor: "#404040",
      },
      boxShadow: {
        company: "2px -4px 25px 0px #f1f1fd",
        drop: "2px -4px 10px 0px #f1f1fd",
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
