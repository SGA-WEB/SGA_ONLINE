import select2 from "../../../scripts/select.js"
import { carregarConteudo } from "../../../scripts/javaScript.js"
import { formatarData, mudarPesquisa } from "../../../scripts/funcionalidades.js"
import buscarDados from "../../../scripts/buscarDados.js"
import { carregarDadosNaTabela, pesquisar } from "../../../scripts/carregarDadosNaTabela.js"
import { popup, popup_carregando, popup_aviso, popup_erro, popup_confirmar } from "../../../scripts/popup.js"
import orcamento from "../orcamento.js"
import visualizar_orcamento from "../visualizar_orcamento/visualizar_orcamento.js"

export default async function editar_orcamento(dado, telaAnteriorVisualizar = false) {
    popup_carregando(false, 'Carregando dados do orçamento...')

    let caminho = "orcamento/orcamento.html"
    let funcao = orcamento

    if (telaAnteriorVisualizar) {
        caminho = "orcamento/visualizar_orcamento/visualizar_orcamento.html"
        funcao = visualizar_orcamento
    }

    // Preenche cabeçalho
    document.querySelector(".codigo_id").textContent = dado.id_orcamento
    document.querySelector(".data_cadastro").textContent = formatarData(dado.data_criacao)

    // Preenche campos simples
    document.querySelector("#status").value = dado.status
    document.querySelector("#desconto_total").value = dado.desconto_total

    if (dado.data_emissao) {
        document.querySelector("#data_emissao").value = formatarData(dado.data_emissao, true, '-')
    }
    if (dado.data_recebimento) {
        document.querySelector("#data_recebimento").value = formatarData(dado.data_recebimento, true, '-')
    }

    // Busca dados necessários em paralelo
    let [produtos, contatos, usuarios, itensOrcamento] = await Promise.all([
        buscarDados("produto"),
        buscarDados("contato"),
        buscarDados("usuarios"),
        buscarDados(`orcamentos/${dado.id_orcamento}/itens`)
    ])

    // Popula select de Cliente (filtra apenas CLIENTE)
    let selectCliente = document.querySelector("#cliente")
    contatos.forEach(contato => {
        let ehCliente = contato.categorias && contato.categorias.some(c => c.nome === "CLIENTE")
        if (ehCliente) {
            let option = document.createElement("option")
            option.value = contato.id_contato
            option.text = contato.razao_social
            selectCliente.appendChild(option)
        }
    })
    selectCliente.value = dado.cliente_id

    // Popula select de Criado por
    let selectCriadoPor = document.querySelector("#criado_por")
    usuarios.forEach(usuario => {
        let option = document.createElement("option")
        option.value = usuario.id_usuario
        option.text = usuario.nome
        selectCriadoPor.appendChild(option)
    })
    const usuarioCriador = usuarios.find(u => u.nome === dado.criado_por_nome)
    selectCriadoPor.value = usuarioCriador?.id_usuario ?? ""

    select2("100%")

    // Prepara lista de produtos para o popup de seleção
    produtos = produtos.sort((a, b) => a.id_produto - b.id_produto)
    produtos.forEach(produto => {
        produto.valor_total = produto.preco_varejo * produto.quantidade
        produto.desconto = 0
    })

    // Carrega os itens existentes do orçamento na tabela
    let itensData = itensOrcamento?.itens ?? []
    let idProdutosSelecionados = []
    let produtosRelacionados = []

    itensData.forEach(item => {
        let produtoBase = produtos.find(p => p.id_produto === item.produto_id)
        produtosRelacionados.push({
            id_produto: item.produto_id,
            produto: item.nome_produto,
            quantidade: item.quantidade,
            preco_varejo: item.valor_unitario,
            desconto: item.desconto_item,
            valor_total: item.valor_total_item
        })
        idProdutosSelecionados.push(String(item.produto_id))
    })

    let valorTotalTodosProdutos = 0
    let descontoTotalCalculado = 0

    carregarDadosNaTabela(
        produtosRelacionados,
        ["id_produto", "produto", "quantidade", "preco_varejo", "desconto", "valor_total"],
        document.querySelector(".tbody"),
        true,
        false
    )

    criarInputsQuantidadeDesconto()
    addListenerExcluirProdutos()

    popup_carregando(true)

    // Botão adicionar relação — abre popup de seleção de produtos
    let btn_adicionar_relacao = document.querySelector("#btn_adicionar_relacao")
    btn_adicionar_relacao.addEventListener("click", () => {
        popup("abrir", 0, btn_adicionar_relacao)
        carregarDadosNaTabela(
            produtos,
            ["id_produto", "produto", "quantidade", "preco_varejo"],
            document.querySelector("#tabela_selecionar_produtos"),
            false,
            true,
            false
        )
        pesquisar(
            produtos,
            ["id_produto", "produto", "quantidade", "preco_varejo"],
            document.querySelector("#tabela_selecionar_produtos"),
            false
        )
        mudarPesquisa(document.querySelector(".input_pesquisa"), "#select_coluna")
        select2("200px")

        // Marca os produtos já selecionados
        document.querySelectorAll(".table_tr").forEach(tr => {
            let tr_id = tr.id.replace("tr_", "")
            if (idProdutosSelecionados.includes(tr_id)) {
                tr.querySelector(".checkbox_selecionar_linha").checked = true
                tr.classList.add("linha_selecionada")
            }
        })
    })

    let btn_selecionar_relacao = document.querySelector(".btn_selecionar_relacao")
    let btn_fechar_popup = document.querySelector(".btn_fechar_popup")
    btn_fechar_popup.addEventListener("click", selecionarProdutos)
    btn_selecionar_relacao.addEventListener("click", selecionarProdutos)

    function selecionarProdutos() {
        let checkboxesSelecionados = document.querySelectorAll("#tabela_selecionar_produtos .checkbox_selecionar_linha:checked")
        idProdutosSelecionados = []
        checkboxesSelecionados.forEach(checkbox => {
            idProdutosSelecionados.push(checkbox.id.replace("checkbox_", ""))
        })

        let novosDados = produtos.filter(p => idProdutosSelecionados.includes(String(p.id_produto)))

        produtosRelacionados = []
        novosDados.forEach(produto => {
            produtosRelacionados.push({
                id_produto: produto.id_produto,
                quantidade: 1,
                valor_unitario: produto.preco_varejo,
                desconto: 0
            })
        })

        carregarDadosNaTabela(
            novosDados,
            ["id_produto", "produto", "quantidade", "preco_varejo", "desconto", "valor_total"],
            document.querySelector("#tabela_produtos"),
            true,
            false,
            false
        )

        popup("fechar", 0, btn_selecionar_relacao)
        addListenerExcluirProdutos()
        criarInputsQuantidadeDesconto()
    }

    function calcularValorTotal() {
        let tabela = document.querySelector("#tabela_produtos")
        let inputsQuantidade = tabela.querySelectorAll(".input_quantidade")
        let inputsDesconto = tabela.querySelectorAll(".input_desconto")
        let celulasPrecoVarejo = tabela.querySelectorAll(".td_preco_varejo")
        let celulasValorTotal = tabela.querySelectorAll(".td_valor_total")

        valorTotalTodosProdutos = 0
        descontoTotalCalculado = 0

        inputsQuantidade.forEach((input, index) => {
            let precoVarejo = parseFloat(celulasPrecoVarejo[index].textContent) || 0
            let quantidade = parseFloat(input.value) || 0
            let desconto = parseFloat(inputsDesconto[index].value) || 0
            let valorTotal = (precoVarejo * quantidade) - desconto

            celulasValorTotal[index].textContent = valorTotal.toFixed(2)
            valorTotalTodosProdutos += valorTotal
            descontoTotalCalculado += desconto

            if (produtosRelacionados[index]) {
                produtosRelacionados[index].quantidade = quantidade
                produtosRelacionados[index].desconto = desconto
                produtosRelacionados[index].valor_unitario = precoVarejo
            }
        })
    }

    function criarInputsQuantidadeDesconto() {
        document.querySelectorAll(".td_quantidade").forEach(td => {
            td.classList.add("td_container_input")
            let inputQuantidade = document.createElement("input")
            inputQuantidade.type = "number"
            inputQuantidade.value = td.firstChild ? td.firstChild.textContent.trim() : 1
            inputQuantidade.min = 1
            inputQuantidade.classList.add("input_quantidade", "input_tabela")
            inputQuantidade.addEventListener("input", calcularValorTotal)
            td.textContent = ""
            td.appendChild(inputQuantidade)
        })

        document.querySelectorAll(".td_desconto").forEach(td => {
            td.classList.add("td_container_input")
            let inputDesconto = document.createElement("input")
            inputDesconto.type = "number"
            inputDesconto.value = td.firstChild ? td.firstChild.textContent.trim() : 0
            inputDesconto.classList.add("input_desconto", "input_tabela")
            inputDesconto.addEventListener("input", calcularValorTotal)
            td.textContent = ""
            td.appendChild(inputDesconto)
        })

        calcularValorTotal()
    }

    function addListenerExcluirProdutos() {
        document.querySelectorAll(".btn_excluir").forEach(btn => {
            btn.addEventListener("click", (e) => {
                let id_tr = e.currentTarget.parentElement.parentElement.id.replace("tr_", "")
                let tr = e.currentTarget.parentElement.parentElement
                tr.remove()
                idProdutosSelecionados = idProdutosSelecionados.filter(id => id !== id_tr)
                produtosRelacionados = produtosRelacionados.filter(p => String(p.id_produto) !== id_tr)
                calcularValorTotal()
            })
        })
    }

    // Salvar edição
    let formOrcamento = document.querySelector("#form_orcamento")
    document.querySelector(".btn_salvar").addEventListener("click", async (e) => {
        e.preventDefault()

        if (produtosRelacionados.length === 0) {
            popup_erro('É necessário selecionar pelo menos um produto para salvar o orçamento.')
            btn_adicionar_relacao.style.border = "1px solid red"
            setTimeout(() => { btn_adicionar_relacao.style.border = "none" }, 5000)
            return
        }

        let formData = new FormData(formOrcamento)
        let data = Object.fromEntries(formData)

        data.desconto_total = descontoTotalCalculado
        data.total = valorTotalTodosProdutos
        data.itens = produtosRelacionados.map(p => ({
            id_produto: p.id_produto,
            quantidade: p.quantidade,
            valor_unitario: p.valor_unitario,
            desconto: p.desconto
        }))

        try {
            popup_carregando(false, 'Salvando orçamento...')
            const response = await fetch(`http://localhost:3000/orcamento/${dado.id_orcamento}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await response.json()
            popup_carregando(true)

            if (response.ok) {
                popup_aviso('Orçamento atualizado com sucesso!')
                carregarConteudo(caminho, document.querySelector(".principal"), false, funcao, dado)
            } else {
                popup_erro('Erro: ' + (result.erro || result.error))
            }
        } catch (err) {
            popup_erro('Erro ao conectar com a API.')
            console.error(err)
        }
    })

    // Voltar e Cancelar
    async function voltarTelaAnterior() {
        if (await popup_confirmar("Tem certeza que deseja voltar? Todas as edições feitas serão perdidas.")) {
            carregarConteudo(caminho, document.querySelector(".principal"), false, funcao, dado)
        }
    }

    document.querySelector("#btn_voltar_orcamento").addEventListener("click", voltarTelaAnterior)
    document.querySelector(".btn_cancelar").addEventListener("click", (e) => {
        e.preventDefault()
        voltarTelaAnterior()
    })
}
