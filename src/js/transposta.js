let $ = require("jquery");
let utils = require("./utils");
let OperacaoSoma = require("./operacao_soma");

class OperacaoTranposta extends OperacaoSoma {
  
  realizarOperacao() {
    let { numLinhas, numColunas } = this;

    if (!utils.matrizEstaPreenchida("a", numLinhas, numColunas)){
			utils.mostraErroEntradaIncompleta();
			return;
    } else {
			$("#erro-input-vazio").html("");
    }

    $("#passo-a-passo").html(utils.criarPassoAPasso());

    this.mA = utils.recuperarMatriz("a", numLinhas, numColunas);
    this.mC = this.calcular();

    this.atualizarResultado();
  }

  calcular(op) {
    let { numLinhas, numColunas } = this;
    let resp = Array(numColunas);

    /**
     * No resultado, o número de linhas é igual ao número de colunas da matriz A,
     * assim como o número de colunas é equivalente ao número de linhas da matriz a ser resultada.
     */
    for (let l = 1; l <= numColunas; ++l) {
      resp[l] = Array(numLinhas);

      for (let c = 1; c <= numLinhas; ++c) {
        resp[l][c] = this.mA[c][l];
      }
    }

    return resp;
  }

  gerarEnunciado(verbo) {

    let html = `<p class="lead">`;
		let l = this.linhaAtiva;
		let c = this.colunaAtiva;
    html += `O elemento <strong>b<sub>${c}${l}</sub></strong> `;
    html += `recebe o valor do elemento <strong>a<sub>${l}${c}</sub></strong>`;
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

    html += `<div class="col-md-6">`;
    html += this.gerarMatriz("Matriz A", this.mA, false, "a");
    html += `</div>`;

    html += `<div class="col-md-6">`;
    html += this.gerarMatriz("Matriz Resultante", this.mC, false, "b");
    html += `</div>`;

    html += ``;

    return html;
  }

  gerarMatriz(titulo, matriz, mostrarCalculo, prefixo) {
    let html = `<h5 class="card-title text-center conteudo">${titulo}</h5>`;
    html += `<table class="table table-bordered">`;

    let numLinhas = this.numLinhas;
    let numColunas = this.numColunas;

    /**
     * Caso for a matriz de prefixo c,
     * o número de linhas será o número de colunas e o de colunas o de linhas
     */
    if (prefixo == "b") {
      numLinhas = this.numColunas;
      numColunas = this.numLinhas;
    }
    
    for (let l = 1; l <= numLinhas; ++l) {
      html += "<tr>";

      for (let c = 1; c <= numColunas; ++c) {
        if (
          (l == this.linhaAtiva && c == this.colunaAtiva && prefixo == "a") ||
          (l == this.colunaAtiva && c == this.linhaAtiva && prefixo == "b") 
        ){
					html += `<td class="alert-dark">(${prefixo}<sub>${l}${c}</sub>) `;
					html += `<strong>${matriz[l][c]}</strong></td>`;
        } else {
          html += `<td>${matriz[l][c]}</td>`;
        }
			}
			
			html += "</tr>";
			
    }

    html += "</table>";
    return html;
  }

  voltar() {
    if (this.colunaAtiva == 1) {
      if (this.linhaAtiva > 1) {
        --this.linhaAtiva;
        this.colunaAtiva = this.numColunas;
      }
    } else {
      --this.colunaAtiva;
    }

    this.atualizarResultado();
  }

  avancar() { 
    if (this.colunaAtiva == this.numColunas) {
			++this.linhaAtiva;
			this.colunaAtiva = 1;
    } else {
      ++this.colunaAtiva;
    }

    this.atualizarResultado();
  }
}

$(function() {
  let op = new OperacaoTranposta();
  op.instalarControles();
});