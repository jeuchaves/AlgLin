const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/js/index.js",
    soma: "./src/js/soma.js",
    subtracao: "./src/js/subtracao.js",
    mult_escalar: "./src/js/mult_escalar.js",
    mult_matricial: "./src/js/mult_matricial.js",
    transposta: "./src/js/transposta.js",
    determinante: "./src/js/determinante.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js"
  },
  plugins: [
    new CopyPlugin([
      { from: "src/css", to: "css" },
      { from: "src/img", to: "img" },
      { from: "src/*.html", to: "", flatten: true },
      { from: "node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css" },
      { from: "node_modules/bootstrap/dist/js/bootstrap.min.js", to: "js" },
      { from: "node_modules/bootstrap/dist/js/bootstrap.min.js.map", to: "js" },
      { from: "node_modules/popper.js/dist/popper.min.js", to: "js" }
    ])
  ]
};
