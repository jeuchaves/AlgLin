let $ = require("jquery");
let utils = require("./utils");
let OperacaoSoma = require("./operacao_soma");

class OperacaoDeterminante extends OperacaoSoma {

  redimensionarMatrizes() {
    let [numLinhas] = utils.getEntradaUnica();
    
    this.numLinhas = utils.limitar(numLinhas, 1, 3);

    this.numColunas = this.numLinhas + 2;

    $("#MatrizA").html(
      utils.gerarEntradaMatricial("a", this.numLinhas, this.numLinhas)
    );
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

    if (numLinhas == 3) {
      this.mC = this.calcular();
      this.linhaAtiva = 0;
    }

    this.atualizarResultado();
  }

  calcular(op) {
    let { numLinhas, numColunas } = this;
    let resp = Array(numLinhas);

    for (let l = 1; l <= numLinhas; ++l) {
      resp[l] = Array(numColunas);

      for (let c = 1; c <= numColunas; ++c) {
        if (c > 3) resp[l][c] = this.mA[l][c-3];
        else resp[l][c] = this.mA[l][c];
      }
    }

    return resp;
  }

  /**
   * Verifica qual é o estágio atual do cálculo.
   *
   * Estágio 1: Duplicar as primeiras colunas da matriz.
   * Estágio 2: Multiplicar as diagonais principais.
   * Estágio 3: Multiplicar as diagonais secundárias.
   * Estágio 4: Subtrair as secundárias pelas primárias.
   * Estágio 5: Finalização
   */
  atualizarEstagio() {
    let { linhaAtiva } = this;

    if (linhaAtiva == 0) {
      this.estagio = 1;
      return;
    }
    
    if (linhaAtiva == 1) {
      this.estagio = 2;
      return;
    }

    if (linhaAtiva == 2) {
      this.estagio = 3;
      return;
    }

    if (linhaAtiva == 3) {
      this.estagio = 4;
    } 

    if (linhaAtiva == 4) {
      this.estagio = 5
    }
  }

  gerarMatriz(titulo, matriz, mostrarCalculo, prefixo) {
    let html = `<h5 class="card-title text-center conteudo">${titulo}</h5>`;
    html += `<table class="table table-bordered">`;

    switch (this.estagio) {
      case 1:
        for (let l = 1; l <= this.numLinhas; ++l) {
          html += "<tr>";

          for (let c = 1; c <= this.numColunas; ++c) {
            if (c > this.numLinhas) {
              html += `<td class="alert-dark">(${prefixo}<sub>${l}${c-3}</sub>) `;
              html += `<strong>${matriz[l][c]}</strong></td>`;
            } else {
              html += `<td>(${prefixo}<sub>${l}${c}</sub>) ${matriz[l][c]}</td>`;
            }
          }
          html += "</tr>";
        }
        break;
      case 2:
        for (let l = 1; l <= this.numLinhas; ++l) {
          html += "<tr>";

          for (let c = 1; c <= this.numColunas; ++c) {
            if (c > this.numLinhas) {
              html += `<td class="alert-dark">(${prefixo}<sub>${l}${c-3}</sub>) `;
              html += `<strong>${matriz[l][c]}</strong></td>`;
            } else {
              html += `<td>(${prefixo}<sub>${l}${c}</sub>) ${matriz[l][c]}</td>`;
            }
          }
          html += "</tr>";
        }
        break;
    }

    html += "</table>";
    return html;
  }

  imprimirResultado() {
    let html = "";

    switch (this.estagio) {
      case 1:
        html += `<div class="col-md-8 offset-md-2>`;
        html += this.gerarMatriz("Matriz A", this.mC, false, "a");
        html += `</div>`;
        break;
     case 2:
        html += `<div class="row">`;
        html += `<div class="col-md-8">`;
        html += this.gerarMatriz("Matriz A", this.mC, false, "a");
        html += `</div>`;
        html += `</div>`;
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
    }


    
    html += `<div class="col-md-3">`;
    html += this.gerarMatriz("Matriz A", this.mA, false, "a");
    html += `</div>`;

    html += `<div class="col-md-3">`;
    html += this.gerarMatriz("Matriz B", this.mB, false, "b");
    html += `</div>`;

    html += `<div class="col-md-6">`;
    html += this.gerarMatriz("Matriz Resultante", this.mC, true, "c");
    html += `</div>`;

    html += ``;

    return html;
  }
}

$(function() {
  let op = new OperacaoDeterminante();
  op.instalarControles();
});
