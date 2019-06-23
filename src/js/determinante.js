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
    return [2,3];
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

    let calc = this.gerarCalculo("posicao", this.etapa);
    html += `<strong>${calc}</strong>`;
    html += "<br>";

    calc = this.gerarCalculo("elemento", this.etapa);
    html += `<strong>${calc}</strong>`;
    html += "<br>";

    calc = this.gerarCalculo("resultado", this.etapa);
    html += `<strong>${calc}</strong>`;
    html += "<br>";

    html += `</p>`;

    return html;
  }

  gerarCalculo(mostrar, campoDestacado) {
    
    let html = "";

    for (let i = 1; i <= this.tamanho; ++i) {

      //Verifica necessidade de sinal "+"
      let operadorSoma = "";
      if (i > 1 && i < this.tamanho) operadorSoma = " + ";
      html += operadorSoma;
      
      if (mostrar == "resultado") {
        
        if (i == campoDestacado) {
          if (this.diagonal[i] < 0 && i > 1) 
            html += `<span class="badge badge-secondary">(${this.diagonal[i]})</span>`;
          else
            html += `<span class="badge badge-secondary">${this.diagonal[i]}</span>`;
        } else {
          if (this.diagonal[i] < 0 && i > 1) 
            html += `(${this.diagonal[i]})`;
          else
            html += this.diagonal[i];
        }

      } else { 
        if (i == campoDestacado) 
          html += `<span class="badge badge-secondary">`;

        for (let l = 1; l <= this.tamanho; ++l) {
          for (let c = 1; c <= this.tamanho + 2; ++c) {
            if (l == c - (i-1)) {
              let operadorMult = "";
              if (l > 1 && l < this.tamanho) operadorMult = "×";
              
              html += operadorMult;
              if (mostrar == "elemento") {
                if (this.matriz[l][c] < 0 && (l + c) > 2) html += `(${this.matriz[l][c]})`;
                
                else html += this.matriz[l][c]; 
              }
              if (mostrar == "posicao")
                html += `a<sub>${l}${c}</sub>`;
              html += operadorMult;
            }
          }
        }
        if (i == campoDestacado) html += `</span>`;

      }

      html += operadorSoma;

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

    this.diagonal = this.calcularDiagonal(matriz);
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
    html += `<strong>Multiplique</strong> os elementos destacados, em seguida, multiplique por <strong>-1</strong>.<br>`;

    let calc = this.gerarCalculo("posicao", this.etapa);
    html += `<strong>${calc}</strong>`;
    html += "<br>";

    calc = this.gerarCalculo("elemento", this.etapa);
    html += `<strong>${calc}</strong>`;
    html += "<br>";

    calc = this.gerarCalculo("resultado", this.etapa);
    html += `<strong>${calc}</strong>`;
    html += "<br>";

    html += `</p>`;

    return html;
  }

  gerarCalculo(mostrar, campoDestacado) {
    
    let html = "";

    for (let i = 1; i <= this.tamanho; ++i) {

      //Verifica necessidade de sinal "+"
      let operadorSoma = "";
      if (i > 1 && i < this.tamanho) operadorSoma = " + ";
      html += operadorSoma;

      if (mostrar == "resultado") {

        if (i == campoDestacado) {
          if (this.diagonal[i] < 0 && i > 1) 
            html += `<span class="badge badge-secondary">(${this.diagonal[i]})</span>`;
          else
            html += `<span class="badge badge-secondary">${this.diagonal[i]}</span>`;
        } else {
          if (this.diagonal[i] < 0 && i > 1) 
            html += `(${this.diagonal[i]})`;
          else
            html += this.diagonal[i];
        }
      } else { 
        if (i == campoDestacado)  
          html += `<span class="badge badge-secondary">`;

        if (i > 1) html += "(-1)×";
        else html += "-1×";

        for (let l = 1; l <= this.tamanho; ++l) {
          for (let c = 1; c <= this.tamanho + 2; ++c) {
            if (l + c == 3 + i) {
              
              let operadorMult = "";
              if (l > 1 && l < this.tamanho) operadorMult = "×";
              
              html += operadorMult;
              if (mostrar == "elemento") {
                if (this.matriz[l][c] < 0 && (l + c) > 2) html += `(${this.matriz[l][c]})`;
                else html += this.matriz[l][c]; 
              }
              if (mostrar == "posicao")
                html += `a<sub>${l}${c}</sub>`;
              html += operadorMult;
            }
          }
        }
        if (i == campoDestacado) html += `</span>`;
      }

      html += operadorSoma;

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

    this.diagPricipal = new Estagio2(this.tamanho, this.matriz, 1);
    this.diagSecundaria = new Estagio3(this.tamanho, this.matriz, 1);
  }

  retornarStatus() {
    return [4,6];
  }

  calcularResultado() {
    let r1 = this.diagPricipal.calcularDiagonal();
    let r2 = this.diagSecundaria.calcularDiagonal();

    let soma = 0;
    for (let i = 1; i <= 6; ++i) {
      if (i <= 3) soma += r1[i];
      else soma += r2[i-3];
    }

    return soma;
  }

  gerarEnunciado() {
  
    let resultado = this.calcularResultado();

    let html = `<p class="lead">`;
    html += `Some os produtos das multiplicações anteriores.<br>`;

    let calc1, calc2;

    //Mostrar destacadamente as posições que serão multiplicadas, como a11xa22xa13...
    if (this.etapa <= 3) {
      calc1 = this.diagPricipal.gerarCalculo("posicao", this.etapa);
      calc2 = this.diagSecundaria.gerarCalculo("posicao");
    } else {
      calc1 = this.diagPricipal.gerarCalculo("posicao");
      calc2 = this.diagSecundaria.gerarCalculo("posicao", this.etapa - 3);
    }
    html += `<strong>${calc1} ${calc2}<br></strong>`;

    //Mostrar destacadamente os elementos que serão multiplicadas, como 1x2x3...
    if (this.etapa <= 3) {
      calc1 = this.diagPricipal.gerarCalculo("elemento", this.etapa);
      calc2 = this.diagSecundaria.gerarCalculo("elemento");
    } else {
      calc1 = this.diagPricipal.gerarCalculo("elemento");
      calc2 = this.diagSecundaria.gerarCalculo("elemento", this.etapa - 3);
    }
    html += `<strong>${calc1} ${calc2}<br></strong>`;

    //Mostrar destacadamente os resultados das multiplicações, como 6 + 6 + 6....
    if (this.etapa <= 3) {
      calc1 = this.diagPricipal.gerarCalculo("resultado", this.etapa);
      calc2 = this.diagSecundaria.gerarCalculo("resultado");
    } else {
      calc1 = this.diagPricipal.gerarCalculo("resultado");
      calc2 = this.diagSecundaria.gerarCalculo("resultado", this.etapa - 3);
    }
    html += `<strong>${calc1} ${calc2}<br></strong>`;

    html += `Por fim, o número determinante dessa matriz é <strong>${resultado}</strong>`;
    return html;
  }

  gerarMatriz() {

    if (this.etapa <= 3) {
      this.diagPricipal.etapa = this.etapa;
    } else {
      this.diagSecundaria.etapa = this.etapa - 3;
    }

    if (this.etapa <= 3) return this.diagPricipal.gerarMatriz();
    return this.diagSecundaria.gerarMatriz();
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
    this.obj = new Estagio1(1);
    this.atualizarResultado();
  }
}

$(function() {
  let op = new OperacaoDeterminante();
  op.instalarControles();
});
