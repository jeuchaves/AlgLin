let $ = require("jquery");
let utils = require("./utils");
let OperacaoSoma = require("./operacao_soma");

class OperacaoEscalar extends OperacaoSoma {
  calcular() {
    let res = Array(this.numLinhas);

    for (let l = 1; l <= this.numLinhas; ++l) {
      res[l] = Array(this.numColunas);

      for (let c = 1; c <= this.numColunas; ++c) {
        res[l][c] = utils.arredondar(this.mA[l][c] * this.escalar);
      }
    }

    return res;
  }

  redimensionarMatrizes() {
    let [numLinhas, numColunas] = utils.getEntradaTamanho();

    this.numLinhas = utils.limitar(numLinhas, 1, 4);
    this.numColunas = utils.limitar(numColunas, 1, 4);

    $("#MatrizA").html(
      utils.gerarEntradaMatricial("a", this.numLinhas, this.numColunas)
    );
  }

  gerarCalculo(l, c) {
    return `${this.escalar} × ${this.mA[l][c]} = ${this.mC[l][c]}`;
  }

  gerarEnunciado() {
    let html = `<p class="lead">`;
    html += `Multiplique o escalar <strong>${this.escalar}</strong>`;
    html += ` com o elemento `;

    let idx = `${this.linhaAtiva}${this.colunaAtiva}`;
    html += `<strong>a<sub>${idx}</sub></strong>.<br>`;

    let calc = this.gerarCalculo(this.linhaAtiva, this.colunaAtiva);
    html += `<strong>${calc}</strong>`;
    html += `</p>`;

    return html;
  }

  imprimirResultado() {
    let html = "";

    if (this.estagio == 4) {
      html += "";
    } else {
      html += this.gerarEnunciado();
    }

    html += `<div class="col-xl-12 row">`;

    html += `<div class="col-md-3">`;
    html += this.gerarEscalar(this.escalar);
    html += "</div>";

    html += `<div class="col-md-3">`;
    html += this.gerarMatriz("Matriz A", this.mA, false, "a");
    html += `</div>`;

    html += `<div class="col-md-6">`;
    html += this.gerarMatriz("Matriz Resultante", this.mC, true, "c");
    html += `</div>`;

    html += ``;

    return html;
  }

  realizarOperacao() {
    let { numLinhas, numColunas } = this;
    let erroEscalar = !utils.escalarEstaPreenchido();
    let erroMatriz = !utils.matrizEstaPreenchida("a", numLinhas, numColunas);

    if (erroEscalar || erroMatriz) {
      utils.mostraErroEntradaIncompleta();
      return;
    } else {
      $("#erro-input-vazio").html("");
    }

    $("#passo-a-passo").html(utils.criarPassoAPasso());

    this.mA = utils.recuperarMatriz("a", numLinhas, numColunas);
    this.escalar = parseFloat($("#numEscalar").val());
    this.mC = this.calcular();

    this.atualizarResultado();
  }
}

$(function() {
  let op = new OperacaoEscalar();
  op.instalarControles();
});
