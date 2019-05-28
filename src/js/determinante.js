let $ = require("jquery");
let utils = require("./utils");
let OperacaoSoma = require("./operacao_soma");

/**
 * Responsável por duplicar as duas primeiras colunas da matriz
 * (somente no caso de matrizes 3x3)
 */
class Estagio1 {
  calcular(tam, mA) {
    console.log("estágio 1 - calcular");
    let resp = Array(tam);
    for (let l = 1; l <= tam; ++l) {
      resp[l] = Array(tam);

      for (let c = 1; c <= tam + 2; ++c) {
        if (c > 3) resp[l][c] = mA[l][c - 3];
        else resp[l][c] = mA[l][c];
      }
    }

    return resp;
  }

  imprimirResultado() {
    let html = "";

    html += `<div class="col-md-8 offset-md-2>`;
    html += this.gerarMatriz("Matriz A", this.mC, false, "a");
    html += `</div>`;

    return html;
  }

  gerarMatriz(titulo, matriz, mostrarCalculo, prefixo) {
    let html = `<h5 class="card-title text-center conteudo">${titulo}</h5>`;
    html += `<table class="table table-bordered">`;

    for (let l = 1; l <= this.numLinhas; ++l) {
      html += "<tr>";

      for (let c = 1; c <= this.numColunas; ++c) {
        if (c > this.numLinhas) {
          html += `<td class="alert-dark">(${prefixo}<sub>${l}${c - 3}</sub>) `;
          html += `<strong>${matriz[l][c]}</strong></td>`;
        } else {
          html += `<td>(${prefixo}<sub>${l}${c}</sub>) ${matriz[l][c]}</td>`;
        }
      }
      html += "</tr>";
    }

    html += "</table>";
    return html;
  }
}

class OperacaoDeterminante extends OperacaoSoma {
  constructor() {
    super();
    this.obj = new Estagio1();
  }

  redimensionarMatrizes() {
    let [numLinhas] = utils.getEntradaUnica();

    this.numLinhas = utils.limitar(numLinhas, 1, 3);

    this.numColunas = this.numLinhas + 2;

    $("#MatrizA").html(utils.gerarEntradaMatricial("a", this.numLinhas, this.numLinhas));
  }

  realizarOperacao() {
    let { numLinhas } = this;

    if (!utils.matrizEstaPreenchida("a", numLinhas, numLinhas)) {
      utils.mostraErroEntradaIncompleta();
      return;
    } else {
      $("#erro-input-vazio").html("");
    }

    $("#passo-a-passo").html(utils.criarPassoAPasso());

    this.mA = utils.recuperarMatriz("a", numLinhas, numLinhas);
    if (numLinhas == 3) this.mA = this.calcular();

    this.atualizarResultado();
  }

  calcular(op) {
    return this.obj.calcular(this.numLinhas, this.mA);
  }

  gerarMatriz(titulo, matriz, mostrarCalculo, prefixo) {
    return this.obj.gerarMatriz();
  }

  imprimirResultado() {
    return this.obj.imprimirResultado();
  }
}

$(function() {
  let op = new OperacaoDeterminante();
  op.instalarControles();
});
