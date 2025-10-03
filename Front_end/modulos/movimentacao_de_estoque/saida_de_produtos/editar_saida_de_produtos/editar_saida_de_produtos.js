import select2 from "../../../../scripts/select.js";
import { formatarData } from "../../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../../scripts/javaScript.js";
import saida_de_produtos from "../saida_de_produtos.js";
import buscarDados from "../../../../scripts/buscarDados.js";
import { carregarDadosNaTabela, pesquisar } from "../../../../scripts/carregarDadosNaTabela.js";
import { popup, popup_carregando, popup_erro, popup_aviso, popup_confirmar } from "../../../../scripts/popup.js";
import visualizar_saida_de_produtos from "../visualizar_saida_de_produtos/visualizar_saida_de_produtos.js";
import { mudarPesquisa } from "../../../../scripts/funcionalidades.js";

export default async function editar_saida_de_produtos(saida, telaAnteriorVisualizar = false) {
    popup_carregando(false, 'Carregando dados da saida de produtos...');

    document.querySelector(".codigo_id").textContent = saida.id_saida_produto
    document.querySelector(".data_cadastro").textContent = formatarData(saida.data_saida)
    document.querySelector("#chave_nfe").value = saida.chave_nfe
    document.querySelector("#numero_nf").value = saida.numero_nf
    document.querySelector("#modelo").value = saida.modelo_documento_fiscal
    document.querySelector("#tipo_de_saida").value = saida.tipo_saida
    document.querySelector("#serie").value = saida.serie
    document.querySelector("#sub_serie").value = saida.subserie
    document.querySelector("#data_saida").value = formatarData(saida.data_saida, true)
    document.querySelector("#status_da_saida").value = saida.status
    document.querySelector("#destinatario").value = saida.destinatario_razao_social
    document.querySelector("#valor_total").value = saida.valor_total
    document.querySelector("#modelo").value = saida.modelo_documento_fiscal
    select2("100%")

    let caminho = "movimentacao_de_estoque/saida_de_produtos/saida_de_produtos.html"
    let funcao = saida_de_produtos

    if (telaAnteriorVisualizar) {
        caminho = "movimentacao_de_estoque/saida_de_produtos/visualizar_saida_de_produtos/visualizar_saida_de_produtos.html"
        funcao = visualizar_saida_de_produtos
    }

    let valorTotalTodosProdutos = 0;
    let descontoTotal = 0
    let idProdutosSelecionados = []
    let produtosRelacionados = []
    let itemsRelacionados = await buscarDados(`saida_produto/${saida.id_saida_produto}/itens`)
    let produtos = await buscarDados("produto")
    let contatos = await buscarDados("contato");
    itemsRelacionados = itemsRelacionados.itens;

    // Adiciona no array produtosRelacionados os produtos que estão relacionados com a saida de produtos
    produtos.forEach(produto => {
        itemsRelacionados.forEach(item => {
            if (produto.id_produto === item.produto_id) {
                // Se o produto já estiver na lista de produtos relacionados, não adiciona novamente
                if (!produtosRelacionados.some(p => p.id_item === item.id_item)) {
                    produtosRelacionados.push({
                        // adicionas as chaves que já são usadas na tabela de produtos
                        id_produto: item.produto_id,
                        produto: produto.produto,
                        quantidade: item.quantidade,
                        preco_varejo: item.valor_unitario,
                        desconto: item.desconto_item,
                        valor_total: item.valor_total_item
                    });
                }
            }
        })
    })

    carregarDadosNaTabela(produtosRelacionados, ["id_item", "nome_produto", "quantidade", "valor_unitario", "desconto_item", "valor_total_item"], document.querySelector(".tbody"), false, false)

    criarInputsQuantidadeDesconto();
    addListenerExcluirProdutos();

    let fornecedores = []

    contatos.forEach(contato => { // Para cada contato, verifica se ele é um fornecedor e, se sim, adiciona-o ao array fornecedores
        contato.categorias.forEach(categoria => {
            if (categoria.nome === "FORNECEDOR") {
                fornecedores.push(contato)
            }
        })
    })

    let selectfornecedor = document.querySelector("#fornecedor");
    fornecedores.forEach((fornecedor) => {
        let option = document.createElement("option");
        option.value = fornecedor.id_contato;
        option.text = fornecedor.razao_social;
        selectfornecedor.appendChild(option);
    })

    selectfornecedor.value = saida.fornecedor_id

    // Ordena os fornecedores pelo id
    produtos = produtos.sort((a, b) => a.id_produto - b.id_produto);

    // Adiciona o campo valor_total e o desconto em cada produto
    produtos.map(produto => {
        produto.valor_total = produto.preco_varejo * produto.quantidade;
        produto.desconto = 0; // Inicializa o desconto como 0
    })

    popup_carregando(true)

    let btn_adicionar_relacao = document.querySelector("#btn_adicionar_relacao");
    btn_adicionar_relacao.addEventListener("click", async () => {
        // Quando o botão de adicionar relação for clicado
        // Abre um popup para selecionar os produtos
        // Carrega os produtos na tabela de seleção
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

        document.querySelectorAll(".table_tr").forEach(tr => {
            // Seleciona os tr's da tabela de produtos selecionados anteriormente
            let tr_id = tr.id.replace("tr_", "");
            idProdutosSelecionados.forEach(idProduto => {
                if (tr_id === idProduto) {
                    tr.querySelector(".checkbox_selecionar_linha").checked = true;
                    tr.classList.add("linha_selecionada");
                }
            })
        })
    })

    let btn_selecionar_relacao = document.querySelector(".btn_selecionar_relacao");
    let btn_fechar_popup = document.querySelector(".btn_fechar_popup");
    btn_fechar_popup.addEventListener("click", selecionarProdutos)
    btn_selecionar_relacao.addEventListener("click", selecionarProdutos)

    function selecionarProdutos() {
        // Quando o botão de selecionar relação for clicado
        // Seleciona os produtos que foram marcados na tabela de seleção
        let checkboxProdutoSelecionados = document.querySelectorAll("#tabela_selecionar_produtos .checkbox_selecionar_linha:checked");
        idProdutosSelecionados = []
        checkboxProdutoSelecionados.forEach(checkbox => {
            idProdutosSelecionados.push(
                checkbox.id.replace("checkbox_", "")
            )
        })

        let novosDados = produtos.filter(produto => {
            // Filtra os produtos que foram selecionados
            return idProdutosSelecionados.includes(produto.id_produto.toString())
        })

        novosDados.forEach(produto => {
            // Adiciona o produto selecionado na lista de produtos relacionados
            produtosRelacionados.push({
                id_produto: produto.id_produto,
                quantidade: 1,
                valor_unitario: produto.preco_varejo,
                desconto: 0,
            });
        })

        carregarDadosNaTabela(novosDados, ["id_produto", "produto", "quantidade", "preco_varejo", "desconto", "valor_total"], document.querySelector("#tabela_produtos"), true, false, false)

        popup("fechar", 0, btn_selecionar_relacao)

        document.querySelectorAll(".btn_excluir").forEach(btn => {
            // Adiciona o evento de click para cada botão de excluir
            btn.addEventListener("click", (e) => {
                // Remove a linha da tabela e da lista de produtos selecionados
                let id_tr = e.currentTarget.parentElement.parentElement.id.replace("tr_", "");
                let tr = e.currentTarget.parentElement.parentElement;
                tr.remove(tr)

                idProdutosSelecionados = idProdutosSelecionados.filter(id => id !== id_tr);
                produtosRelacionados = produtosRelacionados.filter(produto => produto.id_produto !== parseInt(id_tr));
                calcularValorTotal();
            });
        });

        addListenerExcluirProdutos();
        criarInputsQuantidadeDesconto();
    }

    function calcularValorTotal() {
        let tabela = document.querySelector("#tabela_produtos")
        let inputsQuantidade = tabela.querySelectorAll(".input_quantidade");
        let inputsDesconto = tabela.querySelectorAll(".input_desconto");
        let inputsPrecoVarejo = tabela.querySelectorAll(".td_preco_varejo");
        let inputsValorTotal = tabela.querySelectorAll(".td_valor_total");
        valorTotalTodosProdutos = 0; // Reseta o valor total antes de calcular
        descontoTotal = 0; // Reseta o desconto total antes de calcular

        inputsQuantidade.forEach((input, index) => {
            // Para cada input de quantidade e desconto, calcula o valor total
            let precoVarejo = inputsPrecoVarejo[index].textContent;
            let quantidade = input.value;
            let desconto = inputsDesconto[index].value;
            let valorTotal = (precoVarejo * quantidade) - desconto;

            inputsPrecoVarejo[index].value = precoVarejo;
            inputsQuantidade[index].value = quantidade;
            inputsDesconto[index].value = desconto;
            inputsValorTotal[index].textContent = valorTotal.toFixed(2)

            valorTotalTodosProdutos += valorTotal;
            descontoTotal += desconto.replace(",", ".") * 1; // Converte o desconto para número e acumula

            // Atualiza o objeto produtosRelacionados com os valores atualizados
            produtosRelacionados[index].quantidade = quantidade;
            produtosRelacionados[index].desconto = desconto;
        });
    }

    function criarInputsQuantidadeDesconto() {
        document.querySelectorAll(".td_quantidade").forEach(td => {
            // Adiciona um input de quantidade em cada célula de quantidade
            td.classList.add("td_container_input")
            let inputQuantidade = document.createElement("input");
            inputQuantidade.type = "number";
            inputQuantidade.value = td.firstChild.textContent; // valor inicial da quantidade salva no banco de dados
            inputQuantidade.max = td.textContent; // Define o valor máximo como a quantidade do produto
            inputQuantidade.min = 1; // Define o valor mínimo como 1
            inputQuantidade.classList.add("input_quantidade");
            inputQuantidade.classList.add("input_tabela");
            inputQuantidade.addEventListener("input", calcularValorTotal);

            td.textContent = ""
            td.appendChild(inputQuantidade);
        })

        document.querySelectorAll(".td_desconto").forEach(td => {
            td.classList.add("td_container_input")
            let inputDesconto = document.createElement("input");
            inputDesconto.type = "number";
            inputDesconto.value = td.firstChild.textContent; // valor inicial do desconto salvo no banco de dados
            inputDesconto.classList.add("input_desconto");
            inputDesconto.addEventListener("input", calcularValorTotal);
            inputDesconto.classList.add("input_tabela");

            td.textContent = ""
            td.appendChild(inputDesconto);
        })
        calcularValorTotal();
    }

    function addListenerExcluirProdutos() {
        document.querySelectorAll(".btn_excluir").forEach(btn => {
            // Adiciona o evento de click para cada botão de excluir
            btn.addEventListener("click", (e) => {
                // Remove a linha da tabela e da lista de produtos selecionados
                let id_tr = e.currentTarget.parentElement.parentElement.id.replace("tr_", "");
                let tr = e.currentTarget.parentElement.parentElement;
                tr.remove(tr)
                idProdutosSelecionados = idProdutosSelecionados.filter(id => id !== id_tr);
                produtosRelacionados = produtosRelacionados.filter(produto => {
                    return produto.id_item !== parseInt(id_tr);
                })
                calcularValorTotal();
            });
        });
    }

    let formsaidaProduto = document.querySelector("#form_saida_produto");
    formsaidaProduto.addEventListener("submit", async (e) => {
        e.preventDefault();
        let formData = new FormData(formsaidaProduto);
        let data = Object.fromEntries(formData);

        data.desconto = descontoTotal;
        data.total = valorTotalTodosProdutos;
        data.itens = produtosRelacionados;
        data.itens.forEach(item => {
            item.valor_unitario = item.preco_varejo;
            delete item.preco_varejo;
        });

        let id_saida = document.querySelector(".codigo_id").textContent;

        if (data.itens.length === 0) {
            popup_erro('É necessário selecionar pelo menos um produto para salvar a saida.');
            document.querySelector("#btn_adicionar_relacao").style.border = "1px solid red";
            setTimeout(() => {
                document.querySelector("#btn_adicionar_relacao").style.border = "none";
            }, 5000);
            return;
        }
        try {
            popup_carregando(false, 'Salvando saida de produto...');
            const response = await fetch('http://localhost:3000/saida_produto/' + id_saida, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            popup_carregando(true)
            if (response.ok) {
                popup_aviso('saida salva com sucesso!');
                carregarConteudo("movimentacao_de_estoque/saida_de_produtos/saida_de_produtos.html", document.querySelector(".principal"), false, saida_de_produtos);
            } else {
                popup_erro('Erro: ' + result.erro);
            }
        } catch (err) {
            popup_erro('Erro ao conectar com a API.');
            console.error(err);
        }
    })

    document.querySelector("#btn_voltar_saida_produtos").addEventListener("click", voltarTelaAnterior)
    document.querySelector(".btn_cancelar").addEventListener("click", (e) => {
        e.preventDefault();
        voltarTelaAnterior();
    })

    async function voltarTelaAnterior() {
        let formData = new FormData(formsaidaProduto);
        let data = Object.fromEntries(formData);
        let dadosPreenchidos = false
        // Se algum campo do formulário estiver preenchido, é necessário confirmar a saída
        for (let key in data) {
            if (data[key] === "") {
                data[key] = null;
            }
            if (data[key] !== null) {
                dadosPreenchidos = true;
            }
        }
        if (idProdutosSelecionados.length > 0 || dadosPreenchidos) {
            if (await popup_confirmar("Tem certeza que deseja voltar? Todas as edições feitas serão perdidas.")) {
                carregarConteudo(caminho, document.querySelector(".principal"), false, funcao, saida)
            } else {
                return;
            }
        } else {
            carregarConteudo(caminho, document.querySelector(".principal"), false, funcao, saida)
        }
    }
}
