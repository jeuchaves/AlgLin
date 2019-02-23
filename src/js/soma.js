let $ = require("jquery");
let utils = require("./utils");

var L = 3;
var C = 3;

var ESTAGIO = 1;

var LINHAATIVA = 1;
var COLUNAATIVA = 1;

var MA, MB, MC;

function redimensionarMatrizes() {
  let [numLinhas, numColunas] = utils.getEntradaTamanho();
  L = numLinhas;
  C = numColunas;

  if (!utils.estiverEntre(L, 1, 4)) L = 3;
  if (!utils.estiverEntre(C, 1, 4)) C = 3;

  $("#MatrizA").html(utils.gerarEntradaMatricial("a", L, C));
  $("#MatrizB").html(utils.gerarEntradaMatricial("b", L, C));
}

function realizaOperacao(matrizA, matrizB, linha, coluna) {
  let matriz = Array(linha);

  for (let l = 1; l <= linha; ++l) {
    matriz[l] = Array(coluna);

    for (let c = 1; c <= coluna; ++c) {
      matriz[l][c] = parseFloat(matrizA[l][c]) + parseFloat(matrizB[l][c]);
      matriz[l][c] = utils.arredondar(matriz[l][c]);
    }
  }

  return matriz;
}

function gerarEnunciado() {
  var html = "";

  html += `<p class="lead">`;
  html += `Some o elemento <strong>a<sub>${LINHAATIVA}${COLUNAATIVA}</sub></strong> com o elemento <strong>b<sub>${LINHAATIVA}${COLUNAATIVA}</sub></strong>.<br>`;
  html += `<strong>${gerarCalculo(LINHAATIVA, COLUNAATIVA)}</strong>`;
  html += `</p>`;

  return html;
}

function gerarMatriz(titulo, matriz, linha, coluna, mostrarCalculo) {
  var html = "";
  html += `<h5 class="card-title text-center conteudo">${titulo}</h5>`;
  html += `<table class="table table-bordered">`;
  for (var l = 1; l <= linha; ++l) {
    html += "<tr>";
    for (var c = 1; c <= coluna; ++c) {
      if (l == LINHAATIVA && c == COLUNAATIVA) {
        if (mostrarCalculo) {
          html += `<td class="alert-dark">`;
          html += gerarCalculo(l, c);
          html += `</td>`;
        } else
          html += `<td class="alert-dark">(a<sub>${LINHAATIVA}${COLUNAATIVA}</sub>) <strong>${
            matriz[l][c]
          }</strong></td>`;
      } else html += `<td>${matriz[l][c]}</td>`;
    }
    html += "</tr>";
  }
  html += "</table>";

  return html;
}

// * MUDA OS DADOS DOS RESULTADOS
function imprimirResultado() {
  var html = "";

  if (ESTAGIO == 4) html += "";
  else {
    html += gerarEnunciado();
  }

  html += `<div class="col-xl-12 row">`;

  html += `<div class="col-md-3">`;
  html += gerarMatriz("Matriz A", MA, L, C);
  html += `</div>`;

  html += `<div class="col-md-3">`;
  html += gerarMatriz("Matriz B", MB, L, C);
  html += `</div>`;

  html += `<div class="col-md-6">`;
  html += gerarMatriz("Matriz C", MC, L, C, true);
  html += `</div>`;

  html += `</div>`;

  return html;
}

function realizarOperacao() {
  if (
    !utils.matrizEstaPreenchida("a", L, C) |
    !utils.matrizEstaPreenchida("b", L, C)
  ) {
    utils.mostraErroEntradaIncompleta();
    return;
  } else {
    $("#erro-input-vazio").html("");
  }

  $("#passo-a-passo").html(criarPassoAPasso());

  MA = utils.recuperarMatriz("a", L, C);
  MB = utils.recuperarMatriz("b", L, C);
  MC = realizaOperacao(MA, MB, L, C);

  atualizarResultado();
}

function criarPassoAPasso() {
  var html = "";
  html += `<h1 class="display-3">Passo a Passo</h1>`;
  html += `<hr class="linha">`;
  html += `<div id="resultado" class="col-xl-12"></div>`;
  html += `<div id="botoes-passo-a-passo" class="col-xl-12"></div>`;

  return html;
}

// *
function gerarCalculo(l, c) {
  var html = "";

  html += `${MA[l][c]} + `;

  if (eNegativo(MB[l][c])) html += `(${MB[l][c]})`;
  else html += `${MB[l][c]}`;

  html += ` = ${MC[l][c]}`;

  return html;
}

function eNegativo(valor) {
  if (valor >= 0) return false;
  return true;
}

function gerarBotao(nomeImagem, semAnimacao) {
  var html = "";
  if (semAnimacao) html += `<div class="align-self-center text-center">`;
  else html += `<div class="align-self-center text-center animation">`;
  html += `<img id="${nomeImagem}" class="icone-p" src="img/botao/${nomeImagem}.png">`;
  html += "</div>";

  return html;
}

function imprimirBotoes() {
  var html = "";
  var botoes = $("#botoes-passo-a-passo");

  if (ESTAGIO != 4) botoes.addClass("row");
  else botoes.removeClass("row");

  switch (ESTAGIO) {
    case 1:
      html += `<div class="col-md-6">`;
      html += gerarBotao("voltar", true);
      html += `</div>`;
      html += `<div class="col-md-6">`;
      html += gerarBotao("avancar");
      break;
    case 2:
      html += `<div class="col-md-6">`;
      html += gerarBotao("voltar");
      html += `</div>`;
      html += `<div class="col-md-6">`;
      html += gerarBotao("avancar");
      break;
    case 3:
      html += `<div class="col-md-6">`;
      html += gerarBotao("voltar");
      html += `</div>`;
      html += `<div class="col-md-6">`;
      html += gerarBotao("finalizar");
      break;
    case 4:
      html += gerarBotao("reiniciar");
      break;
  }
  return html;
}

function atualizarEstagio() {
  if (LINHAATIVA == 1 && COLUNAATIVA == 1) ESTAGIO = 1;
  else {
    if (LINHAATIVA == L && COLUNAATIVA == C) ESTAGIO = 3;
    else {
      if (LINHAATIVA == 0 && COLUNAATIVA == 0) ESTAGIO = 4;
      else ESTAGIO = 2;
    }
  }
}

function atualizarResultado() {
  atualizarEstagio();
  $("#resultado").html(imprimirResultado());
  $("#botoes-passo-a-passo").html(imprimirBotoes());
}

function voltar() {
  if (COLUNAATIVA == 1) {
    if (LINHAATIVA > 1) {
      --LINHAATIVA;
      COLUNAATIVA = C;
    }
  } else {
    --COLUNAATIVA;
  }

  atualizarResultado();
}

function avancar() {
  if (COLUNAATIVA == C) {
    if (LINHAATIVA < L) {
      ++LINHAATIVA;
      COLUNAATIVA = 1;
    }
  } else {
    ++COLUNAATIVA;
  }

  atualizarResultado();
}

function finalizar() {
  LINHAATIVA = 0;
  COLUNAATIVA = 0;

  atualizarResultado();
}

function reiniciar() {
  LINHAATIVA = 1;
  COLUNAATIVA = 1;

  atualizarResultado();
}

$(function() {
  utils.instalarControles(
    redimensionarMatrizes,
    realizarOperacao,
    voltar,
    avancar,
    finalizar,
    reiniciar
  );
});
