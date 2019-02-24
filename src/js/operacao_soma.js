let $ = require("jquery");
let utils = require("./utils");

class OperacaoSoma {
  constructor() {
    this.numLinhas = 2;
    this.numColunas = 2;
    this.estagio = 1;
    this.linhaAtiva = 1;
    this.colunaAtiva = 1;
  }

  /**
   * Método chamado quando o usuário altera o tamanho das matrizes na interface.
   */
  redimensionarMatrizes() {
    let [numLinhas, numColunas] = utils.getEntradaTamanho();

    this.numLinhas = utils.limitar(numLinhas, 1, 4);
    this.numColunas = utils.limitar(numColunas, 1, 4);

    $("#MatrizA").html(
      utils.gerarEntradaMatricial("a", this.numLinhas, this.numColunas)
    );

    $("#MatrizB").html(
      utils.gerarEntradaMatricial("b", this.numLinhas, this.numColunas)
    );
  }

  /**
   * Realiza, por meio do operador binário ${op}, o cálculo da matriz resultante.
   */
  calcular(op) {
    let { numLinhas, numColunas } = this;
    let resp = Array(numLinhas);

    if (op == undefined) {
      op = (a, b) => a + b;
    }

    for (let l = 1; l <= numLinhas; ++l) {
      resp[l] = Array(numColunas);

      for (let c = 1; c <= numColunas; ++c) {
        let a = parseFloat(this.mA[l][c]);
        let b = parseFloat(this.mB[l][c]);
        resp[l][c] = utils.arredondar(op(a, b));
      }
    }

    return resp;
  }

  /**
   * Gera uma linha que descreve o cálculo do passo atual
   * Exemplo: 5 + 3 = 8.
   */
  gerarCalculo(l, c, op) {
    if (op == undefined) {
      op = "+";
    }

    let html = `${this.mA[l][c]} ${op} `;

    if (this.mB[l][c] < 0) {
      html += `(${this.mB[l][c]})`;
    } else {
      html += this.mB[l][c];
    }

    html += ` = ${this.mC[l][c]}`;

    return html;
  }

  /**
   * Retorna o HTML do enunciado do passo atual.
   */
  gerarEnunciado(verbo) {
    if (verbo == undefined) {
      verbo = "Some";
    }

    let html = `<p class="lead">`;
    let idx = `${this.linhaAtiva}${this.colunaAtiva}`;
    html += `${verbo} o elemento <strong>a<sub>${idx}</sub></strong> `;
    html += `com o elemento <strong>b<sub>${idx}</sub></strong>.<br>`;

    let calc = this.gerarCalculo(this.linhaAtiva, this.colunaAtiva);
    html += `<strong>${calc}</strong>`;
    html += `</p>`;

    return html;
  }

  /**
   * Retorna o HTML para mostrar uma matriz no quadro de resposta.
   */
  gerarMatriz(titulo, matriz, mostrarCalculo, prefixo) {
    let html = `<h5 class="card-title text-center conteudo">${titulo}</h5>`;
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

  /**
   * Retorna o HTML responsável por mostrar um escalar no quadro de resposta.
   */
  gerarEscalar(escalar) {
    let html = `<h5 class="card-title text-center conteudo">Escalar</h5>`;
    html += `<table class="table table-bordered">`;
    html += "<tr>";
    html += `<td class="alert-dark">${escalar}</td>`;
    html += "</tr>";
    html += "</table>";
    return html;
  }

  /**
   * Mostra o resultado da operação de forma passo-a-passo.
   */
  imprimirResultado() {
    let html = "";

    if (this.estagio == 4) {
      html += "";
    } else {
      html += this.gerarEnunciado();
    }

    html += `<div class="col-xl-12 row">`;

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

  /**
   * Verifica qual é o estágio atual do cálculo.
   *
   * Estágio 1: passo inicial
   * Estágio 2: passo intermediário
   * Estágio 3: último passo
   * Estágio 4: finalização
   */
  atualizarEstagio() {
    let { numLinhas, numColunas, linhaAtiva, colunaAtiva } = this;

    if (linhaAtiva == 1 && colunaAtiva == 1) {
      this.estagio = 1;
      return;
    }

    if (linhaAtiva == numLinhas && colunaAtiva == numColunas) {
      this.estagio = 3;
      return;
    }

    if (linhaAtiva == 0 && colunaAtiva == 0) {
      this.estagio = 4;
    } else {
      this.estagio = 2;
    }
  }

  /**
   * Atualiza o quadro de resultado de acordo com o passo atual.
   */
  atualizarResultado() {
    this.atualizarEstagio();
    $("#resultado").html(this.imprimirResultado());
    $("#botoes-passo-a-passo").html(this.imprimirBotoes());
  }

  /**
   * Realiza o cálculo da matriz resultante e mostra o passo-a-passo de como
   * chegar até lá.
   */
  realizarOperacao() {
    let { numLinhas, numColunas } = this;

    if (
      !utils.matrizEstaPreenchida("a", numLinhas, numColunas) |
      !utils.matrizEstaPreenchida("b", numLinhas, numColunas)
    ) {
      utils.mostraErroEntradaIncompleta();
      return;
    } else {
      $("#erro-input-vazio").html("");
    }

    $("#passo-a-passo").html(utils.criarPassoAPasso());

    this.mA = utils.recuperarMatriz("a", numLinhas, numColunas);
    this.mB = utils.recuperarMatriz("b", numLinhas, numColunas);
    this.mC = this.calcular();

    this.atualizarResultado();
  }

  // ** controle - ações dos botões **

  /**
   * Retorna ao passo anterior.
   */
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

  /**
   * Avança para o próximo passo.
   */
  avancar() {
    if (this.colunaAtiva == this.numColunas) {
      if (this.linhaAtiva < this.numLinhas) {
        ++this.linhaAtiva;
        this.colunaAtiva = 1;
      }
    } else {
      ++this.colunaAtiva;
    }

    this.atualizarResultado();
  }

  /**
   * Finaliza o cálculo.
   */
  finalizar() {
    this.linhaAtiva = 0;
    this.colunaAtiva = 0;
    this.atualizarResultado();
  }

  /**
   * Reinicia o cálculo passo-a-passo.
   */
  reiniciar() {
    this.linhaAtiva = 1;
    this.colunaAtiva = 1;
    this.atualizarResultado();
  }

  /**
   * Mostra os botões de acordo com o estágio atual.
   */
  imprimirBotoes() {
    let html = "";
    let botoes = $("#botoes-passo-a-passo");

    if (this.estagio != 4) {
      botoes.addClass("row");
    } else {
      botoes.removeClass("row");
    }

    switch (this.estagio) {
      case 1: // passo inicial
        html += `<div class="col-md-6">`;
        html += utils.gerarBotao("voltar", true); // botão escondido
        html += `</div>`;
        html += `<div class="col-md-6">`;
        html += utils.gerarBotao("avancar");
        break;
      case 2: // passo intermediário
        html += `<div class="col-md-6">`;
        html += utils.gerarBotao("voltar");
        html += `</div>`;
        html += `<div class="col-md-6">`;
        html += utils.gerarBotao("avancar");
        break;
      case 3: // último passo
        html += `<div class="col-md-6">`;
        html += utils.gerarBotao("voltar");
        html += `</div>`;
        html += `<div class="col-md-6">`;
        html += utils.gerarBotao("finalizar");
        break;
      case 4: // concluído
        html += utils.gerarBotao("reiniciar");
        break;
    }
    return html;
  }

  /**
   * Instala os manipuladores de eventos na página.
   */
  instalarControles() {
    let self = this; // para usar nos callbacks do jQuery

    $("#numLinhas").change(function() {
      self.redimensionarMatrizes();
    });

    $("#numColunas").change(function() {
      self.redimensionarMatrizes();
    });

    $("#calcular").click(function() {
      self.realizarOperacao();
    });

    $(document).on("click", "#voltar", function() {
      self.voltar();
    });

    $(document).on("click", "#avancar", function() {
      self.avancar();
    });

    $(document).on("click", "#finalizar", function() {
      self.finalizar();
    });

    $(document).on("click", "#reiniciar", function() {
      self.reiniciar();
    });
  }
}

module.exports = OperacaoSoma;
