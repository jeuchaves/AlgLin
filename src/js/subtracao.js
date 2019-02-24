let $ = require("jquery");
let OperacaoSoma = require("./operacao_soma");

class OperacaoSubtracao extends OperacaoSoma {
  gerarEnunciado() {
    return super.gerarEnunciado("Subtraia");
  }

  calcular() {
    return super.calcular((a, b) => a - b);
  }

  gerarCalculo(l, c, op) {
    return super.gerarCalculo(l, c, "-");
  }
}

$(function() {
  let op = new OperacaoSubtracao();
  op.instalarControles();
});
