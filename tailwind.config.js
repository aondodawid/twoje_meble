module.exports = {
  content: ["./public/index.html", "./src/**/*.{vue,js}"],
  theme: {
    extend: {
      colors: {
        sand: "#f3ece2",
        clay: "#c86f3d",
        bark: "#3c2d27",
        moss: "#617a55",
        fog: "#f8f7f4",
      },
      boxShadow: {
        panel: "0 18px 50px rgba(34, 24, 20, 0.16)",
      },
    },
  },
  plugins: [],
};
