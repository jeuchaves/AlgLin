let $ = require("jquery");

module.exports = {
  /**
   * Gera um botão, retornando o seu HTML.
   */
  gerarBotao: function(nomeImagem, semAnimacao) {
    let html = "";
    if (semAnimacao) {
      html += `<div class="align-self-center text-center">`;
    } else {
      html += `<div class="align-self-center text-center animation">`;
    }

    html += `<img id="${nomeImagem}" class="icone-p" src="img/botao/${nomeImagem}.png">`;
    html += "</div>";

    return html;
  },

  /**
   * Limita o valor para a faixa [min, max].
   */
  limitar: function(val, min, max) {
    return Math.min(max, Math.max(min, val));
  },

  /**
   * Retorna o leiaute principal da página.
   */
  criarPassoAPasso: function() {
    let html = `<h1 class="display-3">Passo a Passo</h1>`;
    html += `<hr class="linha">`;
    html += `<div id="resultado" class="col-xl-12"></div>`;
    html += `<div id="botoes-passo-a-passo" class="col-xl-12"></div>`;

    return html;
  },

  /**
   * Gera a entrada de dados para os coeficientes de uma matriz.
   *
   * Cada entrada de dados de um coeficiente recebe um *id* seguindo o modelo
   * ${prefixo}{l}{c}, onde l e c são a linha e colunas atuais (contando a partir de 1).
   */
  gerarEntradaMatricial: function(prefixo, numLinhas, numColunas) {
    let html = "";
    for (let l = 1; l <= numLinhas; ++l) {
      html += "<tr>";
      for (let c = 1; c <= numColunas; ++c) {
        html += `<td><input class="form-control input-matriz" id="${prefixo}${l}${c}" placeholder="${prefixo}${l}${c}" type="number"></td>`;
      }
      html += "</tr>";
    }
    return html;
  },

  /**
   * Recupera os coeficientes fornecidos pelo usuário, retornando-os
   * em forma de matriz (Array de Array).
   */
  recuperarMatriz: function(prefixo, numLinhas, numColunas) {
    let matriz = Array(numLinhas);

    for (let l = 1; l <= numLinhas; ++l) {
      matriz[l] = Array(numColunas);

      for (let c = 1; c <= numColunas; ++c) {
        matriz[l][c] = $(`#${prefixo}${l}${c}`).val();
      }
    }

    return matriz;
  },

  /**
   * Verifica se os coeficientes de uma matriz foram fornecidos, retornando
   * um booleano.
   */
  matrizEstaPreenchida: function(prefixo, numLinhas, numColunas) {
    let temErro = false;

    for (let l = 1; l <= numLinhas; ++l) {
      for (let c = 1; c <= numColunas; ++c) {
        let val = parseFloat($(`#${prefixo}${l}${c}`).val());
        if (isNaN(val)) {
          $(`#${prefixo}${l}${c}`).addClass("alert-danger");
          temErro = true;
        } else {
          $(`#${prefixo}${l}${c}`).removeClass("alert-danger");
        }
      }
    }

    return !temErro;
  },

  /**
   * Verifica se uma entrada escalar está preenchida.
   */
  escalarEstaPreenchido: function() {
    let val = parseFloat($("#numEscalar").val());
    let temErro = isNaN(val);

    if (temErro) {
      $("#numEscalar").addClass("alert-danger");
    } else {
      $("#numEscalar").removeClass("alert-danger");
    }

    return !temErro;
  },

  /**
   * Arredonda um número para uma quantidade de casas decimais.
   * O padrão é duas casas.
   */
  arredondar: function(numero, casas) {
    if (casas == undefined) {
      casas = 2;
    }

    return +(Math.round(numero + ("e+" + casas)) + ("e-" + casas));
  },

  /**
   * Retorna o tamanho da matriz apontada pelo sufixo (padrão é vazio "").
   * Os valores são retornados como um Array de duas posições.
   */
  getEntradaTamanho: function(sufixo) {
    if (sufixo == undefined) {
      sufixo = "";
    }

    let numLinhas = parseInt($(`#numLinhas${sufixo}`).val());
    let numColunas = parseInt($(`#numColunas${sufixo}`).val());

    return [numLinhas, numColunas];
  },

  /**
   * Direciona o usuário para preencher todas as entradas.
   */
  mostraErroEntradaIncompleta: function() {
    $("#erro-input-vazio").html(
      `<p class="mb-0 lead text-center conteudo alert alert-danger">Por favor, atribua um valor númerico aos campos destacados.</p>`
    );
  }
};
