// DashBoard:
import { click_btn_menu, btnMenuLateral } from "../../scripts/javaScript.js";
let local_click_btn_menu = click_btn_menu
export default function dashBorad () {
  /*
    Autor: matheushnunes;

    Função para criar os gráficos de entrada, saída e diferença de produtos no dashboard;
    Os gráficos são criados com a biblioteca Chart.js;

    Funcionalidades e funções:
    - Criar graficos de entrada, saída e diferença;
    - atualizarGraficos(): Atualiza os gráficos de acordo com o tamanho da tela;
    - fecharMenu(): Fecha o menu lateral quando a tela for menor que 480px;
    - Select2(): Estiliza os selects do HTML e altera o tipo do gráfico de acordo com o valor selecionado;
  */

  let cinza1 = "#F6F6F6";
  let cinza2 = "#E8E8E8";
  let azul = "#3964A8";
  let azul1 = "#9CBBED50";
  let azul_1 = "#E9F0FF";
  let vermelho = 'rgba(255, 0, 0, 0.15)';

  // Dados dos gráficos:
  let dado_entrada = [4,12,15,8]
  let dado_saida = [2,16,4,9]
  let dado_diferenca = []
  dado_entrada.forEach((e,i) => { // Entrada - Saída
    dado_diferenca.push(e - dado_saida[i])
  }) 
  
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
          backgroundColor: azul1, // Cor de fundo (azul claro)
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
          backgroundColor: azul1, // Cor de fundo (azul claro)
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
            return value < 0 ? vermelho : azul1;
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

  // Responsividade do gráfico:
  const pai = document.querySelector('.filtro_grafico');
  const filho = document.querySelectorAll('.filtro');
  
  const observer = new ResizeObserver(entries => {
    entries.forEach(entry => {
      filho.forEach(e=>{
          if (entry.contentRect.width > 445) {
              e.style.justifyContent = 'center';
              e.style.width = "min-content"
          } else {
              e.style.width = "100%"
              e.style.justifyContent = 'space-between';
          }
      })
      
    });
  });
  
  observer.observe(pai);  
  
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