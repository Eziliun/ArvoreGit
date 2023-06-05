const readline = require('readline');

const programa = {
  vetores: {},
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let exibiuBoasVindas = false;

function criarBranch() {
  rl.question("Qual o valor da Branch?", (valor) => {
    const vetor = [];
    programa.vetores[valor] = { valor: valor, vetor: vetor };

    console.log(`Nova Branch criada com valor "${valor}".`);
    executarPrograma();
  });
}

function fazerCommit() {
  rl.question("Qual o valor atual da Branch a ser alterado?", (valorAtual) => {
    if (programa.vetores[valorAtual]) {
      rl.question("Qual o novo valor para a Branch?", (novoValor) => {
        const branch = programa.vetores[valorAtual];
        delete programa.vetores[valorAtual];
        branch.valor = novoValor;
        programa.vetores[novoValor] = branch;

        console.log(`Valor da Branch "${valorAtual}" alterado para "${novoValor}".`);
        executarPrograma();
      });
    } else {
      console.log(`Branch com valor "${valorAtual}" não encontrado.`);
      executarPrograma();
    }
  });
}

function fazerMerge() {
  rl.question("Qual o valor da primeira Branch?", (valor1) => {
    rl.question("Qual o valor da segunda Branch?", (valor2) => {
      if (programa.vetores[valor1] && programa.vetores[valor2]) {
        const vetor1 = programa.vetores[valor1].vetor;
        const vetor2 = programa.vetores[valor2].vetor;

        vetor1.push(...vetor2);

        const valorMultiplicado = programa.vetores[valor1].valor * programa.vetores[valor2].valor;
        console.log(`Branchs Mescladas! ${valor1} * ${valor2} = ${valorMultiplicado}`);

        executarPrograma();
      } else {
        console.log(`Branch com valor "${valor1}" ou "${valor2}" não encontrado.`);
        executarPrograma();
      }
    });
  });
}

function exibirBranchs() {
  const branchs = Object.values(programa.vetores);
  console.log("Branchs criadas:");
  branchs.forEach((branch) => {
    console.log(`- ${branch.valor}`);
  });
  executarPrograma();
}

function encerrarPrograma() {
  console.log("Obrigado por usar o programa de Arvores! Até a próxima.");
  rl.close();
}

function executarPrograma() {
  if (!exibiuBoasVindas) {
    console.log("Bem-vindo ao programa de Arvores!");
    exibiuBoasVindas = true;
  }

  rl.question('Digite um comando ("Branch", "Commit", "Merge", "Exibir") ou "Sair" para encerrar:', (comando) => {
    switch (comando.toLowerCase()) {
      case "branch":
        criarBranch();
        break;
      case "commit":
        fazerCommit();
        break;
      case "merge":
        fazerMerge();
        break;
      case "exibir":
        exibirBranchs();
        break;
      case "sair":
        encerrarPrograma();
        break;
      default:
        console.log("Comando inválido.");
        executarPrograma();
    }
  });
}

executarPrograma();
