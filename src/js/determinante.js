let $ = require("jquery");
let utils = require("./utils");
let OperacaoSoma = require("./operacao_soma");

/**
 * Responsável por duplicar as duas primeiras colunas da matriz
 * (somente no caso de matrizes 3x3)
 */
class Estagio1 {
  
  calcular(tam, mA) {
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

  imprimirResultado(tam, matriz) {
    let html = "";

    html += this.gerarEnunciado();
    html += `<div class="col-md-8 offset-md-2">`;
    html += this.gerarMatriz(tam, matriz);
    html += `</div>`;

    return html;
  }

  gerarMatriz(tam, matriz) {
    let html = `<h5 class="text-center m-3">Matriz A</h5>`;
    html += `<table class="table table-bordered">`;

    for (let l = 1; l <= tam; ++l) {
      html += "<tr>";

      for (let c = 1; c <= tam+2; ++c) {
        if (c > tam) {
          html += `<td class="alert-dark">(a<sub>${l}${c - 3}</sub>) `;
          html += `<strong>${matriz[l][c]}</strong></td>`;
        } else {
          html += `<td>(a<sub>${l}${c}</sub>) `;
          html += `${matriz[l][c]}</td>`;
        }
      }
      html += "</tr>";
    }

    html += "</table>";
    return html;
  }

  gerarEnunciado() {
    
    let html = `<p class="lead">`;
    html += `Aparecerá algum texto aqui`;
    html += `</p>`;

    return html;
  }

  retornarStatus() {
    return [1,1];
  }
}

/**
 * Multiplicação das diagonais secundárias
 */
class Estagio2 {

  retornarStatus() {
    return [2,3];
  }

  imprimirResultado() {
    let html = "";

    html += this.gerarEnunciado();

    html += `<div class="col-xl-12 row">`;

    html += `<div class="col-md-6">`;
    html += this.gerarMatriz("Matriz A", this.mA, false, "a");
    html += `</div>`;

    html += `<div class="col-md-6">`;
    html += this.gerarMatriz("Resultado Diagonais", this.mA, true, "c");
    html += `</div>`;

    html += ``;

    return html;
  }

  gerarEnunciado() {
    
    let html = `<p class="lead">`;
    html += `Aparecerá algum texto aqui`;
    html += `</p>`;

    return html;
  }

  gerarMatriz(titulo, matriz, mostrarCalculo, prefixo) {
    let html = `<h5 class="text-center m-3">${titulo}</h5>`;
    html += `<table class="table table-bordered">`;

    for (let l = 1; l <= this.numLinhas; ++l) {
      html += "<tr>";

      for (let c = 1; c <= this.numColunas; ++c) {
        if (l == this.linhaAtiva && c == this.colunaAtiva) {
          if (mostrarCalculo) {
            html += `<td class="alert-dark">`;
            html += this.gerarCalculo(l, c);
            html += `</td>`;
          } else {
            html += `<td class="alert-dark">(${prefixo}<sub>${l}${c}</sub>) <strong>${
              matriz[l][c]
            }</strong></td>`;
          }
        } else {
          html += `<td>${matriz[l][c]}</td>`;
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
    this.etapa = 1;
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
    else this.obj = new Estagio2();

    this.atualizarResultado();
  }

  calcular(op) {
    return this.obj.calcular(this.numLinhas, this.mA);
  }

  gerarMatriz(titulo, matriz, mostrarCalculo, prefixo) {
    return this.obj.gerarMatriz(this.numLinhas, this.mA);
  }

  imprimirResultado() {
    return this.obj.imprimirResultado(this.numLinhas, this.mA);
  }

  gerarEnunciado(verbo) {
    return this.obj.gerarEnunciado();
  }

  voltar() {

    let [estagio, qtdEtapas] = this.obj.retornarStatus();

    if (this.etapa == 1) {
      switch(estagio) {
        case 2:
        this.obj = new Estagio1();
        break;
      }

      this.etapa = qtdEtapas;
    } else {
      --this.etapa;
    }

    this.atualizarResultado();
  }

  avancar() {

    let [estagio, qtdEtapas] = this.obj.retornarStatus();

    if (this.etapa == qtdEtapas) {
      switch(estagio) {
        case 1:
        this.obj = new Estagio2();
        break;
      }

      this.etapa = 1;
    } else {
      ++this.etapa;
    }

    this.atualizarResultado();
  }

  atualizarEstagio() {
    let [ estagio, qtdEtapas ] = this.obj.retornarStatus();

    if (estagio == 1) {
      this.estagio = 1;
      return;
    }

    if (this.etapa == qtdEtapas && estagio == 5) {
      this.estagio = 3;
      return;
    }

    if (linhaAtiva == 0 && colunaAtiva == 0) {
      this.estagio = 4;
    } else {
      this.estagio = 2;
    }
  }
}

$(function() {
  let op = new OperacaoDeterminante();
  op.instalarControles();
});
