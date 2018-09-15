var L = 3; 
var C = 3;

var NESCALAR, MA, MR;

var LINHADESTACADA = 1; 
var COLUNADESTACADA = 1;

function arredondar(numero, casasDecimais) {
    casasDecimais = typeof casasDecimais !== 'undefined' ?  casasDecimais : 2;
    return +(Math.floor(numero + ('e+' + casasDecimais)) + ('e-' + casasDecimais));
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

function redimensionarMatrizes() {
    var linhas = $('#numLinhas').val();
    var colunas = $("#numColunas").val();

    if(!tamanhoValido(linhas)) linhas = 3;
    if(!tamanhoValido(colunas)) colunas = 3;

    L = linhas;
    C = colunas;

    var matA = $('#MatrizA');
    matA.html(gerarMatriz('a'));
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

function operarMatriz(matrizA, numEscalar) {
    var matriz = Array(L);
    for (var l = 1; l <= L; ++l) {
        matriz[l] = Array(C);
        for (var c = 1; c <= C; ++c) {
            matriz[l][c] = matrizA[l][c] * numEscalar;   
            matriz[l][c] = arredondar(matriz[l][c], 2);     
        }
    }
    return matriz;
}

function gerarResultado() {
    var html = "";  

    // Enunciado
    if(LINHADESTACADA == 0 && COLUNADESTACADA == 0) html += "";
    else {
        html += `<hr class="linha">`;
        html += `<p class="lead">`;
        html += `Multiplique o elemento <strong>a<sub>${LINHADESTACADA}${COLUNADESTACADA}</sub></strong> por <strong>${NESCALAR}</strong>.<br>`;
        html += `<strong>${gerarCalculo(LINHADESTACADA,COLUNADESTACADA)}</strong>`;
        html += `</p>`
    }

    html += `<div class="col-xl-12 row">`
    // Matriz A
    html += `<div class="col-md-3">`;
    html += `<h5 class="card-title text-center conteudo">Número Escalar</h5>`;
    html += `<table class="table table-bordered">`;
    html += "<tr>";
    html += `<td class="alert-dark">${NESCALAR}</td>`;
    html += "</tr>";
    html += "</table>";
    html += "</div>";

    // Matriz B
    html += `<div class="col-md-3">`;
    html += `<h5 class="card-title text-center conteudo">Matriz B</h5>`;
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

    // Matriz Resultante
    html += `<div class="col-md-6">`;
    html += `<h5 class="card-title text-center conteudo">Matriz Resultante</h5>`;
    html += `<table class="table table-bordered">`;
    for (var l = 1; l <= L; ++l) {
        html += "<tr>";
        for (var c = 1; c <= C; ++c) {
            if(l == LINHADESTACADA && c == COLUNADESTACADA) {
                html += `<td class="alert-dark">`;
                html += gerarCalculo(l,c);
                html += `</td>`;   
            }
            else html += `<td>${MR[l][c]}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    html += "</div>";
    
    return html;
}

function gerarCalculo(l,c) {
    var html = "";

    html += `${NESCALAR} x `;
    
    if (isNegativo(MA[l][c])) html += `(${MA[l][c]})`;
    else html += `${MA[l][c]}`;

    html += ` = ${MR[l][c]}`;

    return html;
}

function isNegativo(valor) {
    if(valor >= 0) return false;
    return true;
}

function gerarBotoes() {
    $("#bts-resultado").addClass("row conteudo");
    var html = "";

    if(LINHADESTACADA == 0 && COLUNADESTACADA == 0) {
        $("#bts-resultado").removeClass("row");
        html += `<div class="align-self-center text-center animation">`;
        html += `<img id="reiniciar" class="rounded-circle" src="img/botoes/recarregar.png" widht="130" height="130">`;
        html += "</div>";    
    } else {
        html += `<div class="col-md-6">`;
        if(LINHADESTACADA == 1 && COLUNADESTACADA == 1) {
            html += `<div class="align-self-center text-right">`;
            html += `<img class="rounded-circle" src="img/botoes/voltar desabilitado.jpg" widht="130" height="130">`;
            html += "</div>";
        } else {
            html += `<div class="align-self-center text-right animation">`;
            html += `<img id="voltar" class="rounded-circle" src="img/botoes/voltar.png" widht="130" height="130">`;
            html += "</div>";
        }
        html += "</div>"

        html += `<div class="col-md-6">`;
        if(LINHADESTACADA == L && COLUNADESTACADA == C) {
            html += `<div class="align-self-center text-left animation">`;
            html += `<img id="finalizar" class="rounded-circle" src="img/botoes/finalizar.png" widht="130" height="130">`;
            html += "</div>";    
        } else {
            html += `<div class="align-self-center text-left animation">`;
            html += `<img id="avancar" class="rounded-circle" src="img/botoes/avancar.png" widht="130" height="130">`;
            html += "</div>";
        }
        html += "</div>"
    }

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

function finalizar() {
    LINHADESTACADA = 0;
    COLUNADESTACADA = 0;

    var result = $('#resultado');
    result.html(gerarResultado());
    var botao = $('#bts-resultado');
    botao.html(gerarBotoes());
}

function reiniciar() {
    LINHADESTACADA = 1;
    COLUNADESTACADA = 1;

    var result = $('#resultado');
    result.html(gerarResultado());
    var botao = $('#bts-resultado');
    botao.html(gerarBotoes());
}

function realizarOperacao() {

    var numEscalar = $("#numEscalar").val();

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

    var matriz = operarMatriz(matrizA, numEscalar);
    
    NESCALAR = numEscalar;
    MA = matrizA;
    MR = matriz;

    var matrizFinal = $('#resultado');
    matrizFinal.html(gerarResultado());
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
        }
    }

    if($("#numEscalar").val() == "") {
        $("#numEscalar").addClass("alert-danger");
        temErro = true;
    } else {
        $("#numEscalar").removeClass("alert-danger");
    }

    if(temErro) return false;
    return true;
}

function tamanhoValido (valor) {
    if (valor > 0 && valor <= 4) return true;
    return false;
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

    $(document).on('click', '#finalizar', function() {
        finalizar();
    });

    $(document).on('click', '#reiniciar', function() {
        reiniciar();
    });
});

