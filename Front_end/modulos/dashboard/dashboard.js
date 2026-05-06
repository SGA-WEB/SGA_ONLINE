// DashBoard:
import buscarDados from "../../scripts/buscarDados.js";
import { click_btn_menu, btnMenuLateral } from "../../scripts/javaScript.js";
import { popup_carregando } from "../../scripts/popup.js";

export default async function dashborad() {
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

    popup_carregando(false, "Carregando informações...")

    let dadosProduto = await buscarDados('produto')
    let dadosCentroEstoque = await buscarDados('centro_estoque')
    let dadosContatos = await buscarDados('contato')
    let dadosTiposSaida = await buscarDados('tipos_de_saida')
    let dadosTiposEntrada = await buscarDados('tipos_entrada')

    // -------------------------------------------------------
    // Agrupa entradas por ano usando data_criacao da API
    // -------------------------------------------------------
    let entradaPorAno = {}
    dadosTiposEntrada.forEach(e => {
        let ano = new Date(e.data_criacao).getFullYear()
        entradaPorAno[ano] = (entradaPorAno[ano] || 0) + 1
    })

    // Agrupa saídas por ano usando data_criacao da API
    let saidaPorAno = {}
    dadosTiposSaida.forEach(e => {
        let ano = new Date(e.data_criacao).getFullYear()
        saidaPorAno[ano] = (saidaPorAno[ano] || 0) + 1
    })

    // Gera os labels (anos únicos ordenados)
    let anosSet = new Set([...Object.keys(entradaPorAno), ...Object.keys(saidaPorAno)])
    let anos = Array.from(anosSet).sort()

    let dado_entrada = anos.map(ano => entradaPorAno[ano] || 0)
    let dado_saida = anos.map(ano => saidaPorAno[ano] || 0)
    let dado_diferenca = dado_entrada.map((v, i) => v - dado_saida[i])
    // -------------------------------------------------------

    // Dados dos gráficos:
    let precoAtacado = 0
    let precoVarejo = 0
    let qtdeTotal = 0
    let produtos_centro_estoque = []
    let produtosEmFalta = []
    let produtosComMaiorQuantidade = []

    dadosProduto.forEach(e => {
        qtdeTotal += e.quantidade
        precoAtacado += Number(e.preco_atacado) * e.quantidade
        precoVarejo += Number(e.preco_varejo) * e.quantidade
        if (e.quantidade <= 30) {
            produtosEmFalta.push(e)
        }
    })

    // Inserir dados nos cards:
    document.querySelector(".quantidade_produtos").textContent = qtdeTotal
    document.querySelector("#valor_total_atacado").textContent = `R$ ${precoAtacado.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.').replace(/\.(?=[^.]*$)/g, ',')}`
    document.querySelector("#valor_total_varejo").textContent = `R$ ${precoVarejo.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.').replace(/\.(?=[^.]*$)/g, ',')}`

    dadosCentroEstoque.forEach(e => {
        let centro_estoque = {
            id_centro_estoque: e.id_centro_estoque,
            nome_centro_estoque: e.nome_centro_estoque,
        }
        let produtos = []
        let qtdeTotalProdutos = 0
        let valorTotalVarejo = 0
        let valorTotalAtacado = 0
        dadosProduto.forEach(e => {
            if (e.fk_id_centro_estoque == centro_estoque.id_centro_estoque) {
                qtdeTotalProdutos += e.quantidade
                valorTotalVarejo += Number(e.preco_varejo) * e.quantidade
                valorTotalAtacado += Number(e.preco_atacado) * e.quantidade
                produtos.push(e)
            }
        })
        centro_estoque.qtdeTotalProdutos = qtdeTotalProdutos
        centro_estoque.valorTotalVarejo = valorTotalVarejo
        centro_estoque.valorTotalAtacado = valorTotalAtacado
        centro_estoque.produtos = produtos
        produtos_centro_estoque.push(centro_estoque)

        let porcentagem = qtdeTotalProdutos * 100 / qtdeTotal

        let card = document.createElement("div")
        card.classList.add("card_info_porcentagem")
        card.classList.add("card_contato")

        let container_porcentagem_estoque = document.createElement("div")
        container_porcentagem_estoque.classList.add("container_porcentagem_estoque")

        let porcentagem_estoque = document.createElement("span")
        porcentagem_estoque.classList.add("porcentagem_estoque")
        porcentagem_estoque.textContent = porcentagem.toFixed(1) + "%"

        let quantidade_card = document.createElement("span")
        quantidade_card.classList.add("quantidade_card")
        quantidade_card.textContent = centro_estoque.qtdeTotalProdutos

        let pEstoque = document.createElement("p")
        pEstoque.textContent = e.nome_centro_estoque

        card.appendChild(container_porcentagem_estoque)
        container_porcentagem_estoque.appendChild(porcentagem_estoque)
        container_porcentagem_estoque.appendChild(pEstoque)
        card.appendChild(quantidade_card)

        document.querySelector(".container_card_info_porcentagem").appendChild(card)

        let porcentagemValorEstoque = centro_estoque.valorTotalVarejo * 100 / precoVarejo

        let container_info_valor_estoque = document.createElement("div")
        container_info_valor_estoque.classList.add("container_info_valor_estoque")

        let pNomeEstoque = document.createElement("p")
        pNomeEstoque.textContent = e.nome_centro_estoque

        let container_barra_valor_estoque = document.createElement("div")
        container_barra_valor_estoque.classList.add("container_barra_valor_estoque")

        let spanValorEstoque = document.createElement("span")
        spanValorEstoque.classList.add("valor_estoque")
        spanValorEstoque.textContent = `R$ ${centro_estoque.valorTotalVarejo.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.').replace(/\.(?=[^.]*$)/g, ',')}`

        let barra_estoque = document.createElement("div")
        barra_estoque.classList.add("barra_estoque")

        let barra_valor_estoque = document.createElement("div")
        barra_valor_estoque.classList.add("barra_valor_estoque")
        barra_valor_estoque.style.width = `${porcentagemValorEstoque}%`

        container_info_valor_estoque.appendChild(pNomeEstoque)
        container_info_valor_estoque.appendChild(container_barra_valor_estoque)
        container_barra_valor_estoque.appendChild(spanValorEstoque)
        container_barra_valor_estoque.appendChild(barra_estoque)
        barra_estoque.appendChild(barra_valor_estoque)

        document.querySelector(".container_info_valores_estoques").appendChild(container_info_valor_estoque)
    })

    // Ordena os cards dos centros de estoque pela porcentagem de estoque:
    let cards = document.querySelectorAll(".card_contato")
    cards = Array.from(cards).sort((a, b) => {
        let porcentagemA = parseFloat(a.querySelector(".porcentagem_estoque").textContent.replace("%", ""))
        let porcentagemB = parseFloat(b.querySelector(".porcentagem_estoque").textContent.replace("%", ""))
        return porcentagemB - porcentagemA
    })

    let barasValores = document.querySelectorAll(".container_info_valor_estoque")
    barasValores = Array.from(barasValores).sort((a, b) => {
        let porcentagemA = parseFloat(a.querySelector(".valor_estoque").textContent.replace("R$ ", "").replace(/\./g, "").replace(",", "."))
        let porcentagemB = parseFloat(b.querySelector(".valor_estoque").textContent.replace("R$ ", "").replace(/\./g, "").replace(",", "."))
        return porcentagemB - porcentagemA
    })

    let cor = 44
    cards.forEach(card => {
        let novaCor = `hsl(217, 49%, ${cor}%)`
        let aumentarBrilho = 44 / (dadosCentroEstoque.length - 1)
        cor = cor + aumentarBrilho
        card.style.borderLeft = `10px solid ${novaCor}`
        document.querySelector("#container_card_info_porcentagem_distribuicao").appendChild(card)

        produtos_centro_estoque.forEach(e => {
            if (e.nome_centro_estoque == card.querySelector("p").textContent) {
                e.cor = novaCor
            }
        })
    })

    barasValores.forEach(barra => {
        document.querySelector(".container_info_valores_estoques").appendChild(barra)
    })

    // Contatos:
    let cliente = 0
    let fornecedor = 0
    let funcionario = 0
    let totalContatos = 0

    dadosContatos.forEach(e => {
        e.categorias.forEach(c => {
            totalContatos++
            if (c.nome === "CLIENTE") cliente++;
            if (c.nome === "FORNECEDOR") fornecedor++;
            if (c.nome === "FUNCIONÁRIO") funcionario++;
        })
    })
    let arrContatos = [cliente, fornecedor, funcionario]
    document.querySelector("#quantidade_card_cliente").textContent = cliente
    document.querySelector("#quantidade_card_funcionario").textContent = funcionario
    document.querySelector("#quantidade_card_fornecedor").textContent = fornecedor
    document.querySelector("#porcentagem_card_cliente").textContent = `${(cliente * 100 / totalContatos).toFixed(1)}%`
    document.querySelector("#porcentagem_card_funcionario").textContent = `${(funcionario * 100 / totalContatos).toFixed(1)}%`
    document.querySelector("#porcentagem_card_fornecedor").textContent = `${(fornecedor * 100 / totalContatos).toFixed(1)}%`

    let cardClientes = document.querySelectorAll(".card_info_porcentagem_contato")
    cardClientes = Array.from(cardClientes).sort((a, b) => {
        let porcentagemA = parseFloat(a.querySelector(".porcentagem_card").textContent.replace("%", ""))
        let porcentagemB = parseFloat(b.querySelector(".porcentagem_card").textContent.replace("%", ""))
        return porcentagemB - porcentagemA
    })
    cardClientes.forEach(e => {
        document.querySelector("#container_card_info_porcentagem_contatos").appendChild(e)
    })

    // Tabela Produtos em falta no estoque:
    let tbodyProdutosEmFalta = document.querySelector("#tbody_produtos_em_falta")
    produtosEmFalta.forEach(produto => {
        let tr = document.createElement("tr")
        let tdNome = document.createElement("td")
        tdNome.textContent = produto.produto
        let tdQuantidade = document.createElement("td")
        tdQuantidade.textContent = produto.quantidade
        tr.appendChild(tdNome)
        tr.appendChild(tdQuantidade)
        tbodyProdutosEmFalta.appendChild(tr)
    })

    // Tabela Produtos com maior quantidade no estoque:
    const tbodyProdutosMaiorQuantidade = document.querySelector("#tbody_prdutos_maior_quantidade")
    const produtosOrdenados = [...dadosProduto].sort((a, b) => b.quantidade - a.quantidade);
    const top4Produtos = produtosOrdenados.slice(0, 4);
    top4Produtos.forEach(produto => {
        let tr = document.createElement("tr")
        let tdNome = document.createElement("td")
        tdNome.textContent = produto.produto
        let tdQuantidade = document.createElement("td")
        tdQuantidade.textContent = produto.quantidade
        tr.appendChild(tdNome)
        tr.appendChild(tdQuantidade)
        tbodyProdutosMaiorQuantidade.appendChild(tr)
    })

    // Gráfico de distribuição de produtos em estoque:
    function criarGraficoDistribuicaoProdutosEstoque() {
        produtos_centro_estoque.sort((a, b) => b.qtdeTotalProdutos - a.qtdeTotalProdutos)
        const ctx = document.getElementById('grafico_distribuicao_produtos_estoque').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: produtos_centro_estoque.map(e => e.nome_centro_estoque),
                datasets: [{
                    data: produtos_centro_estoque.map(e => e.qtdeTotalProdutos),
                    backgroundColor: produtos_centro_estoque.map(e => e.cor),
                    borderWidth: 1,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.label}: ${context.formattedValue}`;
                            }
                        }
                    }
                },
                cutout: '70%',
                animation: {
                    onComplete: function () {
                        const ctx = this.ctx;
                        const centerX = this.width / 2;
                        const centerY = this.height / 2;
                        ctx.font = 'bold 16px Arial';
                        ctx.fillStyle = '#666';
                        ctx.textAlign = 'center';
                        ctx.fillText('Qtde. Total', centerX, centerY - 15);
                        const total = produtos_centro_estoque.reduce((sum, item) => sum + item.qtdeTotalProdutos, 0);
                        ctx.font = 'bold 24px Arial';
                        ctx.fillStyle = '#333';
                        ctx.fillText(total.toString(), centerX, centerY + 15);
                    }
                }
            }
        });
    }
    criarGraficoDistribuicaoProdutosEstoque()

    function criarGraficoContatos() {
        const ctx = document.getElementById('grafico_contatos').getContext('2d');
        const grafico = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Clientes', 'Fornecedores', 'Funcionários'],
                datasets: [{
                    data: arrContatos,
                    backgroundColor: [azul, azul1, azul_1],
                    hoverOffset: 4
                }]
            },
            options: {
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.label || ''}: ${context.formattedValue || ''}`;
                            }
                        }
                    }
                },
                animation: {
                    onComplete: function () {
                        const ctx = this.ctx;
                        const centerX = this.width / 2;
                        const centerY = this.height / 2;
                        ctx.font = 'bold 1rem Arial';
                        ctx.fillStyle = '#333';
                        ctx.textAlign = 'center';
                        ctx.fillText('Qtde. Total', centerX, centerY - 15);
                        ctx.font = 'bold 1.4rem Arial';
                        ctx.fillText(dadosContatos.length.toString(), centerX, centerY + 15);
                    }
                }
            }
        });
    }
    criarGraficoContatos()

    // -------------------------------------------------------
    // Gráfico Entrada de produtos — usa dados reais da API
    // -------------------------------------------------------
    let gfc_entrada
    function criarGraficoEntrada(tipo, font) {
        const c_gfc_entrada = document.getElementById('grafico_entrada_produtos').getContext('2d');
        if (gfc_entrada) gfc_entrada.destroy()
        gfc_entrada = new Chart(c_gfc_entrada, {
            type: tipo,
            data: {
                labels: anos, // anos reais vindos da API
                datasets: [{
                    label: 'Entradas',
                    data: dado_entrada, // dados reais vindos da API
                    fill: true,
                    backgroundColor: azul_1,
                    borderColor: azul,
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Ano', font: { size: font } } },
                    y: { beginAtZero: true, title: { display: true, text: 'Entradas', font: { size: font } } },
                },
                plugins: { legend: { display: false } }
            }
        });
    }
    criarGraficoEntrada('line')

    // -------------------------------------------------------
    // Gráfico Saída de produtos — usa dados reais da API
    // -------------------------------------------------------
    let gfc_saida
    function criarGraficoSaida(tipo, font) {
        const c_gfc_saida = document.getElementById('grafico_saida_produtos').getContext('2d');
        if (gfc_saida) gfc_saida.destroy()
        gfc_saida = new Chart(c_gfc_saida, {
            type: tipo,
            data: {
                labels: anos, // anos reais vindos da API
                datasets: [{
                    label: 'Saídas',
                    data: dado_saida, // dados reais vindos da API
                    fill: true,
                    backgroundColor: azul_1,
                    borderColor: azul,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Ano', font: { size: font } } },
                    y: { beginAtZero: true, title: { display: true, text: 'Saídas', font: { size: font } } },
                },
                plugins: { legend: { display: false } }
            }
        });
    }
    criarGraficoSaida('line')

    // -------------------------------------------------------
    // Gráfico Diferença — calculado automaticamente
    // -------------------------------------------------------
    let gfc_diferenca
    function criarGraficoDiferenca(tipo, font) {
        const c_gfc_diferenca = document.getElementById('grafico_diferenca_produtos').getContext('2d');
        if (gfc_diferenca) gfc_diferenca.destroy()
        gfc_diferenca = new Chart(c_gfc_diferenca, {
            type: tipo,
            data: {
                labels: anos, // anos reais vindos da API
                datasets: [{
                    label: 'Entradas - Saídas',
                    data: dado_diferenca, // calculado automaticamente
                    fill: {
                        target: { value: 0 },
                        above: '#e9f0ff73',
                        below: vermelho
                    },
                    backgroundColor: function (context) {
                        const value = context.dataset.data[context.dataIndex];
                        return value < 0 ? vermelho : azul_1;
                    },
                    borderColor: azul,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Ano', font: { size: font } } },
                    y: { beginAtZero: true, title: { display: true, text: 'Fluxo total', font: { size: font } } },
                },
                plugins: { legend: { display: false } }
            }
        });
    }
    criarGraficoDiferenca('line')

    // -------------------------------------------------------
    // Filtro por data — atualiza os três gráficos ao filtrar
    // -------------------------------------------------------
    function aplicarFiltroData(dataInicio, dataFim) {
        let entradaFiltrada = {}
        let saidaFiltrada = {}

        dadosTiposEntrada.forEach(e => {
            let data = new Date(e.data_criacao)
            if (data >= dataInicio && data <= dataFim) {
                let ano = data.getFullYear()
                entradaFiltrada[ano] = (entradaFiltrada[ano] || 0) + 1
            }
        })

        dadosTiposSaida.forEach(e => {
            let data = new Date(e.data_criacao)
            if (data >= dataInicio && data <= dataFim) {
                let ano = data.getFullYear()
                saidaFiltrada[ano] = (saidaFiltrada[ano] || 0) + 1
            }
        })

        let anosF = Array.from(new Set([...Object.keys(entradaFiltrada), ...Object.keys(saidaFiltrada)])).sort()
        anos = anosF
        dado_entrada = anosF.map(a => entradaFiltrada[a] || 0)
        dado_saida = anosF.map(a => saidaFiltrada[a] || 0)
        dado_diferenca = dado_entrada.map((v, i) => v - dado_saida[i])

        criarGraficoEntrada(gfc_entrada?.config?.type || 'line', fontSize)
        criarGraficoSaida(gfc_saida?.config?.type || 'line', fontSize)
        criarGraficoDiferenca(gfc_diferenca?.config?.type || 'line', fontSize)
    }

    // Conecta os inputs de data de cada painel individualmente:
    function conectarFiltros(idPainel) {
        let inputs = document.querySelectorAll(`#${idPainel} .input_date`)
        if (inputs.length === 2) {
            inputs.forEach(input => {
                input.addEventListener("change", () => {
                    let ini = new Date(inputs[0].value)
                    let fim = new Date(inputs[1].value)
                    if (ini && fim && ini <= fim) {
                        aplicarFiltroData(ini, fim)
                    }
                })
            })
        }
    }
    conectarFiltros('div_entrada_de_produtos')
    conectarFiltros('div_saida_de_produtos')
    conectarFiltros('div_diferenca_entrada_saida')

    // -------------------------------------------------------

    function atualizarGraficos(graficos, width) {
        graficos.forEach(grafico => {
            grafico.options.scales.x.title.font.size = fontSize;
            grafico.options.scales.y.title.font.size = fontSize;
            grafico.update();
        });
        if (width <= 300) {
            graficos.forEach(e => {
                e.options.scales.x.title.display = false
                e.options.scales.y.title.display = false
            })
        } else {
            graficos.forEach(e => {
                e.options.scales.x.title.display = true
                e.options.scales.y.title.display = true
            })
        }
    }

    let fontSize = 16

    // Alterar tipo do gráfico:
    $('.tipo_grafico').select2({
        placeholder: 'Selecione a coluna',
        width: '80px',
        minimumResultsForSearch: Infinity,
    });

    $('.tipo_grafico').on('change', function () {
        let tipoGrafico = this.id
        let tipo = this.value
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

    popup_carregando(true)
}