let $ = require("jquery");
let OperacaoSoma = require("./operacao_soma");

$(function() {
  let op = new OperacaoSoma();
  op.instalarControles();
});
