const readline = require('readline');
const crypto = require('crypto');

const programa = {
  vetores: {},
  comandos: {},
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

    const hash = calcularHash(valor).substring(0, 6);
    programa.vetores[valor].hash = hash;
    programa.comandos[hash] = "Branch";

    console.log(`Nova Branch criada com valor "${valor}". Hash: ${hash}`);
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

        const hash = calcularHash(novoValor).substring(0, 6);
        branch.hash = hash;
        programa.comandos[hash] = "Commit";

        programa.vetores[novoValor] = branch;

        console.log(`Valor da Branch "${valorAtual}" alterado para "${novoValor}". Hash: ${hash}`);
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

        const hash = calcularHash(valorMultiplicado.toString()).substring(0, 6);
        programa.vetores[valor1].hash = hash;
        programa.comandos[hash] = "Merge";

        console.log(`Branchs Mescladas! ${valor1} * ${valor2} = ${valorMultiplicado}. Hash: ${hash}`);

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
    console.log(`- ${branch.valor}. Hash: ${branch.hash}`);
  });
  executarPrograma();
}

function exibirHashes() {
  const hashes = Object.values(programa.vetores).map((branch) => branch.hash);
  console.log("Hashes gerados:");
  hashes.forEach((hash) => {
    console.log(`- ${hash} - Comando: ${programa.comandos[hash]}`);
  });
  executarPrograma();
}

function mostrarTudo() {
  console.log("Histórico de Hashes e Comandos:");
  for (const hash in programa.comandos) {
    console.log(`- Hash: ${hash} - Comando: ${programa.comandos[hash]}`);
  }
  executarPrograma();
}

function pesquisarHash() {
  rl.question("Digite o código da Hash que deseja pesquisar: ", (codigoHash) => {
    let encontrada = false;
    console.log("Histórico de Hashes:");
    for (const branch in programa.vetores) {
      const hash = programa.vetores[branch].hash;
      const comando = programa.comandos[hash];
      if (hash === codigoHash) {
        console.log(`-> Hash: ${hash} - Comando: ${comando}`);
        encontrada = true;
      } else {
        console.log(`   Hash: ${hash} - Comando: ${comando}`);
      }
    }
    if (!encontrada) {
      console.log("Hash não encontrada.");
    }
    executarPrograma();
  });
}

function encerrarPrograma() {
  console.log("Obrigado por usar o programa de Árvores! Até a próxima.");
  rl.close();
}

function executarPrograma() {
  if (!exibiuBoasVindas) {
    console.log("Bem-vindo ao programa de Árvores!");
    exibiuBoasVindas = true;
  }

  rl.question('Digite um comando ("Branch", "Commit", "Merge", "Exibir", "Hashes", "MostrarTudo", "PesquisarHash") ou "Sair" para encerrar:', (comando) => {
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
      case "hashes":
        exibirHashes();
        break;
      case "mostrartudo":
        mostrarTudo();
        break;
      case "pesquisarhash":
        pesquisarHash();
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

// Função para calcular o hash de uma string
function calcularHash(dados) {
  const hash = crypto.createHash('sha256');
  hash.update(dados);
  return hash.digest('hex');
}
