function gerarMatriz(linhas, colunas, prefixo) {
    var html = "";

    for (var l = 1; l <= linhas; ++l) {
        html += "<tr>";
        for (var c = 1; c <= colunas; ++c) {
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

    var matA = $('#MatrizA');
    matA.html(gerarMatriz(linhas, colunas, 'a'));

    var matB = $('#MatrizB');
    matB.html(gerarMatriz(linhas, colunas, 'b'));
} 

function criarMatriz(linhas, colunas, prefixo) {
    var matriz = Array(linhas);
    for (var l = 1; l <= linhas; ++l) {
        matriz[l] = Array(colunas);
        for (var c = 1; c <= colunas; ++c) {
            matriz[l][c] = $(`#${prefixo}${l}${c}`).val();
        }
    }
    return matriz;
} 

function somarMatriz(linhas, colunas, matrizA, matrizB) {
    var matriz = Array(linhas);
    for (var l = 1; l <= linhas; ++l) {
        matriz[l] = Array(colunas);
        for (var c = 1; c <= colunas; ++c) {
            matriz[l][c] = parseInt(matrizA[l][c]) + parseInt(matrizB[l][c]);
        }
    }
    return matriz;
}

function imprimirMatriz(linhas, colunas, matriz) {
    html = `<h5 class="card-title text-center conteudo">Matriz Resultante</h5>`;
    html += `<table class="table table-bordered">`;
    for (var l = 1; l <= linhas; ++l) {
        html += "<tr>";
        for (var c = 1; c <= colunas; ++c) {
            html += `<td>${matriz[l][c]}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    return html;
}

function realizarSoma() {

    var linhas = $('#numLinhas').val();
    var colunas = $("#numColunas").val();

    if(!tamanhoValido(linhas)) linhas = 3;
    if(!tamanhoValido(colunas)) colunas = 3;

     if(!validarDados(linhas, colunas)) {
        $('#erro').text("Por favor, insira os dados em <strong>todos</strong> os campos das matrizes");
        var erro = $("#erro");
        erro.html(`<p class="mb-0 lead text-center conteudo alert alert-danger" id="erro">Por favor, insira os dados em <strong>todos</strong> os campos das matrizes</p>`);
        var resultado = $("#resultado");
        resultado.html(`<p class="lead">Após <strong>inserir os dados</strong> nas matrizes e <strong>clicar</strong> sobre o circulo. Seu resultado aparecerá aqui.</p>`);
        return;
     } else {
         $("#erro").text("");
     }

    var matrizA = criarMatriz(linhas, colunas, 'a');
    var matrizB = criarMatriz(linhas, colunas, 'b');

    var matrizC = somarMatriz(linhas, colunas, matrizA, matrizB);

    var matrizFinal = $('#resultado');
    matrizFinal.html(imprimirMatriz(linhas, colunas, matrizC));
}

function validarDados(linhas, colunas) {
    var temErro = false;
    for (var l = 1; l <= linhas; ++l) {
        for (var c = 1; c <= colunas; ++c) {
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
    if (valor > 0 && valor < 6) return true;
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
        realizarSoma();
    });
});

