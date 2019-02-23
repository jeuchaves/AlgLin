let $ = require("jquery");

module.exports = {
  estiverEntre: function(valor, min, max) {
    if (valor >= min && valor <= max) return true;
    return false;
  },

  instalarControles: function(redimensionarMatrizes) {
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
