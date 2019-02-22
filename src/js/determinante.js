var T = 3; 

var ESTAGIO = 1;

var LINHADESTACADA = 1;
var COLUNADESTACADA = 1;

var MA, MB, MC;

function eValidoTamanho (valor, min, max) {
    if (valor >= min && valor <= max) return true;
    return false;
}

function gerarInputMatricial(linhas, colunas, prefixo) {
    var html = "";

    for (var l = 1; l <= linhas; ++l) {
        html += "<tr>";
        for (var c = 1; c <= colunas; ++c) {
            html += `<td><input class="form-control input-matriz" id="${prefixo}${l}${c}" placeholder="${prefixo}${l}${c}" type="number"></td>`;
        }
        html += "</tr>";
    }

    return html;
}

function redimensionarMatrizes() {
    T = $('#tamanho').val();

    if(!eValidoTamanho(T, 1, 4)) T = 3;

    var matA = $('#MatrizA');
    matA.html(gerarInputMatricial(T, T, 'a'));
}

function validarDados() {
    var temErro = false;
    for (var l = 1; l <= L; ++l) {
        for (var c = 1; c <= C; ++c) {
            if($(`#a${l}${c}`).val() == "") {
                $(`#a${l}${c}`).addClass("alert-danger");
                temErro = true;
            } else {
                $(`#a${l}${c}`).removeClass("alert-danger");
            }
            if($(`#b${l}${c}`).val() == "") {
                $(`#b${l}${c}`).addClass("alert-danger");
                temErro = true;
            } else {
                $(`#b${l}${c}`).removeClass("alert-danger");
            }
        }
    }
    if(temErro) return false;
    return true;
}

function VerificarErro() {
    if(!validarDados()) {
        $('#erro').text("Por favor, insira os dados em <strong>todos</strong> os campos das matrizes");
        var erro = $("#erro");
        erro.html(`<p class="mb-0 lead text-center conteudo alert alert-danger" id="erro">Por favor, insira os dados em <strong>todos</strong> os campos das matrizes</p>`);
        var resultado = $("#resultado");
        resultado.html(`<p class="lead">Após <strong>inserir os dados</strong> nas matrizes e <strong>clicar</strong> sobre o sinal de igual. Seu resultado aparecerá aqui.</p>`);
        return;
    } else {
        $("#erro").text("");
    }
}

function criarMatriz(linha, coluna, prefixo) {
    var matriz = Array(linha);
    for (var l = 1; l <= linha; ++l) {
        matriz[l] = Array(coluna);
        for (var c = 1; c <= coluna; ++c) {
            matriz[l][c] = $(`#${prefixo}${l}${c}`).val();
        }
    }
    return matriz;
} 

function operarMatriz() {
    var matriz = Array(L);
    for (var l = 1; l <= L; ++l) {
        matriz[l] = Array(C);
        for (var c = 1; c <= C; ++c) {
            matriz[l][c] = parseFloat(MA[l][c]) + parseFloat(MB[l][c]);
            matriz[l][c] = arredondar(matriz[l][c], 2);
        }
    }
    return matriz;
}

function enunciadoHTML() {
    var html = "";

    html += `<hr class="linha">`;
    html += `<p class="lead">`;
    html += `Some o elemento <strong>a<sub>${LINHADESTACADA}${COLUNADESTACADA}</sub></strong> com o elemento <strong>b<sub>${LINHADESTACADA}${COLUNADESTACADA}</sub></strong>.<br>`;
    html += `<strong>${gerarCalculo(LINHADESTACADA,COLUNADESTACADA)}</strong>`;
    html += `</p>`

    return html;
}

function matrizHTML(titulo, matriz, mostrarCalculo) {
    var html = "";
    html += `<h5 class="card-title text-center conteudo">${titulo}</h5>`;
    html += `<table class="table table-bordered">`;
    for (var l = 1; l <= L; ++l) {
        html += "<tr>";
        for (var c = 1; c <= C; ++c) {
            if(l == LINHADESTACADA && c == COLUNADESTACADA) {
                if(mostrarCalculo) {
                    html += `<td class="alert-dark">`;
                    html += gerarCalculo(l,c);
                    html += `</td>`;
                } else html += `<td class="alert-dark">(a<sub>${LINHADESTACADA}${COLUNADESTACADA}</sub>) <strong>${matriz[l][c]}</strong></td>`;
            }
            else html += `<td>${matriz[l][c]}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    html += "</div>";

    return html;
}

function imprimirResultado() {
    var html = "";

    if(ESTAGIO == 0) html += "";
    else {
        html += enunciadoHTML();
    }

    html += `<div class="col-xl-12 row">`;

    html += `<div class="col-md-3">`;
    html += matrizHTML("Matriz A", MA);

    html += `<div class="col-md-3">`;
    html += matrizHTML("Matriz B", MB);

    html += `<div class="col-md-6">`;
    html += matrizHTML("Matriz C", MC, true);
    
    return html;
}

function realizarOperacao() {

    VerificarErro();

    MA = criarMatriz(L, C, 'a');
    MB = criarMatriz(L, C, 'b');

    MC = operarMatriz(MA, MB);

    var result = $('#resultado');
    result.html(imprimirResultado());

    var botao = $('#bts-resultado');
    botao.html(gerarBotoes());
}


function arredondar(numero, casasDecimais) {
    casasDecimais = typeof casasDecimais !== 'undefined' ?  casasDecimais : 2;
    return +(Math.floor(numero + ('e+' + casasDecimais)) + ('e-' + casasDecimais));
}

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

function imagemHTML(nomeImagem, semAnimacao) {
    var html = "";
    if (semAnimacao) html += `<div class="align-self-center text-center">`;
    else html += `<div class="align-self-center text-center animation">`;
    html += `<img id="${nomeImagem}" class="icone-p" src="img/botao/${nomeImagem}.png">`;
    html += "</div>";

    return html;
}

function gerarBotoes() {
    var html = "";
    
    if (ESTAGIO != 0) $("#bts-resultado").addClass("row");

    switch(ESTAGIO) {
        case 0:
            $("#bts-resultado").removeClass("row");
            html += imagemHTML("reiniciar");
            break;
        case 1:
            html += `<div class="col-md-6">`;
            html += imagemHTML("voltar", true);
            html += `</div>`;
            html += `<div class="col-md-6">`;
            html += imagemHTML("avancar");
            break;
        case 2:
            html += `<div class="col-md-6">`;
            html += imagemHTML("voltar");
            html += `</div>`;
            html += `<div class="col-md-6">`;
            html += imagemHTML("avancar");
            break;
        case 3:
            html += `<div class="col-md-6">`;
            html += imagemHTML("voltar");
            html += `</div>`;
            html += `<div class="col-md-6">`;
            html += imagemHTML("finalizar");
            break;
    }
    return html;
}

function atualizarEstagio() {
    if (LINHADESTACADA == 0) ESTAGIO = 0;
    else if (LINHADESTACADA == L && COLUNADESTACADA == C) ESTAGIO = 3;
    else if (LINHADESTACADA == 1 && COLUNADESTACADA == 1) ESTAGIO = 1;
    else ESTAGIO = 2;
}
function voltar() {
    
    if(COLUNADESTACADA <= 1) {
        COLUNADESTACADA = C;
        --LINHADESTACADA; 
    } else {
        --COLUNADESTACADA;
    }

    atualizarEstagio();

    var result = $('#resultado');
    result.html(imprimirResultado());
    var botao = $('#bts-resultado');
    botao.html(gerarBotoes());
}

function avancar() {
    if(COLUNADESTACADA >= C) {
        ++LINHADESTACADA;
        COLUNADESTACADA = 1;
    } else {
        ++COLUNADESTACADA;
    }

    atualizarEstagio();

    var result = $('#resultado');
    result.html(imprimirResultado());
    var botao = $('#bts-resultado');
    botao.html(gerarBotoes());
}

function finalizar() {
    LINHADESTACADA = 0;
    COLUNADESTACADA = 0;

    atualizarEstagio();

    var result = $('#resultado');
    result.html(imprimirResultado());
    var botao = $('#bts-resultado');
    botao.html(gerarBotoes());
}

function reiniciar() {
    LINHADESTACADA = 1;
    COLUNADESTACADA = 1;

    atualizarEstagio();

    var result = $('#resultado');
    result.html(imprimirResultado());
    var botao = $('#bts-resultado');
    botao.html(gerarBotoes());
}

$(function () {     
        
    $('#tamanho').change(function () {
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

