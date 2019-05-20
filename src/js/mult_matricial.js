let $ = require("jquery");
let utils = require("./utils");
let OperacaoSoma = require("./operacao_soma");

class OperacaoMultiplicacao extends OperacaoSoma {
  
  redimensionarMatrizes() {
    let [numLinhas, numColunas] = utils.getEntradaTamanho();
    let [numLinhasX, numColunasX] = utils.getEntradaTamanho("X");

    /**
     * Verifica se o número de colunas da matrizA é igual ao número de linhas da matrizB,
     * assim como se o usuário já inseriu os dados da quantida de linhas da matrizB 
     */
    if (numColunas != numLinhasX && !isNaN(numLinhasX)) {
      $("#insercao-nas-matrizes").addClass("invisible");
      $("#erro-coluna-diferente-linha").html(
        `<p class="mb-0 lead text-center conteudo alert alert-danger">O <strong>número de colunas</strong> da <strong>Matriz A</strong> está diferente do <strong>número de linhas</strong> da <strong>Matriz B</strong></p>`
      );
      return;
    } else {
      $("#erro-coluna-diferente-linha").html("");
      $("#insercao-nas-matrizes").removeClass("invisible");
    }

    // limita o tamanho
    this.numLinhas = utils.limitar(numLinhas, 1, 4);
    this.numColunas = utils.limitar(numColunas, 1, 4);
    this.numLinhasX = utils.limitar(numLinhasX, 1, 4);
    this.numColunasX = utils.limitar(numColunasX, 1, 4);

    $("#MatrizA").html(
      utils.gerarEntradaMatricial("a", this.numLinhas, this.numColunas)
    );

    $("#MatrizB").html(
      utils.gerarEntradaMatricial("b", this.numLinhasX, this.numColunasX)
    );
  }

  instalarControles() {
    let self = this; // para usar nos callbacks do jQuery
    super.instalarControles();

    $("#numLinhasX").change(function() {
      self.redimensionarMatrizes();
    });

    $("#numColunasX").change(function() {
      self.redimensionarMatrizes();
    });
  }

  realizarOperacao() {
    let { numLinhas, numColunas, numLinhasX, numColunasX } = this;

    if (
      !utils.matrizEstaPreenchida("a", numLinhas, numColunas) |
      !utils.matrizEstaPreenchida("b", numLinhasX, numColunasX)
    ) {
      utils.mostraErroEntradaIncompleta();
      return;
    } else {
      $("#erro-input-vazio").html("");
    }

    $("#passo-a-passo").html(utils.criarPassoAPasso());

    this.mA = utils.recuperarMatriz("a", numLinhas, numColunas);
    this.mB = utils.recuperarMatriz("b", numLinhasX, numColunasX);
    this.mC = this.calcular();

    this.atualizarResultado();
  }

  calcular(op) {
    let { numLinhas, numColunasX, numColunas } = this;
    let resp = Array(numLinhas);

    /**
     * Inicialização da matriz resultante com o número zero,
     * para assim poder somar as multiplicações de cada índice.
     */
    for (let l = 1; l <= numLinhas; ++l) {
      resp[l] = Array(numColunasX);
      for (let c = 1; c <= numColunasX; ++c) {
        resp[l][c] = 0;
      }
    }

    // Fórmula padrão de multiplicação de matrizes
    for (let l = 1; l <= numLinhas; ++l) {
      for (let c = 1; c <= numColunasX; ++c) {
        for (let k = 1; k <= numColunas; ++k) {
          resp[l][c] += this.mA[l][k] * this.mB[k][c];
        }
        resp[l][c] = utils.arredondar(resp[l][c]);
      }      
    }
    return resp;
  }

  gerarCalculo(l, c, op) {
    let {numColunas} = this;

    let html = "";

    for (let i = 1; i <= numColunas; ++i) {
      html += `${this.mA[l][i]} * `;

      if (this.mB[i][c] < 0) {
        html += `(${this.mB[i][c]})`;
      } else {
        html += this.mB[i][c];
      }      

      if (i != numColunas) {
        html += " + ";
      }
    }
    
    html += ` = ${this.mC[l][c]}`;

    return html;
  }

  gerarEnunciado(verbo) {
    let {linhaAtiva, colunaAtiva} = this;
    
    let html = `<p class="lead">`;
    html += `Multiplique os elementos da linha <strong>${linhaAtiva}</strong> `;
    html += `da <strong>Matriz A (a esquerda)</strong> `;
    html += `pelos elementos correspondentes da coluna `;
    html += `<strong>${colunaAtiva}</strong> da <strong>Matriz B (a direita)</strong> `;
    html += `para obter o elemento <strong>c<sub>${linhaAtiva}${colunaAtiva}</sub></strong>.<br>`;

    let calc = this.gerarCalculo(linhaAtiva, colunaAtiva);
    html += `<strong>${calc}</strong>`;
    html += `</p>`;

    return html;
  }

  gerarMatriz(titulo, matriz, mostrarCalculo, prefixo) {
    let html = `<h5 class="card-title text-center conteudo">${titulo}</h5>`;
    html += `<table class="table table-bordered">`;

    let numLinhas = this.numLinhas;
    let numColunas = this.numColunas;

    switch (prefixo) {
      case "b": 
        numLinhas = this.numLinhasX;
        numColunas = this.numColunasX
        break;
      case "c": 
        numColunas = this.numColunasX;
        break;
    }

    for (let l = 1; l <= numLinhas; ++l) {
      html += "<tr>";

      for (let c = 1; c <= numColunas; ++c) {
        if (
          (l == this.linhaAtiva && prefixo == "a") ||
          (c == this.colunaAtiva && prefixo == "b") ||
          (l == this.linhaAtiva && c == this.colunaAtiva)
        ) {
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

  voltar() {
    if (this.colunaAtiva == 1) {
      if (this.linhaAtiva > 1) {
        --this.linhaAtiva;
        this.colunaAtiva = this.numColunasX;
      }
    } else {
      --this.colunaAtiva;
    }

    this.atualizarResultado();
  }

  avancar() {
    if (this.colunaAtiva == this.numColunasX) {
      if (this.linhaAtiva < this.numLinhas) {
        ++this.linhaAtiva;
        this.colunaAtiva = 1;
      }
    } else {
      ++this.colunaAtiva;
    }

    this.atualizarResultado();
  }

  atualizarEstagio() {
    let { numLinhas, numColunasX, linhaAtiva, colunaAtiva } = this;

    if (linhaAtiva == 1 && colunaAtiva == 1) {
      this.estagio = 1;
      return;
    }

    if (linhaAtiva == numLinhas && colunaAtiva == numColunasX) {
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
  let op = new OperacaoMultiplicacao();
  op.instalarControles();
});