module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      blockquote: {
        fontSize: "150%",
        fontWeight: "500",
        fontStyle: "italic",
        fontVariant: "small-caps",
        borderLeftWidth: "0.0rem",
      },
    },
    minHeight: {
      0: "0",
      "1/4": "25%",
      "2/3": "33%",
      "3/4": "75%",
      full: "100%",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
