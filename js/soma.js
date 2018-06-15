var L = 3; 
var C = 3;

var LINHADESTACADA= 1;
var COLUNADESTACADA = 1;

var MA, MB, MC;

function redimensionarMatrizes() {
    var linhas = $('#numLinhas').val();
    var colunas = $("#numColunas").val();

    if(!tamanhoValido(linhas)) linhas = 3;
    if(!tamanhoValido(colunas)) colunas = 3;

    L = linhas;
    C = colunas;

    var matA = $('#MatrizA');
    matA.html(gerarMatriz('a'));

    var matB = $('#MatrizB');
    matB.html(gerarMatriz('b'));
}

function tamanhoValido (valor) {
    if (valor > 0 && valor <= 4) return true;
    return false;
}

function gerarMatriz(prefixo) {
    var html = "";

    for (var l = 1; l <= L; ++l) {
        html += "<tr>";
        for (var c = 1; c <= C; ++c) {
            html += `<td><input class="form-control input-matriz" id="${prefixo}${l}${c}" placeholder="a${l}${c}" type="number"></td>`;
        }
        html += "</tr>";
    }

    return html;
}

function realizarOperacao() {

    if(!validarDados()) {
    $('#erro').text("Por favor, insira os dados em <strong>todos</strong> os campos das matrizes");
    var erro = $("#erro");
    erro.html(`<p class="mb-0 lead text-center conteudo alert alert-danger" id="erro">Por favor, insira os dados em <strong>todos</strong> os campos das matrizes</p>`);
    var resultado = $("#resultado");
    resultado.html(`<p class="lead">Após <strong>inserir os dados</strong> nas matrizes e <strong>clicar</strong> sobre o circulo. Seu resultado aparecerá aqui.</p>`);
    return;
    } else {
        $("#erro").text("");
    }

    var matrizA = criarMatriz('a');
    var matrizB = criarMatriz('b');

    var matrizC = operarMatriz(matrizA, matrizB);

    MA = matrizA;
    MB = matrizB;
    MC = matrizC;

    var result = $('#resultado');
    result.html(gerarResultado());

    var botao = $('#bts-resultado');
    botao.html(gerarBotoes());
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

function criarMatriz(prefixo) {
    var matriz = Array(L);
    for (var l = 1; l <= L; ++l) {
        matriz[l] = Array(C);
        for (var c = 1; c <= C; ++c) {
            matriz[l][c] = $(`#${prefixo}${l}${c}`).val();
        }
    }
    return matriz;
} 

function operarMatriz(matrizA, matrizB) {
    var matriz = Array(L);
    for (var l = 1; l <= L; ++l) {
        matriz[l] = Array(C);
        for (var c = 1; c <= C; ++c) {
            matriz[l][c] = parseInt(matrizA[l][c]) + parseInt(matrizB[l][c]);
        }
    }
    return matriz;
}

function gerarResultado() {
    $("#resultado").addClass("row");
    var html = "";  
    
    // Matriz A
    html += `<div class="col-md-3">`;
    html += `<h5 class="card-title text-center conteudo">Matriz A</h5>`;
    html += `<table class="table table-bordered">`;
    for (var l = 1; l <= L; ++l) {
        html += "<tr>";
        for (var c = 1; c <= C; ++c) {
            if(l == LINHADESTACADA && c == COLUNADESTACADA) html += `<td class="alert-dark">${MA[l][c]}</td>`;
            else html += `<td>${MA[l][c]}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    html += "</div>";

    // Matriz B
    html += `<div class="col-md-3">`;
    html += `<h5 class="card-title text-center conteudo">Matriz B</h5>`;
    html += `<table class="table table-bordered">`;
    for (var l = 1; l <= L; ++l) {
        html += "<tr>";
        for (var c = 1; c <= C; ++c) {
            if(l == LINHADESTACADA && c == COLUNADESTACADA) html += `<td class="alert-dark">${MB[l][c]}</td>`;
            else html += `<td>${MB[l][c]}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    html += "</div>";

    // Matriz Resultante
    html += `<div class="col-md-6">`;
    html += `<h5 class="card-title text-center conteudo">Matriz Resultante</h5>`;
    html += `<table class="table table-bordered">`;
    for (var l = 1; l <= L; ++l) {
        html += "<tr>";
        for (var c = 1; c <= C; ++c) {
            if(l == LINHADESTACADA && c == COLUNADESTACADA) html += `<td class="alert-dark">${MA[l][c]} + ${MB[l][c]} = ${MC[l][c]}</td>`;
            else html += `<td>${MC[l][c]}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    html += "</div>";
    
    return html;
}

function gerarBotoes() {

    $("#bts-resultado").addClass("row conteudo");
    var html = "";

    html += `<div class="col-md-6">`;
    if(LINHADESTACADA == 1 && COLUNADESTACADA == 1) html += "";
    else {
        html += `<div class="align-self-center text-right animation">`;
        html += `<img id="voltar" class="rounded-circle" src="img/template.jpg" widht="130" height="130">`;
        html += "</div>";
    }
    html += "</div>"

    html += `<div class="col-md-6">`;
    if(LINHADESTACADA == L && COLUNADESTACADA == C) html += "";
    else {
        html += `<div class="align-self-center text-left animation">`;
        html += `<img id="avancar" class="rounded-circle" src="img/template.jpg" widht="130" height="130">`;
        html += "</div>";
    }
    html += "</div>"

    return html;
}

function voltar() {
    if(COLUNADESTACADA <= 1) {
        COLUNADESTACADA = C;
        --LINHADESTACADA; 
    } else {
        --COLUNADESTACADA;
    }

    var result = $('#resultado');
    result.html(gerarResultado());
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

    var result = $('#resultado');
    result.html(gerarResultado());
    var botao = $('#bts-resultado');
    botao.html(gerarBotoes());
}

$(function () {        
    
    $('#numLinhas').change(function () {
        redimensionarMatrizes();
    });

    $('#numColunas').change(function () {
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

});

