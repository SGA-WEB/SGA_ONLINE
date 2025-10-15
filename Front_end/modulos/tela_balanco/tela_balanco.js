import buscarDados from "../../scripts/buscarDados.js";
import { popup_carregando } from "../../scripts/popup.js";
import produto from "../produto/produto.js";

export default async function tela_balanco() {
  let cinza1 = "#F6F6F6";
  let cinza2 = "#E8E8E8";
  let azul = "#3964A8";
  let azul1 = "#9CBBED";
  let azul_1 = "#E9F0FF";
  let vermelho = "rgba(255, 0, 0, 0.15)";

  let dadosProduto = await buscarDados("produto").then((e) => {
    // Pega os dados do servidor
    return e;
  });
  let dadosCentroEstoque = await buscarDados("centro_estoque").then((e) => {
    // Pega os dados do servidor
    return e;
  });
  let dadosContatos = await buscarDados("contato").then((e) => {
    // Pega os dados do servidor
    return e;
  });
  let filtro_data_inicio = document.querySelector("#filtro_data_inicio");

  filtro_data_inicio.addEventListener("change", (e) => {
    const dataSelecionada = new Date(e.target.value);

    // Filtra os dados com base na data_cadastro
    const dadosFiltrados = dadosProduto.filter((item) => {
      const dataCadastro = new Date(item.data_cadastro); 
      return dataCadastro >= dataSelecionada;
    });

    console.log(dadosFiltrados);
  });

  let filtro_data_final = document.querySelector("#filtro_data_inicio");

  filtro_data_final.addEventListener("change", (e) => {
    const dataSelecionada = new Date(e.target.value);

    // Filtra os dados com base na data_cadastro
    const dadosFiltrados = dadosProduto.filter((item) => {
      const dataCadastro = new Date(item.data_cadastro); 
      return dataCadastro <= dataSelecionada;
    });

    console.log(dadosFiltrados);
  });

  // Dados dos gráficos:
  let precoAtacado = 0;
  let precoVarejo = 0;
  let qtdeTotal = 0;
  let dado_entrada = [4, 12, 15, 8];
  let dado_saida = [2, 16, 4, 9];
  let dado_diferenca = dado_entrada.map(
    (valor, indice) => valor - dado_saida[indice]
  );
  let produtos_centro_estoque = []; // Array com todos os centros de estoque e seus respectivos produtos
  let produtosEmFalta = [];
  let produtosComMaiorQuantidade = [];

  dadosProduto.forEach((e) => {
    qtdeTotal += e.quantidade; // Pega a quantidade total de produtos
    precoAtacado += Number(e.preco_atacado) * e.quantidade; // Pega o preço de atacado total
    precoVarejo += Number(e.preco_varejo) * e.quantidade; // Pega o preço de varejo total
    if (e.quantidade <= 30) {
      produtosEmFalta.push(e);
    }
  });

  // Inserir dados nos gráficos:

  dadosCentroEstoque.forEach((e) => {
    // Cria um objeto para cada centro de estoque e adiciona os seus respectivos produtos:
    let centro_estoque = {
      id_centro_estoque: e.id_centro_estoque,
      nome_centro_estoque: e.nome_centro_estoque,
    };
    let produtos = []; // Cria um array vazio para os produtos do centro de estoque
    let qtdeTotalProdutos = 0;
    let valorTotalVarejo = 0;
    let valorTotalAtacado = 0;
    dadosProduto.forEach((e) => {
      if (e.fk_id_centro_estoque == centro_estoque.id_centro_estoque) {
        // Se o id do centro de estoque for igual ao id do produto
        qtdeTotalProdutos += e.quantidade;
        valorTotalVarejo += Number(e.preco_varejo) * e.quantidade; // Pega o preço de varejo total
        valorTotalAtacado += Number(e.preco_atacado) * e.quantidade; // Pega o preço de atacado total
        produtos.push(e); // Adiciona o produto ao array de produtos
      }
    });
    centro_estoque.qtdeTotalProdutos = qtdeTotalProdutos;
    centro_estoque.valorTotalVarejo = valorTotalVarejo;
    centro_estoque.valorTotalAtacado = valorTotalAtacado;
    centro_estoque.produtos = produtos; // Adiciona o array de produtos ao objeto centro_estoque
    produtos_centro_estoque.push(centro_estoque);

    // Cria os cards de informações para cada centro de estoque:
    let porcentagem = (qtdeTotalProdutos * 100) / qtdeTotal;

    let card = document.createElement("div"); // Cria o card
    card.classList.add("card_info_porcentagem");
    card.classList.add("card_contato");

    let container_porcentagem_estoque = document.createElement("div"); // Cria o container da porcentagem
    container_porcentagem_estoque.classList.add(
      "container_porcentagem_estoque"
    ); // Adiciona a classe container_porcentagem_estoque

    let porcentagem_estoque = document.createElement("span"); // Cria a porcentagem
    porcentagem_estoque.classList.add("porcentagem_estoque"); // Adiciona a classe porcentagem_estoque
    porcentagem_estoque.textContent = porcentagem.toFixed(1) + "%"; // Adiciona a porcentagem ao card

    let quantidade_card = document.createElement("span"); // Cria a quantidade do card
    quantidade_card.classList.add("quantidade_card"); // Adiciona a classe quantidade_card
    quantidade_card.textContent = centro_estoque.qtdeTotalProdutos;

    let pEstoque = document.createElement("p"); // Cria o p da porcentagem
    pEstoque.textContent = e.nome_centro_estoque; // Adiciona o nome do centro de estoque

    card.appendChild(container_porcentagem_estoque); // Adiciona o container ao card
    container_porcentagem_estoque.appendChild(porcentagem_estoque);
    container_porcentagem_estoque.appendChild(pEstoque); // Adiciona a quantidade ao container
    card.appendChild(quantidade_card); // Adiciona a quantidade ao card

    document
      .querySelector(".container_card_info_porcentagem")
      .appendChild(card);

    // Cria o item do dashboard com as informações do centro de estoque:

    let porcentagemValorEstoque =
      (centro_estoque.valorTotalVarejo * 100) / precoVarejo; // Pega a porcentagem do centro de estoque

    let container_info_valor_estoque = document.createElement("div"); // Cria o container da porcentagem
    container_info_valor_estoque.classList.add("container_info_valor_estoque"); // Adiciona a classe container_porcentagem_estoque

    let pNomeEstoque = document.createElement("p"); // Cria o p da porcentagem
    pNomeEstoque.textContent = e.nome_centro_estoque; // Adiciona o nome do centro de estoque

    let container_barra_valor_estoque = document.createElement("div"); // Cria o container da porcentagem
    container_barra_valor_estoque.classList.add(
      "container_barra_valor_estoque"
    ); // Adiciona a classe container_porcentagem_estoque

    let spanValorEstoque = document.createElement("span"); // Cria a porcentagem
    spanValorEstoque.classList.add("valor_estoque"); // Adiciona a classe porcentagem_estoque
    spanValorEstoque.textContent = `R$ ${centro_estoque.valorTotalVarejo
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      .replace(/\.(?=[^.]*$)/g, ",")}`; // Adiciona a porcentagem ao card

    let barra_estoque = document.createElement("div"); // Cria a porcentagem
    barra_estoque.classList.add("barra_estoque"); // Adiciona a classe porcentagem_estoque

    let barra_valor_estoque = document.createElement("div"); // Cria a porcentagem
    barra_valor_estoque.classList.add("barra_valor_estoque"); // Adiciona a classe porcentagem_estoque
    barra_valor_estoque.style.width = `${porcentagemValorEstoque}%`; // Adiciona a porcentagem ao card

    container_info_valor_estoque.appendChild(pNomeEstoque); // Adiciona o container ao card
    container_info_valor_estoque.appendChild(container_barra_valor_estoque);

    container_barra_valor_estoque.appendChild(spanValorEstoque);
    container_barra_valor_estoque.appendChild(barra_estoque); // Adiciona a quantidade ao container

    barra_estoque.appendChild(barra_valor_estoque); // Adiciona a quantidade ao card

    document
      .querySelector(".container_info_valores_estoques")
      .appendChild(container_info_valor_estoque); // Adiciona o card ao container de valores
  });

  // Ordena os cards dos centros de estoque pela porcentagem de estoque:
  let cards = document.querySelectorAll(".card_contato");
  cards = Array.from(cards).sort((a, b) => {
    let porcentagemA = parseFloat(
      a.querySelector(".porcentagem_estoque").textContent.replace("%", "")
    );
    let porcentagemB = parseFloat(
      b.querySelector(".porcentagem_estoque").textContent.replace("%", "")
    );
    return porcentagemB - porcentagemA;
  });

  let barasValores = document.querySelectorAll(".container_info_valor_estoque");
  barasValores = Array.from(barasValores).sort((a, b) => {
    let porcentagemA = parseFloat(
      a
        .querySelector(".valor_estoque")
        .textContent.replace("R$ ", "")
        .replace(/\./g, "")
        .replace(",", ".")
    );
    let porcentagemB = parseFloat(
      b
        .querySelector(".valor_estoque")
        .textContent.replace("R$ ", "")
        .replace(/\./g, "")
        .replace(",", ".")
    );
    return porcentagemB - porcentagemA;
  });

  let cor = 44; // brilho padrão do azul dos cards
  cards.forEach((card) => {
    // insere os cards dos centros de estoque ordenados pela porcentagem de estoque
    // E adicina a cor ao card
    let novaCor = `hsl(217, 49%, ${cor}%)`; // Cria uma nova cor para o gráfico
    let aumentarBrilho = 44 / (dadosCentroEstoque.length - 1);
    cor = cor + aumentarBrilho;
    card.style.borderLeft = `10px solid ${novaCor}`; // Adiciona a cor ao card
    document
      .querySelector("#container_card_info_porcentagem_distribuicao")
      .appendChild(card);

    produtos_centro_estoque.forEach((e) => {
      if (e.nome_centro_estoque == card.querySelector("p").textContent) {
        // Se o nome do centro de estoque for igual ao nome do card
        e.cor = novaCor; // Adiciona a cor ao objeto centro_estoque
      }
    });
  });

  // Insere na tela os cards de valores dos centros de estoque ordenados:
  barasValores.forEach((barra) => {
    document
      .querySelector(".container_info_valores_estoques")
      .appendChild(barra); // Adiciona o card ao container de valores
  });

  // Contatos:
  let cliente = 0;
  let fornecedor = 0;
  let funcionario = 0;
  let totalContatos = 0;

  dadosContatos.forEach((e) => {
    e.categorias.forEach((c) => {
      totalContatos++;
      if (c.nome === "CLIENTE") {
        cliente++;
      }
      if (c.nome === "FORNECEDOR") {
        fornecedor++;
      }
      if (c.nome === "FUNCIONÁRIO") {
        funcionario++;
      }
    });
  });
  let arrContatos = [cliente, fornecedor, funcionario]; // Array com os contatos
  document.querySelector("#quantidade_card_cliente").textContent = cliente; // Insere a quantidade de clientes no dashboard
  document.querySelector("#quantidade_card_funcionario").textContent =
    funcionario;
  document.querySelector("#quantidade_card_fornecedor").textContent =
    fornecedor;

  document.querySelector("#porcentagem_card_cliente").textContent = `${(
    (cliente * 100) /
    totalContatos
  ).toFixed(1)}%`; // Insere a porcentagem de clientes no dashboard
  document.querySelector("#porcentagem_card_funcionario").textContent = `${(
    (funcionario * 100) /
    totalContatos
  ).toFixed(1)}%`; // Insere a porcentagem de funcionarios no dashboard
  document.querySelector("#porcentagem_card_fornecedor").textContent = `${(
    (fornecedor * 100) /
    totalContatos
  ).toFixed(1)}%`; // Insere a porcentagem de fornecedores no dashboard

  let cardClientes = document.querySelectorAll(
    ".card_info_porcentagem_contato"
  );
  cardClientes = Array.from(cardClientes).sort((a, b) => {
    let porcentagemA = parseFloat(
      a.querySelector(".porcentagem_card").textContent.replace("%", "")
    );
    let porcentagemB = parseFloat(
      b.querySelector(".porcentagem_card").textContent.replace("%", "")
    );
    return porcentagemB - porcentagemA;
  });

  cardClientes.forEach((e) => {
    document
      .querySelector("#container_card_info_porcentagem_contatos")
      .appendChild(e);
  });

  // Tabela Produtos com mainor quantidade no estoque:

  const tbodyProdutosMaiorQuantidade = document.querySelector(
    "#tbody_prdutos_maior_quantidade"
  );
  const produtosOrdenados = [...dadosProduto].sort(
    (a, b) => b.quantidade - a.quantidade
  );
  // 2. Selecionar apenas os 4 primeiros itens
  const top4Produtos = produtosOrdenados.slice(0, 4);

  top4Produtos.forEach((produto) => {
    let tr = document.createElement("tr");

    let tdNome = document.createElement("td");
    tdNome.textContent = produto.produto;

    let tdQuantidade = document.createElement("td");
    tdQuantidade.textContent = produto.quantidade;

    tr.appendChild(tdNome);
    tr.appendChild(tdQuantidade);
    tbodyProdutosMaiorQuantidade.appendChild(tr);
  });

  // Gráfico de distribuição de produtos em estoque:
  function criarGraficoDistribuicaoProdutosEstoque() {
    produtos_centro_estoque.sort(
      (a, b) => b.qtdeTotalProdutos - a.qtdeTotalProdutos
    ); // Ordena os produtos do centro de estoque pela quantidade
    const ctx = document
      .getElementById("grafico_distribuicao_produtos_estoque")
      .getContext("2d");
    const myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: produtos_centro_estoque.map((e) => e.nome_centro_estoque),
        datasets: [
          {
            data: produtos_centro_estoque.map((e) => e.qtdeTotalProdutos), // Pega quantidade diretamente do objeto
            backgroundColor: produtos_centro_estoque.map((e) => e.cor),
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false, // Remove as legendas
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.formattedValue}`;
              },
            },
          },
        },
        cutout: "70%",
        animation: {
          onComplete: function () {
            const ctx = this.ctx;
            const centerX = this.width / 2;
            const centerY = this.height / 2;

            // Texto superior
            ctx.font = "bold 16px Arial";
            ctx.fillStyle = "#666";
            ctx.textAlign = "center";
            ctx.fillText("Qtde. Total", centerX, centerY - 15);

            // Texto inferior (soma todas as quantidades)
            const total = produtos_centro_estoque.reduce(
              (sum, item) => sum + item.qtdeTotalProdutos,
              0
            );
            ctx.font = "bold 24px Arial";
            ctx.fillStyle = "#333";
            ctx.fillText(total.toString(), centerX, centerY + 15);
          },
        },
      },
    });
  }
  criarGraficoDistribuicaoProdutosEstoque(); // Cria o gráfico de distribuição de produtos em estoque quando a página é carregada

  function criarGraficoContatos() {
    const ctx = document.getElementById("grafico_contatos").getContext("2d");
    const grafico = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Clientes", "Fornecedores", "Funcionários"],
        datasets: [
          {
            data: arrContatos,
            backgroundColor: [azul_1, azul, azul1],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        cutout: "70%",
        plugins: {
          legend: {
            display: false, // Remove a legenda abaixo do gráfico
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                // Personaliza o texto do tooltip
                const label = context.label || "";
                const value = context.formattedValue || "";
                return `${label}: ${value}`;
              },
            },
          },
        },
        animation: {
          onComplete: function () {
            const ctx = this.ctx;
            const centerX = this.width / 2;
            const centerY = this.height / 2;

            // Texto superior
            ctx.font = "bold 1rem Arial";
            ctx.fillStyle = "#333";
            ctx.textAlign = "center";
            ctx.fillText("Qtde. Total", centerX, centerY - 15);

            // Texto inferior (total)
            ctx.font = "bold 1.4rem Arial";
            ctx.fillText(
              dadosContatos.length.toString(),
              centerX,
              centerY + 15
            );
          },
        },
      },
    });
  }
  criarGraficoContatos();

  // Alterar gráficos e fechar menu quando o body for menor que 480px:
  function atualizarGraficos(graficos, width) {
    graficos.forEach((grafico) => {
      // Muda o tamanho da fonte dos gráficos
      grafico.options.scales.x.title.font.size = fontSize;
      grafico.options.scales.y.title.font.size = fontSize;
      grafico.update(); // Atualiza o gráfico com as alterações
    });

    if (width <= 300) {
      // Retira e adiciona o texto produto e ano dos gráficos
      graficos.forEach((e) => {
        e.options.scales.x.title.display = false;
        e.options.scales.y.title.display = false;
      });
    } else {
      graficos.forEach((e) => {
        e.options.scales.x.title.display = true;
        e.options.scales.y.title.display = true;
      });
    }
  }

  let fontSize = 16;
  // function fecharMenu() {
  //     let widthGrafico = document.querySelector(".graficos").offsetWidth
  //     if (widthGrafico <= 480) {
  //         let nav = document.querySelector("#menu_lateral")
  //         fontSize = 12
  //         if (!nav.classList.contains("mini") && !local_click_btn_menu)
  //             btnMenuLateral()
  //     } else {
  //         local_click_btn_menu = false
  //         fontSize = 16
  //     }
  //     atualizarGraficos([gfc_entrada, gfc_saida, gfc_diferenca], widthGrafico); // Adicione todos os gráficos aqui
  // }
  // fecharMenu()

  // window.addEventListener('resize', (e) => {
  //     if (document.querySelector(".graficos") !== null) { // So vai chamar a função se estiver na tela de dashboard
  //         fecharMenu()
  //     }
  // })

  // Alterar tipo do gráfico:

  $(".tipo_grafico").select2({
    // Inicia o select2
    placeholder: "Selecione a coluna",
    width: "80px",
    minimumResultsForSearch: Infinity,
  });

  $(".tipo_grafico").on("change", function () {
    // Quando o select for alterado
    let tipoGrafico = this.id; // Pega o id do select
    let tipo = this.value; // Pega o valor selecionado no select
    switch (tipoGrafico) {
      case "tipo_grafico_entrada":
        criarGraficoEntrada(tipo, fontSize);
        break;
      case "tipo_grafico_saida":
        criarGraficoSaida(tipo, fontSize);
        break;
      case "tipo_grafico_diferenca":
        criarGraficoDiferenca(tipo, fontSize);
        break;
    }
  });

  popup_carregando(true);
}
