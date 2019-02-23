let $ = require("jquery");

module.exports = {
  estiverEntre: function(valor, min, max) {
    if (valor >= min && valor <= max) return true;
    return false;
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
        if ($(`#${prefixo}${l}${c}`).val() == "") {
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

    let numLinhas = $(`#numLinhas${sufixo}`).val();
    let numColunas = $(`#numColunas${sufixo}`).val();

    return [numLinhas, numColunas];
  },

  /**
   * Direciona o usuário para preencher todas as entradas.
   */
  mostraErroEntradaIncompleta: function() {
    $("#erro-input-vazio").html(
      `<p class="mb-0 lead text-center conteudo alert alert-danger">Para continuar é necessário que <strong>todos</strong> os campos estejam preenchidos, por favor, atribua um valor aos campos destacados</p>`
    );
  },

  instalarControles: function(
    redimensionarMatrizes,
    realizarOperacao,
    voltar,
    avancar,
    finalizar,
    reiniciar
  ) {
    $("#numLinhas").change(function() {
      redimensionarMatrizes();
    });

    $("#numColunas").change(function() {
      redimensionarMatrizes();
    });

    $("#calcular").click(function() {
      realizarOperacao();
    });

    $(document).on("click", "#voltar", function() {
      voltar();
    });

    $(document).on("click", "#avancar", function() {
      avancar();
    });

    $(document).on("click", "#finalizar", function() {
      finalizar();
    });

    $(document).on("click", "#reiniciar", function() {
      reiniciar();
    });
  }
};
