var L = 3; 
var C = 3;

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

    var matB = $('#MatrizB');
    matB.html(gerarMatriz('b'));
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
            matriz[l][c] = parseInt(matrizA[l][c]) - parseInt(matrizB[l][c]);
        }
    }
    return matriz;
}

function imprimirMatriz(matriz) {
    html = `<h5 class="card-title text-center conteudo">Matriz Resultante</h5>`;
    html += `<table class="table table-bordered">`;
    for (var l = 1; l <= L; ++l) {
        html += "<tr>";
        for (var c = 1; c <= C; ++c) {
            html += `<td>${matriz[l][c]}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
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

    var matrizFinal = $('#resultado');
    matrizFinal.html(imprimirMatriz(matrizC));
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
});

