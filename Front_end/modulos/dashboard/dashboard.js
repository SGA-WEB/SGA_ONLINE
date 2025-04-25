// DashBoard:
import buscarDados from "../../scripts/buscarDados.js";
import { click_btn_menu, btnMenuLateral } from "../../scripts/javaScript.js";
let local_click_btn_menu = click_btn_menu
export default async function dashBorad () {
  /*
    Autor: matheushnunes;

    Função para criar os gráficos de entrada, saída e diferença de produtos no dashboard;
    Os gráficos são criados com a biblioteca Chart.js;

    Funcionalidades e funções:
    - Criar graficos de distribuição de produtos no estoque, contatos, entrada, saída e diferença;
    - atualizarGraficos(): Atualiza os gráficos de acordo com o tamanho da tela;
    - fecharMenu(): Fecha o menu lateral quando a tela for menor que 480px;
    - Select2(): Estiliza os selects do HTML e altera o tipo do gráfico de acordo com o valor selecionado;
  */

  let cinza1 = "#F6F6F6";
  let cinza2 = "#E8E8E8";
  let azul = "#3964A8";
  let azul1 = "#9CBBED";
  let azul_1 = "#E9F0FF";
  let vermelho = 'rgba(255, 0, 0, 0.15)';

  let dadosProduto = await buscarDados('produto').then((e)=>{ // Pega os dados do servidor
    return e
  })
  let dadosCentroEstoque = await buscarDados('centro_estoque').then((e)=>{ // Pega os dados do servidor
    return e
  })

  // Dados dos gráficos:
  console.log(dadosProduto)
  console.log(dadosCentroEstoque)
  let precoAtacado = 0
  let precoVarejo = 0
  let qtdeTotal = 0
  let dado_entrada = [4,12,15,8]
  let dado_saida = [2,16,4,9]
  let dado_diferenca = []
  let produtos_centro_estoque = [] // Array com todos os centros de estoque e seus respectivos produtos
  
  dadosProduto.forEach(e=>{ // Pega a quantidade total de produtos
    qtdeTotal += e.quantidade
    precoAtacado += Number(e.preco_atacado)
    precoVarejo += Number(e.preco_varejo)
  })

  dadosCentroEstoque.forEach(e => {
    // Cria um objeto para cada centro de estoque e adiciona os seus respectivos produtos
    let centro_estoque = {
      id_centro_estoque: e.id_centro_estoque,
      nome_centro_estoque: e.nome_centro_estoque,
    }
    let produtos = [] // Cria um array vazio para os produtos do centro de estoque
    dadosProduto.forEach(e => { // Pega os dados do servidor
      if (e.fk_id_centro_estoque == centro_estoque.id_centro_estoque) { // Se o id do centro de estoque for igual ao id do produto
       produtos.push(e) // Adiciona o produto ao array de produtos
      }
    })
    centro_estoque.produtos = produtos // Adiciona o array de produtos ao objeto centro_estoque
    let porcentagem = produtos.length / qtdeTotal * 10000// Calcula a porcentagem de produtos do centro de estoque
    produtos_centro_estoque.push(centro_estoque)

    let card = document.createElement("div") // Cria o card
    card.classList.add("card_info_porcetagem") // Adiciona a classe card

    let container_porcentagem_estoque = document.createElement("div") // Cria o container da porcentagem
    container_porcentagem_estoque.classList.add("container_porcentagem_estoque") // Adiciona a classe container_porcentagem_estoque

    let porcentagem_estoque = document.createElement("span") // Cria a porcentagem
    porcentagem_estoque.classList.add("porcentagem_estoque") // Adiciona a classe porcentagem_estoque
    porcentagem_estoque.textContent = porcentagem.toFixed(1) + "%" // Adiciona a porcentagem ao card

    let quantidade_card = document.createElement("span") // Cria a quantidade do card
    quantidade_card.classList.add("quantidade_card") // Adiciona a classe quantidade_card
    
    let pEstoque = document.createElement("p") // Cria o p da porcentagem
    pEstoque.textContent = e.nome_centro_estoque // Adiciona o nome do centro de estoque

    card.appendChild(container_porcentagem_estoque) // Adiciona o container ao card
    container_porcentagem_estoque.appendChild(porcentagem_estoque)
    container_porcentagem_estoque.appendChild(pEstoque) // Adiciona a quantidade ao container
    card.appendChild(quantidade_card) // Adiciona a quantidade ao card

    document.querySelector(".container_card_info_porcetagem").appendChild(card)
  })

  console.log(produtos_centro_estoque) // Mostra os produtos do centro de estoque no console

  
  // Inserir dados nos gráficos:

  document.querySelector(".quantidade_produtos").textContent = qtdeTotal // Insere a quantidade de produtos no dashboard
  document.querySelector("#valor_total_atacado").textContent = `R$ ${precoAtacado.toFixed(2).replace('.',',')}` // Insere o valor total de atacado no dashboard
  document.querySelector("#valor_total_varejo").textContent = `R$ ${precoVarejo.toFixed(2).replace('.',',')}` // Insere o valor total de varejo no dashboard 
  
  // Gráfico de distribuição de produtos em estoque:
  function criarGraficoDistribuicaoProdutosEstoque() {
    const c_gfc_distribuicao_produtos_estoque= document.getElementById('grafico_distribuicao_produtos_estoque').getContext('2d');
    const gfc_distribuicao_produtos_estoque= new Chart(c_gfc_distribuicao_produtos_estoque, {
      type: 'doughnut', // Gráfico de linha (que pode ser usado para gráficos de área)
      data: {
        datasets: [{
          label: 'My First Dataset',
          data: [1235, 884, 420],
          backgroundColor: [
            azul,
            azul1,
            azul_1
          ],
          hoverOffset: 4
        }]
      },
      options: {
        cutout: '70%',  // Controla o tamanho do buraco central
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                enabled: true
            }
        },
        // Configuração para o texto central
        animation: {
          onComplete: function(animation) {
            const ctx = this.ctx;
            const width = this.width;
            const height = this.height;
            
            // Configurações para o texto superior
            ctx.font = 'bold 1rem Arial';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Texto superior "Qtde. Total"
            const textTop = 'Qtde. Total';
            const textTopY = height / 2 - 15; // 15px acima do centro
            ctx.fillText(textTop, width / 2, textTopY);
            
            // Configurações para o texto inferior (valor)
            ctx.font = 'bold 1.4rem Arial';
            
            // Texto inferior "94"
            const textBottom = qtdeTotal; // Quantidade total de produtos
            const textBottomY = height / 2 + 15; // 15px abaixo do centro
            ctx.fillText(textBottom, width / 2, textBottomY);
          }
        }
      }
    });  
  }
  criarGraficoDistribuicaoProdutosEstoque() // Cria o gráfico de distribuição de produtos em estoque quando a página é carregada

  function criarGraficoContatos() {
    const c_gfc_distribuicao_produtos_estoque= document.getElementById('grafico_contatos').getContext('2d');
    const gfc_distribuicao_produtos_estoque= new Chart(c_gfc_distribuicao_produtos_estoque, {
      type: 'doughnut', // Gráfico de linha (que pode ser usado para gráficos de área)
      data: {
        datasets: [{
          label: 'My First Dataset',
          data: [52, 37, 14],
          backgroundColor: [
            azul,
            azul1,
            azul_1
          ],
          hoverOffset: 4
        }]
      },
      options: {
        cutout: '70%',  // Controla o tamanho do buraco central
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                enabled: true
            }
        },
        // Configuração para o texto central
        animation: {
          onComplete: function(animation) {
            const ctx = this.ctx;
            const width = this.width;
            const height = this.height;
            
            // Configurações para o texto superior
            ctx.font = 'bold 1rem Arial';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Texto superior "Qtde. Total"
            const textTop = 'Qtde. Total';
            const textTopY = height / 2 - 15; // 15px acima do centro
            ctx.fillText(textTop, width / 2, textTopY);
            
            // Configurações para o texto inferior (valor)
            ctx.font = 'bold 1.4rem Arial';
            
            // Texto inferior "94"
            const textBottom = '94';
            const textBottomY = height / 2 + 15; // 15px abaixo do centro
            ctx.fillText(textBottom, width / 2, textBottomY);
          }
        }
      }
    }); 
  }
  criarGraficoContatos()

  // Gráfico Entrada de produtos:
  let gfc_entrada
  function criarGraficoEntrada(tipo, font) {
    const c_gfc_entrada= document.getElementById('grafico_entrada_produtos').getContext('2d');
    if (gfc_entrada) {
      gfc_entrada.destroy()
    }
    gfc_entrada= new Chart(c_gfc_entrada, {
      type: tipo, // Gráfico de linha (que pode ser usado para gráficos de área)
      data: {
        labels: ['2020', '2021', '2022', '2023'], // Anos no eixo X
        datasets: [{
          label: 'Entradas', // Legenda
          data: dado_entrada, // Valores no eixo Y
          fill: true, // Preencher a área abaixo da linha
          backgroundColor: azul_1, // Cor de fundo (azul claro)
          borderColor: azul, // Cor da linha
          tension: 0.1 // Suavizar a curva da linha
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Ano', // Rótulo do eixo X
              font: {
                size: font
              }
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Entradas', // Rótulo do eixo Y
              font: {
                size: font
              }
            }
          },
        },
        plugins: {
          legend: {
            display: false // Ocultar a legenda
          }
        }
      }
    });
  }
  criarGraficoEntrada('line') // Cria o primeiro gráfico quando a página é carregada
  
  // Gráfico Saída de produtos:
  let gfc_saida
  function criarGraficoSaida(tipo, font) {
    const c_gfc_saida = document.getElementById('grafico_saida_produtos').getContext('2d');
    if (gfc_saida) { // Se o gráfico ja exister ele é destruido para poder ser criado outro
      gfc_saida.destroy()
    }
    gfc_saida = new Chart(c_gfc_saida, {
      type: tipo, // Gráfico de linha (que pode ser usado para gráficos de área)
      data: {
        labels: ['2020', '2021', '2022', '2023'], // Anos no eixo X
        datasets: [{
          label: 'Saídas', // Legenda
          data: dado_saida, // Valores no eixo Y
          fill: true, // Preencher a área abaixo da linha
          backgroundColor: azul_1, // Cor de fundo (azul claro)
          borderColor: azul, // Cor da linha
          tension: 0.1 // Suavizar a curva da linha
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Ano', // Rótulo do eixo X
              font: {
                size: font
              }
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Saídas', // Rótulo do eixo Y
              font: {
                size: font
              }
            }
          },
        },
        plugins: {
          legend: {
            display: false // Ocultar a legenda
          }
        }
      }
    });
  }
  criarGraficoSaida('line')
  
  // Gráfico Diferença entre Entrada e Saída de produtos:
  let gfc_diferenca
  function criarGraficoDiferenca(tipo, font){
    const c_gfc_diferenca = document.getElementById('grafico_diferenca_produtos').getContext('2d');
    if (gfc_diferenca) {
      gfc_diferenca.destroy()
    }
    gfc_diferenca = new Chart(c_gfc_diferenca, {
      type: tipo,
      data: {
        labels: ['2020', '2021', '2022', '2023'], // Anos no eixo X
        datasets: [{
          label: 'Entradas - Saídas',
          data: dado_diferenca, // Valores no eixo Y
          fill: {
            target: {
              value: 0 // Define o valor de referência (eixo Y = 0)
            },
            above: '#e9f0ff73', // Preenchimento azul claro acima de 0
            below: vermelho // Preenchimento vermelho claro abaixo de 0
          },
          backgroundColor: function(context) {
            const value = context.dataset.data[context.dataIndex];
            // Se o valor é negativo, retorna vermelho, senão retorna azul
            return value < 0 ? vermelho : azul_1;
          },
          borderColor: azul, // Cor da linha (azul)
          tension: 0.1 // Suaviza a curva da linha
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Ano',
              font: {
                size: font
              }
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Fluxo total',
              font: {
                size: font
              }
            }
          },
        },
        plugins: {
          legend: {
            display: false // Ocultar a legenda
          }
        }
      }
    });
  }
  criarGraficoDiferenca('line')

  // Alterar gráficos e fechar menu quando o body for menor que 480px:
  function atualizarGraficos(graficos, width) {
    graficos.forEach(grafico => { // Muda o tamanho da fonte dos gráficos
      grafico.options.scales.x.title.font.size = fontSize;
      grafico.options.scales.y.title.font.size = fontSize;
      grafico.update(); // Atualiza o gráfico com as alterações
    });
  
    if (width <= 300) { // Retira e adiciona o texto produto e ano dos gráficos
      graficos.forEach(e=>{
        e.options.scales.x.title.display = false
        e.options.scales.y.title.display = false
      })
    }
    else {
      graficos.forEach(e=>{
        e.options.scales.x.title.display = true
        e.options.scales.y.title.display = true
      })
    }
  }
  
  let fontSize = 16
  function fecharMenu(){
    let widthGrafico = document.querySelector(".graficos").offsetWidth
    if (widthGrafico <= 480){
      let nav = document.querySelector("#menu_lateral")
      fontSize = 12
      if (!nav.classList.contains("mini") && !local_click_btn_menu)
        btnMenuLateral()
    } else {
      local_click_btn_menu = false
      fontSize = 16
    }
    atualizarGraficos([gfc_entrada, gfc_saida, gfc_diferenca], widthGrafico); // Adicione todos os gráficos aqui
  }
  fecharMenu()
  
  
  window.addEventListener('resize',(e)=>{
    if (document.querySelector(".graficos") !== null) { // So vai chamar a função se estiver na tela de dashboard
      fecharMenu()
    }
  })
  
  // Alterar tipo do gráfico: 

  $('.tipo_grafico').select2({ // Inicia o select2
    placeholder: 'Selecione a coluna',
    width: '80px',
    minimumResultsForSearch: Infinity,
  });
  
  $('.tipo_grafico').on('change', function() { // Quando o select for alterado
    let tipoGrafico = this.id // Pega o id do select
    let tipo = this.value // Pega o valor selecionado no select
    switch (tipoGrafico) {
      case "tipo_grafico_entrada":
        criarGraficoEntrada(tipo, fontSize)
        break;
      case "tipo_grafico_saida":
        criarGraficoSaida(tipo, fontSize)
        break;
      case "tipo_grafico_diferenca":
        criarGraficoDiferenca(tipo, fontSize)
        break;
    }
  })
 
}