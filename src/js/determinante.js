let $ = require("jquery");
let utils = require("./utils");
let OperacaoSoma = require("./operacao_soma");

/**
 * Responsável por duplicar as duas primeiras colunas da matriz
 * (somente no caso de matrizes 3x3)
 */
class Estagio1 {

  constructor(tamanho, matriz, etapa) {
    this.tamanho = tamanho;
    this.matriz = matriz;
    this.etapa = etapa;
  }
  
  gerarMatriz() {
    let html = `<h5 class="text-center m-3">Matriz A</h5>`;
    html += `<table class="table table-bordered">`;

    for (let l = 1; l <= this.tamanho; ++l) {
      html += "<tr>";

      for (let c = 1; c <= this.tamanho + 2; ++c) {
        if (c == this.etapa || c == (this.etapa + 3)) {
          html += `<td class="alert-dark">(a<sub>${l}${c}</sub>) `;
          html += `<strong>${this.matriz[l][c]}</strong></td>`;
        } else {
          html += `<td>${this.matriz[l][c]}</td>`;
        }
      }
      html += "</tr>";
    }

    html += "</table>";
    return html;
  }

  gerarEnunciado() {
    
    let html = `<p class="lead">`;
    if(this.etapa == 1)
      html += `Duplique a <strong>primeira coluna</strong> da <strong>Matriz A</strong> para a <strong>quarta coluna</strong>.<br>`;
    else 
      html += `Duplique a <strong>segunda coluna</strong> da <strong>Matriz A</strong> para a <strong>quinta coluna</strong>.<br>`;
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
    this.etapa = etapa;
    this.matriz = matriz;

    this.diagonal = this.calcularDiagonal();
  }

  retornarStatus() {
    if (this.tamanho > 2)
      return [2,3];
    else 
      return [2,1];
  }

  calcularDiagonal() {
    
    let resp = Array(this.tamanho);

    for (let i = 1; i <= this.tamanho; ++i) 
      resp[i] = 1;

    for (let i = 1; i <= this.tamanho; ++i) {
      for (let j = 1; j <= this.tamanho; ++j) {
        for (let k = 1; k <= this.tamanho + 2; ++k) {
          if (j == k-(i-1)) {
            resp[i] *= this.matriz[j][k];
          }
        }
      }
    }

    return resp;
  }

  gerarEnunciado() {
    
    let html = `<p class="lead">`;
    html += `<strong>Multiplique</strong> os elementos destacados.<br>`;

    let calc;
    calc = this.gerarCalculo("posicao", this.etapa);
    html += `<strong>${calc}</strong>, `;

    calc = this.gerarCalculo("elemento", this.etapa, true);
    html += `ou seja, <strong>${calc}</strong>. `;

    calc = this.gerarCalculo("resultado", this.etapa, false);
    html += `Obtendo assim o resultado <strong>${calc}</strong>.`;

    html += `</p>`;

    return html;
  }

  gerarCalculo(formato, posicao, usarParenteses) {

    let html = "";

    if (formato == "resultado") {
      if (this.diagonal[posicao] < 0 && usarParenteses) html += `(${this.diagonal[posicao]})`;
      else html += this.diagonal[posicao];  
    } else {
      for (let l = 1; l <= this.tamanho; ++l) {
        for (let c = 1; c <= this.tamanho + 2; ++c) {
          if (l == c - (posicao - 1)) {
            
            let opMult = "";
            if (l > 1 && l < this.tamanho) opMult += "×";

            html += opMult;
            if (formato == "posicao") {
              html += `a<sub>${l}${c}</sub>`;
            } else {
              if (this.matriz[l][c] < 0 && usarParenteses && l > 1) html += `(${this.matriz[l][c]})`;
              else html += this.matriz[l][c];
            }

            html += opMult;
          }
        }
      }
    }

    return html;
  }

  gerarMatriz() {

    let html = `<h5 class="text-center m-3">Matriz A</h5>`;
    html += `<table class="table table-bordered">`;

    for (let l = 1; l <= this.tamanho; ++l) {
      html += "<tr>";

      for (let c = 1; c <= this.tamanho + 2; ++c) {
        if (l == c-(this.etapa-1)) 
          html += `<td class="alert-dark">(a<sub>${l}${c}</sub>) <strong>${this.matriz[l][c]}</strong></td>`; 
        else 
          html += `<td>${this.matriz[l][c]}</td>`;
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
    this.matriz = matriz;
    this.etapa = etapa;

    this.diagonal = this.calcularDiagonal();
  }

  retornarStatus() {
    return [3,3];
  }

  calcularDiagonal() {
    let resp = Array(this.tamanho);

    for (let i = 1; i <= this.tamanho; ++i) 
      resp[i] = 1;

    for (let i = 1; i <= this.tamanho; ++i) {
      for (let j = 1; j <= this.tamanho; ++j) {
        for (let k = 1; k <= this.tamanho + 2; ++k) {
          if (j + k == 3 + i) {
            resp[i] *= this.matriz[j][k];
            resp[i] *= -1;
          }
        }
      }
    }

    return resp;
  }

  gerarEnunciado() {
    
    let html = `<p class="lead">`;
    html += `<strong>Multiplique</strong> os elementos destacados, em seguida, multiplique-o por <strong>-1</strong>.<br>`;

    let calc;
    calc = this.gerarCalculo("posicao", this.etapa);
    html += `<strong>${calc}×(-1)</strong>, `;

    calc = this.gerarCalculo("elemento", this.etapa, true);
    html += `ou seja, <strong>${calc}×(-1)</strong>. `;

    calc = this.gerarCalculo("resultado", this.etapa, false);
    html += `Obtendo assim o resultado <strong>${calc}</strong>.`;

    html += `</p>`;

    return html;
  }

  gerarCalculo(formato, posicao, usarParenteses) {
    
    let html = "";

    if (formato == "resultado") {
      if (this.diagonal[posicao] < 0 && usarParenteses) html += `(${this.diagonal[posicao]})`;
      else html += this.diagonal[posicao];  
    } else {
      for (let l = 1; l <= this.tamanho; ++l) {
        for (let c = 1; c <= this.tamanho + 2; ++c) {
          if (l + c == 3 + posicao) {
            
            let opMult = "";
            if (l > 1 && l < this.tamanho) opMult += "×";

            html += opMult;
            if (formato == "posicao") {
              html += `a<sub>${l}${c}</sub>`;
            } else {
              if (this.matriz[l][c] < 0 && usarParenteses && l > 1) html += `(${this.matriz[l][c]})`;
              else html += this.matriz[l][c];
            }

            html += opMult;
          }
        }
      }
    }

    return html;
  }

  gerarMatriz() {

    let html = `<h5 class="text-center m-3">Matriz A</h5>`;
    html += `<table class="table table-bordered">`;

    for (let l = 1; l <= this.tamanho; ++l) {
      html += "<tr>";

      for (let c = 1; c <= this.tamanho + 2; ++c) {
        if (l + c == 3 + this.etapa)
          html += `<td class="alert-dark">(a<sub>${l}${c}</sub>) <strong>${this.matriz[l][c]}</strong></td>`; 
        else 
          html += `<td>${this.matriz[l][c]}</td>`;
      }
      html += "</tr>";
    }

    html += "</table>";

    return html;
  }
}

/**
 * Finalização do cálculo
 * (mostrando de maneira mais matemática e conclusiva)
 */
class Estagio4 {

  constructor(tamanho, matriz, etapa) {
    this.etapa = etapa;
    this.tamanho = tamanho;
    this.matriz = matriz;

    this.est2 = new Estagio2(this.tamanho, this.matriz, 1);
    this.est3 = new Estagio3(this.tamanho, this.matriz, 1);
  }

  retornarStatus() {
    return [4,6];
  }

  calcularResultado() {
    let r1 = this.est2.calcularDiagonal();
    let r2 = this.est3.calcularDiagonal();

    let soma = 0;
    for (let i = 1; i <= 6; ++i) {
      if (i <= 3) soma += r1[i];
      else soma += r2[i-3];
    }

    return soma;
  }

  gerarEnunciado() {

    let html = `<p class="lead">`;
    html += `Agora, basta <strong>somar</strong> os resultados obtidos anteriormente.<br>`;

    for (let i = 1; i <= this.tamanho; ++i) {

      let opSoma = "";
      if (i > 1 && i < this.tamanho) opSoma = " + ";
      html += opSoma;

      let calc = this.est2.gerarCalculo("resultado", i, true);
      if (this.etapa == i)
        html += `<span class="badge badge-secondary">${calc}</span>`;
      else
        html += `<strong>${calc}</strong>`;

      html += opSoma;
    }

    html += " + ";

    for (let i = 1; i <= this.tamanho; ++i) {

      let opSoma = "";
      if (i > 1 && i < this.tamanho) opSoma = " + ";
      html += opSoma;
      
      let calc = this.est3.gerarCalculo("resultado", i, true);
      if (this.etapa - 3 == i)
        html += `<span class="badge badge-secondary">${calc}</span>`;
      else
        html += `<strong>${calc}</strong>`;

      html += opSoma;
    }

    let resultado = this.calcularResultado();
    html += `<strong> = ${resultado}</strong>`;

    return html;
  }

  gerarMatriz() {

    if (this.etapa <= 3) {
      this.est2.etapa = this.etapa;
    } else {
      this.est3.etapa = this.etapa - 3;
    }

    if (this.etapa <= 3) return this.est2.gerarMatriz();
    return this.est3.gerarMatriz();
  }
}

class Estagio5 {

  constructor(tamanho, matriz, etapa) {
    this.etapa = etapa;
    this.tamanho = tamanho;
    this.matriz = matriz;

    this.estagio4 = new Estagio4(tamanho, matriz, etapa);
  }

  retornarStatus() {
    return [5,1];
  }

  gerarEnunciado() {
    
    let resultado = this.estagio4.calcularResultado();

    let html = `<p class="lead">`;
    html += `Logo, o determinante dessa operação é <strong>${resultado}</strong>`;
    html += `</p>`;

    return html;
  }

  gerarMatriz() {

    let html = `<h5 class="text-center m-3">Matriz A</h5>`;
    html += `<table class="table table-bordered">`;

    for (let l = 1; l <= this.tamanho; ++l) {
      html += "<tr>";

      for (let c = 1; c <= this.tamanho + 2; ++c) {
        html += `<td>${this.matriz[l][c]}</td>`;
      }
      html += "</tr>";
    }

    html += "</table>";

    return html;
  }
}

class OperacaoDeterminante extends OperacaoSoma {
  
  /* Quando implementar as demais ordens da matriz tirar o comentário 
  redimensionarMatrizes() {
    let [numLinhas] = utils.getEntradaUnica();

    this.numLinhas = utils.limitar(numLinhas, 3, 3);

    $("#MatrizA").html(utils.gerarEntradaMatricial("a", this.numLinhas, this.numLinhas));
  }
  */

  realizarOperacao() {
    
    // let { numLinhas } = this;
    let numLinhas = 3;

    if (!utils.matrizEstaPreenchida("a", numLinhas, numLinhas)) {
      utils.mostraErroEntradaIncompleta();
      return;
    } else {
      $("#erro-input-vazio").html("");
    }

    $("#passo-a-passo").html(utils.criarPassoAPasso());

    this.mA = utils.recuperarMatriz("a", numLinhas, numLinhas);
    
    switch (numLinhas) {
      case 1:
        this.obj = new Estagio5(numLinhas, this.mA, 1);
        break;
      case 2:
        this.obj = new Estagio2(numLinhas, this.mA, 1);
        break;
      case 3:
        this.mA = this.calcular();
        this.obj = new Estagio1(numLinhas, this.mA, 1);
        break;
    }

    this.atualizarResultado();
  }

  calcular(op) {
        
    let resp = Array(this.numLinhas);
    
    for (let l = 1; l <= this.numLinhas; ++l) {
      resp[l] = Array(this.numLinhas + 2);

      for (let c = 1; c <= this.numLinhas + 2; ++c) {
        if (c > 3) resp[l][c] = this.mA[l][c - 3];
        else resp[l][c] = this.mA[l][c];
      }
    }

    return resp;
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
    return this.obj.gerarMatriz();
  }

  gerarEnunciado(verbo) {
    return this.obj.gerarEnunciado();
  }

  voltar() {

    let [estagio] = this.obj.retornarStatus();

    if (this.obj.etapa == 1) {
      switch(estagio) {
        case 2:
          this.obj = new Estagio1(this.numLinhas, this.mA, 2);
          this.mA = this.calcular();
          break;
        case 3:
          this.obj = new Estagio2(this.numLinhas, this.mA, 3);
          break;
        case 4:
          this.obj = new Estagio3(this.numLinhas, this.mA, 3);
          break;
        case 5:
          this.obj = new Estagio4(this.numLinhas, this.mA, 6);
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
          break;
        case 3:
          this.obj = new Estagio4(this.numLinhas, this.mA, 1);
          break;
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

    if (this.obj.etapa == qtdEtapas && estagio == 4) {
      this.estagio = 3;
      return;
    }

    if (this.obj.etapa == qtdEtapas && estagio == 5) {
      this.estagio = 4;
    } else {
      this.estagio = 2;
    }
  }

  finalizar() {
    this.obj = new Estagio5(this.numLinhas, this.mA, 1);
    this.atualizarResultado();
  }

  reiniciar() {
    this.obj = new Estagio1(this.numLinhas, this.mA, 1);
    this.mA = this.calcular();
    this.atualizarResultado();
  }
}

$(function() {
  let op = new OperacaoDeterminante();
  op.instalarControles();
});
