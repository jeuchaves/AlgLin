const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/js/index.js",
    determinante: "./src/js/determinante.js",
    transposta: "./src/js/transposta.js",
    mult_matricial: "./src/js/mult_matricial.js",
    mult_escalar: "./src/js/mult_escalar.js",
    soma: "./src/js/soma.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]_bundle.js"
  }
};
