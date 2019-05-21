let $ = require("jquery");
let utils = require("./utils");
let OperacaoSoma = require("./operacao_soma");

class OperacaoTranposta extends OperacaoSoma {
  
  realizarOperacao() {
    let { numLinhas, numColunas } = this;

    if (!utils.matrizEstaPreenchida("a", numLinhas, numColunas)){
			utils.mostraErroEntradaIncompleta();
			return;
    } else {
			$("#erro-input-vazio").html("");
    }

    $("#passo-a-passo").html(utils.criarPassoAPasso());

    this.mA = utils.recuperarMatriz("a", numLinhas, numColunas);
    this.mC = this.calcular();

    this.atualizarResultado();
  }

  calcular(op) {
    let { numLinhas, numColunas } = this;
    let resp = Array(numColunas);

    /**
     * No resultado, o número de linhas é igual ao número de colunas da matriz A,
     * assim como o número de colunas é equivalente ao número de linhas da matriz a ser resultada.
     */
    for (let l = 1; l <= numColunas; ++l) {
      resp[l] = Array(numLinhas);

      for (let c = 1; c <= numLinhas; ++c) {
        resp[l][c] = this.mA[c][l];
      }
    }

    return resp;
  }

  gerarEnunciado(verbo) {

    let html = `<p class="lead">`;
		let l = this.linhaAtiva;
		let c = this.colunaAtiva;
    html += `O elemento <strong>b<sub>${c}${l}</sub></strong> `;
    html += `recebe o valor do elemento <strong>a<sub>${l}${c}</sub></strong>`;
    html += `</p>`;

    return html;
  }

  imprimirResultado() {
    let html = "";

    if (this.estagio == 4) {
      html += "";
    } else {
      html += this.gerarEnunciado();
    }

    html += `<div class="col-xl-12 row">`;

    html += `<div class="col-md-6">`;
    html += this.gerarMatriz("Matriz A", this.mA, false, "a");
    html += `</div>`;

    html += `<div class="col-md-6">`;
    html += this.gerarMatriz("Matriz Resultante", this.mC, false, "b");
    html += `</div>`;

    html += ``;

    return html;
  }

  gerarMatriz(titulo, matriz, mostrarCalculo, prefixo) {
    let html = `<h5 class="card-title text-center conteudo">${titulo}</h5>`;
    html += `<table class="table table-bordered">`;

    let numLinhas = this.numLinhas;
    let numColunas = this.numColunas;

    /**
     * Caso for a matriz de prefixo c,
     * o número de linhas será o número de colunas e o de colunas o de linhas
     */
    if (prefixo == "b") {
      numLinhas = this.numColunas;
      numColunas = this.numLinhas;
    }
    
    for (let l = 1; l <= numLinhas; ++l) {
      html += "<tr>";

      for (let c = 1; c <= numColunas; ++c) {
        if (
          (l == this.linhaAtiva && c == this.colunaAtiva && prefixo == "a") ||
          (l == this.colunaAtiva && c == this.linhaAtiva && prefixo == "b") 
        ){
					html += `<td class="alert-dark">(${prefixo}<sub>${l}${c}</sub>) `;
					html += `<strong>${matriz[l][c]}</strong></td>`;
        } else {
          html += `<td>${matriz[l][c]}</td>`;
        }
			}
			
			html += "</tr>";
			
    }

    html += "</table>";
    return html;
  }

  voltar() {
    if (this.colunaAtiva == 1) {
      if (this.linhaAtiva > 1) {
        --this.linhaAtiva;
        this.colunaAtiva = this.numColunas;
      }
    } else {
      --this.colunaAtiva;
    }

    this.atualizarResultado();
  }

  avancar() { 
    if (this.colunaAtiva == this.numColunas) {
			++this.linhaAtiva;
			this.colunaAtiva = 1;
    } else {
      ++this.colunaAtiva;
    }

    this.atualizarResultado();
  }
}

$(function() {
  let op = new OperacaoTranposta();
  op.instalarControles();
});

/*
var L = 3; 
var C = 3;

var LINHADESTACADA= 1;
var COLUNADESTACADA = 1;

var MA, MB;

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

function tamanhoValido (valor) {
    if (valor > 0 && valor <= 4) return true;
    return false;
}

function gerarMatriz(prefixo) {
    var html = "";

    for (var l = 1; l <= L; ++l) {
        html += "<tr>";
        for (var c = 1; c <= C; ++c) {
            html += `<td><input class="form-control input-matriz" id="${prefixo}${l}${c}" placeholder="${prefixo}${l}${c}" type="number"></td>`;
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

    var matrizB = operarMatriz(matrizA);

    MA = matrizA;
    MB = matrizB;

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

function operarMatriz(matrizA) {
    var matriz = Array(C);
    for (var l = 1; l <= C; ++l) {
        matriz[l] = Array(L);
        for (var c = 1; c <= L; ++c) {
            matriz[l][c] = matrizA[c][l];
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
        html += `O elemento <strong>b<sub>${COLUNADESTACADA}${LINHADESTACADA}</sub></strong> recebe o valor do elemento <strong>a<sub>${LINHADESTACADA}${COLUNADESTACADA}</sub></strong>`;
        html += `</p>`
    }

    html += `<div class="col-xl-12 row">`
    // Matriz A
    html += `<div class="col-md-6">`;
    html += `<h5 class="card-title text-center conteudo">Matriz</h5>`;
    html += `<table class="table table-bordered">`;
    for (var l = 1; l <= L; ++l) {
        html += "<tr>";
        for (var c = 1; c <= C; ++c) {
            if(l == LINHADESTACADA && c == COLUNADESTACADA) html += `<td class="alert-dark">(a<sub>${LINHADESTACADA}${COLUNADESTACADA}</sub>) <strong>${MA[l][c]}</strong></td>`;
            else html += `<td>${MA[l][c]}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    html += "</div>";

    // Matriz B
    html += `<div class="col-md-6">`;
    html += `<h5 class="card-title text-center conteudo">Matriz Tranposta</h5>`;
    html += `<table class="table table-bordered">`;
    for (var l = 1; l <= C; ++l) {
        html += "<tr>";
        for (var c = 1; c <= L; ++c) {
            if(l == COLUNADESTACADA && c == LINHADESTACADA) html += `<td class="alert-dark">(b<sub>${COLUNADESTACADA}${LINHADESTACADA}</sub>) <strong>${MB[l][c]}</strong></td>`;
            else html += `<td>${MB[l][c]}</td>`;
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

    if(LINHADESTACADA == 0 && COLUNADESTACADA == 0) {
        $("#bts-resultado").removeClass("row");
        html += `<div class="align-self-center text-center animation">`;
        html += `<img id="reiniciar" class="icone-p" src="img/botao/reiniciar.png">`;
        html += "</div>";    
    } else {
        html += `<div class="col-md-6">`;
        if(LINHADESTACADA == 1 && COLUNADESTACADA == 1) {
            html += `<div class="align-self-center text-right">`;
            html += `<img class="icone-p" src="img/botao/voltar.png">`;
            html += "</div>";
        } else {
            html += `<div class="align-self-center text-right animation">`;
            html += `<img id="voltar" class="icone-p" src="img/botao/voltar.png">`;
            html += "</div>";
        }
        html += "</div>"

        html += `<div class="col-md-6">`;
        if(LINHADESTACADA == L && COLUNADESTACADA == C) {
            html += `<div class="align-self-center text-left animation">`;
            html += `<img id="finalizar" class="icone-p" src="img/botao/finalizar.png">`;
            html += "</div>";    
        } else {
            html += `<div class="align-self-center text-left animation">`;
            html += `<img id="avancar" class="icone-p" src="img/botao/avancar.png">`;
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

    if (LINHADESTACADA == 0) {
        LINHADESTACADA = L;
        COLUNADESTACADA = C;
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

*/