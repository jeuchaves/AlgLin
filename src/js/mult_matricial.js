/**
 * Na função instalarControles é necessário acrescentar os leitores de mais dois inputs
 * visto que na multiplicação os tamanhos das matrizes não são equivalentes.
 * Já falando sobre redimensionar matrizes, precisa-se adicionar um novo parâmetro
 * para validação do tamanho, onde a coluna da matrizA deve ser igual a linha da matrizB
 *
 * Clicando na imagem de '=' o sistema deve retornar uma operação de multiplicação.
 * Simples de se resolver.
 *
 * A maneira de marcação do passo-a-passo também muda. Visto que deve ser selecionado a coluna da
 * matrizA e a linha da matrizB por inteiro, mateiral essa também muito simples de se solucionar.
 *
 * Creio que após essas alterações o programa já esteja funcionando.
 */

let $ = require("jquery");
let OperacaoSoma = require("./operacao_soma");

class OperacaoMultiplicacao extends OperacaoSoma {
  instalarControles() {
    super.instalarControles();

    $("#numLinhasX").change(function() {
      self.redimensionarMatrizes();
    });

    $("#numColunasX").change(function() {
      self.redimensionarMatrizes();
    });
  }
}

$(function() {
  let op = new OperacaoMultiplicacao();
  op.instalarControles();
});

/** 
var LA = 3, LB = 3; 
var CA = 3, CB = 3;

var ESTAGIO = 1;

var LINHAATIVA = 1;
var COLUNAATIVA = 1;

var MA, MB, MC;


function estiverEntre (valor, min, max) {
    if (valor >= min && valor <= max) return true;
    return false;
}

function gerarInputMatricial(prefixo, linha, coluna) {
    var html = "";
    for (var l = 1; l <= linha; ++l) {
        html += "<tr>";
        for (var c = 1; c <= coluna; ++c) {
            html += `<td><input class="form-control input-matriz" id="${prefixo}${l}${c}" placeholder="${prefixo}${l}${c}" type="number"></td>`;
        }
        html += "</tr>";
    }
    return html;
}

// *
function redimensionarMatrizes() {
    
    LA = $('#numLinhasA').val();
    CA = $("#numColunasA").val();
    LB = $('#numLinhasB').val();
    CB = $("#numColunasB").val();

    if(!estiverEntre(LA, 1, 4)) LA = 3;
    if(!estiverEntre(CA, 1, 4)) CA = 3;
    if(!estiverEntre(LB, 1, 4)) LB = 3;
    if(!estiverEntre(CB, 1, 4)) CB = 3;

    if(CA != LB) {
        tratarErroColunaDiferenteLinha();
        return;
    } else {
        $('erro-coluna-diferente-linha').html('');
        $('insercao-nas-matriz').removeClass('invisible');
    }

    $('#MatrizA').html(gerarInputMatricial('a', LA, CA));
    $('#MatrizB').html(gerarInputMatricial('b', LB, CB));
}

function estiverPreenchidoInput(prefixo, linha, coluna) {
    var temErro = false;
    for (var l = 1; l <= linha; ++l) {
        for (var c = 1; c <= coluna; ++c) {
            if($(`#${prefixo}${l}${c}`).val() == "") {
                $(`#${prefixo}${l}${c}`).addClass("alert-danger");
                temErro = true;
            } else $(`#${prefixo}${l}${c}`).removeClass("alert-danger");
        }
    }
    if(temErro) return false;
    return true;
}

function tratarErroInputVazio() {
    $("#erro-input-vazio").html(`<p class="mb-0 lead text-center conteudo alert alert-danger">Para continuar é necessário que <strong>todos</strong> os campos estejam preenchidos, por favor, atribua um valor aos campos destacados</p>`);
}

//Deu um grande problema aqui
function tratarErroColunaDiferenteLinha() {
    $('insercao-nas-matrizes').addClass('invisible');
    $('erro-coluna-diferente-linha').html(`<p class="mb-0 lead text-center conteudo alert alert-danger">Não será possivel continuar a operação enquanto o <strong>número de colunas</strong> da <strong>Matriz A</strong> for diferente do <strong>número de linhas</strong> da <strong>Matriz B</strong></p>`)
}

function criarMatriz(prefixo, linha, coluna) {
    var matriz = Array(linha);
    for (var l = 1; l <= linha; ++l) {
        matriz[l] = Array(coluna);
        for (var c = 1; c <= coluna; ++c) {
            matriz[l][c] = $(`#${prefixo}${l}${c}`).val();
        }
    }
    return matriz;
} 

// *
function operarMatriz(matrizA, matrizB, linha, coluna) {
    var matriz = Array(linha);
    for (var l = 1; l <= linha; ++l) {
        matriz[l] = Array(coluna);
        for (var c = 1; c <= coluna; ++c) {
            matriz[l][c] = parseFloat(matrizA[l][c]) + parseFloat(matrizB[l][c]);
            matriz[l][c] = arredondar(matriz[l][c], 2);
        }
    }
    return matriz;
}

// *
function gerarEnunciado() {
    var html = "";

    html += `<p class="lead">`;
    html += `Some o elemento <strong>a<sub>${LINHAATIVA}${COLUNAATIVA}</sub></strong> com o elemento <strong>b<sub>${LINHAATIVA}${COLUNAATIVA}</sub></strong>.<br>`;
    html += `<strong>${gerarCalculo(LINHAATIVA,COLUNAATIVA)}</strong>`;
    html += `</p>`

    return html;
}

function gerarMatriz(titulo, matriz, linha, coluna, mostrarCalculo) {
    var html = "";
    html += `<h5 class="card-title text-center conteudo">${titulo}</h5>`;
    html += `<table class="table table-bordered">`;
    for (var l = 1; l <= linha; ++l) {
        html += "<tr>";
        for (var c = 1; c <= coluna; ++c) {
            if(l == LINHAATIVA && c == COLUNAATIVA) {
                if(mostrarCalculo) {
                    html += `<td class="alert-dark">`;
                    html += gerarCalculo(l,c);
                    html += `</td>`;
                } else html += `<td class="alert-dark">(a<sub>${LINHAATIVA}${COLUNAATIVA}</sub>) <strong>${matriz[l][c]}</strong></td>`;
            }
            else html += `<td>${matriz[l][c]}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";

    return html;
}

// * MUDA OS DADOS DOS RESULTADOS
function imprimirResultado() {
    var html = "";

    if(ESTAGIO == 4) html += "";
    else {
        html += gerarEnunciado();
    }

    html += `<div class="col-xl-12 row">`;

    html += `<div class="col-md-3">`;
    html += gerarMatriz("Matriz A", MA, L, C);
    html += `</div>`

    html += `<div class="col-md-3">`;
    html += gerarMatriz("Matriz B", MB, L, C);
    html += `</div>`

    html += `<div class="col-md-6">`;
    html += gerarMatriz("Matriz C", MC, L, C, true);
    html += `</div>`

    html += `</div>`
    
    return html;
}

// * MUDA OS DADOS DOS RESULTADOS
function realizarOperacao() {

    if((!estiverPreenchidoInput('a', L, C)) | (!estiverPreenchidoInput('b', L, C))) {
        tratarErroInputVazio();   
        return;
    } else {
        $('#erro').html("");
    }

    $('#passo-a-passo').html(criarPassoAPasso());

    MA = criarMatriz('a', L, C);
    MB = criarMatriz('b', L, C);
    MC = operarMatriz(MA, MB, L, C);

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

function arredondar(numero, casasDecimais) {
    casasDecimais = typeof casasDecimais !== 'undefined' ?  casasDecimais : 2;
    return +(Math.floor(numero + ('e+' + casasDecimais)) + ('e-' + casasDecimais));
}

// *
function gerarCalculo(l,c) {
    var html = "";

    html += `${MA[l][c]} + `;
    
    if (eNegativo(MB[l][c])) html += `(${MB[l][c]})`;
    else html += `${MB[l][c]}`;

    html += ` = ${MC[l][c]}`;

    return html;
}

function eNegativo(valor) {
    if(valor >= 0) return false;
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
    var botoes = $('#botoes-passo-a-passo');
    
    if (ESTAGIO != 4) botoes.addClass('row');
    else botoes.removeClass('row');

    switch(ESTAGIO) {
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
        if(LINHAATIVA == L && COLUNAATIVA == C) ESTAGIO = 3;
        else {
            if (LINHAATIVA == 0 && COLUNAATIVA == 0) ESTAGIO = 4;
            else ESTAGIO = 2;
        }
    }
}

function atualizarResultado() {
    atualizarEstagio();
    $('#resultado').html(imprimirResultado());
    $('#botoes-passo-a-passo').html(imprimirBotoes());
}

function voltar() {
    
    if(COLUNAATIVA == 1) {
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
    if(COLUNAATIVA == C) {
        if(LINHAATIVA < L) {
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

$(function () {                         
    $('#numLinhasA').change(function () {
        redimensionarMatrizes();
    });

    $('#numColunasA').change(function () {
        redimensionarMatrizes();
    });

    $('#numLinhasB').change(function () {
        redimensionarMatrizes();
    });

    $('#numColunasB').change(function () {
        redimensionarMatrizes();
    });

    $('#calcular').click(function () {
        realizarOperacao();
    });

    $(document).on('click', '#voltar', function() {
        voltar();
    });

    $(document).on('click', '#avancar', function() {
        avancar();
    });

    $(document).on('click', '#finalizar', function() {
        finalizar();
    });

    $(document).on('click', '#reiniciar', function() {
        reiniciar();
    });

});

*/
