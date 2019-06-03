let $ = require("jquery");
let utils = require("./utils");
let OperacaoSoma = require("./operacao_soma");

/**
 * Responsável por duplicar as duas primeiras colunas da matriz
 * (somente no caso de matrizes 3x3)
 */
class Estagio1 {

  constructor(etapa) {
    this.etapa = etapa;
  }
  
  calcular(matriz, tamanho) {
    
    let resp = Array(tamanho);
    
    for (let l = 1; l <= tamanho; ++l) {
      resp[l] = Array(tamanho);

      for (let c = 1; c <= tamanho + 2; ++c) {
        if (c > 3) resp[l][c] = matriz[l][c - 3];
        else resp[l][c] = matriz[l][c];
      }
    }

    return resp;
  }

  gerarMatriz(matriz, tamanho) {
    let html = `<h5 class="text-center m-3">Matriz A</h5>`;
    html += `<table class="table table-bordered">`;

    for (let l = 1; l <= tamanho; ++l) {
      html += "<tr>";

      for (let c = 1; c <= tamanho + 2; ++c) {
        if (c == this.etapa || c == (this.etapa + 3)) {
          html += `<td class="alert-dark">(a<sub>${l}${c}</sub>) `;
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

  gerarEnunciado() {
    
    let html = `<p class="lead">`;
    html += `Aparecerá algum texto nesse estágio (1° Estágio)<br>`;
    html += `Etapa: ${this.etapa}`
    html += `</p>`;

    return html;
  }

  retornarStatus() {
    return [1,2];
  }
}

/**
 * Multiplicação das diagonais principais
 */
class Estagio2 {

  constructor(tamanho, matriz, etapa) {
    this.tamanho = tamanho;
    this.diagonal = this.calcularDiagonal(matriz);
    this.etapa = etapa;
  }

  retornarStatus() {
    return [2,3];
  }

  calcularDiagonal(matriz) {
    let resp = Array(this.tamanho);

    for (let i = 1; i <= this.tamanho; ++i) 
      resp[i] = 1;

    for (let i = 1; i <= this.tamanho; ++i) {
      for (let j = 1; j <= this.tamanho; ++j) {
        for (let k = 1; k <= this.tamanho + 2; ++k) {
          if (j == k-(i-1)) {
            resp[i] *= matriz[j][k];
          }
        }
      }
    }

    return resp;
  }

  gerarEnunciado() {
    
    let html = `<p class="lead">`;
    html += `Aparecerá algum texto nesse estágio (2° Estágio)<br>`;

    let calc = this.gerarCalculo();
    html += `<strong>${calc}</strong>`;
    html += `</p>`;

    return html;
  }

  gerarCalculo() {
    
    let html = "";

    for (let i = 1; i <= this.tamanho; ++i) {
      
      //Verifica necessidade de sinal "+"
      let operadorSoma = "";
      if (i > 1 && i < this.tamanho) operadorSoma = " + ";

      html += operadorSoma;
      if (i <= this.etapa) {
  
        if (i == this.etapa)
          html += `<span class="badge badge-secondary">${this.diagonal[i]}</span>`
        else
          html += `${this.diagonal[i]}`;

      } else { 
        
        for (let l = 1; l <= this.tamanho; ++l) {
          for (let c = 1; c <= this.tamanho + 2; ++c) {
            if (l == c-(i-1)) {
              
              let operadorMult = "";
              if (l > 1 && l < this.tamanho) operadorMult = "×";
              
              html += operadorMult;
              html += `a<sub>${l}${c}</sub>`; 
              html += operadorMult;
            }
          }
        }

      }
      html += operadorSoma;

    }

    return html;
  }

  gerarMatriz(matriz) {
    let html = `<h5 class="text-center m-3">Matriz A</h5>`;
    html += `<table class="table table-bordered">`;

    for (let l = 1; l <= this.tamanho; ++l) {
      html += "<tr>";

      for (let c = 1; c <= this.tamanho + 2; ++c) {
        if (l == c-(this.etapa-1)) 
          html += `<td class="alert-dark">(a<sub>${l}${c}</sub>) <strong>${matriz[l][c]}</strong></td>`; 
        else 
          html += `<td>${matriz[l][c]}</td>`;
      }
      html += "</tr>";
    }

    html += "</table>";

    return html;
  }
}

/**
 * Multiplicação das diagonais secundárias
 */
class Estagio3 {

  constructor(tamanho, matriz, etapa) {
    this.tamanho = tamanho;
    this.diagonal = this.calcularDiagonal(matriz);
    this.etapa = etapa;
  }

  retornarStatus() {
    return [3,3];
  }

  calcularDiagonal(matriz) {
    let resp = Array(this.tamanho);

    for (let i = 1; i <= this.tamanho; ++i) 
      resp[i] = 1;

    for (let i = 1; i <= this.tamanho; ++i) {
      for (let j = 1; j <= this.tamanho; ++j) {
        for (let k = 1; k <= this.tamanho + 2; ++k) {
          if (j + k == 3 + i) {
            resp[i] *= matriz[j][k];
            resp[i] *= -1;
          }
        }
      }
    }

    return resp;
  }

  gerarEnunciado() {
    
    let html = `<p class="lead">`;
    html += `Aparecerá algum texto nesse estágio (3° Estágio)<br>`;

    let calc = this.gerarCalculo();
    html += `<strong>${calc}</strong>`;
    html += `</p>`;

    return html;
  }

  gerarCalculo() {
    
    let html = "";

    for (let i = 1; i <= this.tamanho; ++i) {

      if (i <= this.etapa) {

        if (i == this.etapa)
          html += `<span class="badge badge-secondary">${this.diagonal[i]}</span>`
        else
          html += `${this.diagonal[i]}`;

      } else { 
        
        html += " - ";
        for (let l = 1; l <= this.tamanho; ++l) {
          for (let c = 1; c <= this.tamanho + 2; ++c) {
            if (l + c == 3 + i) {
              
              let operadorMult = "";
              if (l > 1 && l < this.tamanho) operadorMult = "×";
              
              html += operadorMult;
              html += `a<sub>${l}${c}</sub>`; 
              html += operadorMult;
            }
          }
        }

      }

      html += " ";
    }

    return html;
  }

  gerarMatriz(matriz) {
    let html = `<h5 class="text-center m-3">Matriz A</h5>`;
    html += `<table class="table table-bordered">`;

    for (let l = 1; l <= this.tamanho; ++l) {
      html += "<tr>";

      for (let c = 1; c <= this.tamanho + 2; ++c) {
        if (l + c == 3 + this.etapa)
          html += `<td class="alert-dark">(a<sub>${l}${c}</sub>) <strong>${matriz[l][c]}</strong></td>`; 
        else 
          html += `<td>${matriz[l][c]}</td>`;
      }
      html += "</tr>";
    }

    html += "</table>";

    return html;
  }
}

class OperacaoDeterminante extends OperacaoSoma {
  
  constructor() {
    super();
    this.obj = new Estagio1(1);
  }

  redimensionarMatrizes() {
    let [numLinhas] = utils.getEntradaUnica();

    this.numLinhas = utils.limitar(numLinhas, 1, 3);

    $("#MatrizA").html(utils.gerarEntradaMatricial("a", this.numLinhas, this.numLinhas));
  }

  realizarOperacao() {
    let { numLinhas } = this;

    if (!utils.matrizEstaPreenchida("a", numLinhas, numLinhas)) {
      utils.mostraErroEntradaIncompleta();
      return;
    } else {
      $("#erro-input-vazio").html("");
    }

    $("#passo-a-passo").html(utils.criarPassoAPasso());

    this.mA = utils.recuperarMatriz("a", numLinhas, numLinhas);
    
    if (numLinhas == 3)
      this.mA = this.calcular();
    else this.obj = new Estagio2(this.numLinhas, this.mA, 1);

    this.atualizarResultado();
  }

  calcular(op) {
    return this.obj.calcular(this.mA, this.numLinhas);
  }

  imprimirResultado() {
    let html = "";

    html += this.gerarEnunciado();
    html += `<div class="col-md-8 offset-md-2">`;
    html += this.gerarMatriz();
    html += `</div>`;

    return html;
  }

  gerarMatriz(titulo, matriz, mostrarCalculo, prefixo) {
    return this.obj.gerarMatriz(this.mA, this.numLinhas);
  }

  gerarEnunciado(verbo) {
    return this.obj.gerarEnunciado();
  }

  voltar() {

    let [estagio] = this.obj.retornarStatus();

    if (this.obj.etapa == 1) {
      switch(estagio) {
        case 2:
          this.obj = new Estagio1(2);
          this.mA = this.calcular();
          break;
        case 3:
          this.obj = new Estagio2(this.numLinhas, this.mA, 3);
          break;
      }
    } else {
      --this.obj.etapa;
    }

    this.atualizarResultado();
  }

  avancar() {

    let [estagio, qtdEtapas] = this.obj.retornarStatus();

    if (this.obj.etapa == qtdEtapas) {
      switch(estagio) {
        case 1:
          this.obj = new Estagio2(this.numLinhas, this.mA, 1);
          break;
        case 2:
          this.obj = new Estagio3(this.numLinhas, this.mA, 1);

      }
      this.obj.etapa = 1;
    } else {
      ++this.obj.etapa;
    }

    this.atualizarResultado();
  }

  atualizarEstagio() {
    let [ estagio, qtdEtapas ] = this.obj.retornarStatus();

    if (estagio == 1 && this.obj.etapa == 1) {
      this.estagio = 1;
      return;
    }

    if (this.obj.etapa == qtdEtapas && estagio == 5) {
      this.estagio = 3;
      return;
    }

    if (this.linhaAtiva == 0 && this.colunaAtiva == 0) {
      this.estagio = 4;
    } else {
      this.estagio = 2;
    }
  }
}

$(function() {
  let op = new OperacaoDeterminante();
  op.instalarControles();
});
