let $ = require("jquery");

function animacao(elemento) {
  textoSeparado = elemento.text().split("");
  elemento.text("");
  textoSeparado.forEach((letra, i) => {
    setTimeout(() => elemento.text(elemento.text() + letra), 75 * i);
  });
}

$(function() {
  const titulo = $("#titulo");

  animacao(titulo);
});
