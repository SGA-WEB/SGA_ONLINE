import { dataAtual, mudarPesquisa } from "../../../../scripts/funcionalidades.js";
import select2 from "../../../../scripts/select.js";
import buscarDados from "../../../../scripts/buscarDados.js";
import { carregarConteudo } from "../../../../scripts/javaScript.js";
import entrada_de_produtos from "../entrada_de_produtos.js";
import { popup, popup_aviso, popup_carregando, popup_confirmar, popup_erro } from "../../../../scripts/popup.js";
import { carregarDadosNaTabela, pesquisar } from "../../../../scripts/carregarDadosNaTabela.js";

export default async function cadastro_entrada_produtos(dados) {
    select2("100%")
    dataAtual()
    let produtos = await buscarDados("produto")

    let ultimoIdProduto
    let fornecedores = []
    dados.forEach(dado => {
        ultimoIdProduto = dado.id_entrada_produto
        fornecedores.push({
            fornecedor_id: dado.fornecedor_id,
            fornecedor_razao_social: dado.fornecedor_razao_social
        })
    });

    // Remove fornecedores duplicados
    fornecedores = [...new Set(fornecedores.map(f => f.fornecedor_id))].map(id => {
        return fornecedores.find(f => f.fornecedor_id === id);
    });
    // Ordena os fornecedores pelo id
    produtos = produtos.sort((a, b) => a.id_produto - b.id_produto);

    // Adiciona o campo valor_total e o desconto em cada produto
    produtos.map(produto => {
        produto.valor_total = produto.preco_varejo * produto.quantidade;
        produto.desconto = 0; // Inicializa o desconto como 0
    })

    document.querySelector(".codigo_id").textContent = ultimoIdProduto + 1

    fornecedores.forEach(fornecedor => {
        // Altera o select de fornecedores para incluir os fornecedores do banco de dados
        // Cria um novo elemento option para cada fornecedor
        let option = document.createElement("option");
        option.value = fornecedor.fornecedor_id;
        option.text = fornecedor.fornecedor_razao_social;
        document.querySelector("#fornecedor").appendChild(option);
    });

    let btn_adicionar_relacao = document.querySelector("#btn_adicionar_relacao");
    btn_adicionar_relacao.addEventListener("click", async () => {
        // Quando o botão de adicionar relação for clicado
        // Abre um popup para selecionar os produtos
        // Carrega os produtos na tabela de seleção
        popup("abrir", 0, btn_adicionar_relacao)
        carregarDadosNaTabela(
            produtos,
            ["id_produto", "produto", "quantidade","preco_varejo"],
            document.querySelector("#tabela_selecionar_produtos"),
            false,
            true,
            false
        )
        pesquisar(
            produtos,
            ["id_produto", "produto", "quantidade","preco_varejo"],
            document.querySelector("#tabela_selecionar_produtos"),
            false
        )
        mudarPesquisa(document.querySelector(".input_pesquisa"),"#select_coluna")
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

    let idProdutosSelecionados = []
    let produtosRelacionados = []
    let btn_selecionar_relacao = document.querySelector(".btn_selecionar_relacao");
    let btn_fechar_popup = document.querySelector(".btn_fechar_popup");
    btn_fechar_popup.addEventListener("click", selecionarProdutos)
    btn_selecionar_relacao.addEventListener("click", selecionarProdutos)

    function selecionarProdutos () {
        // Quando o botão de selecionar relação for clicado
        // Seleciona os produtos que foram marcados na tabela de seleção
        let checkboxProdutoSelecionados = document.querySelectorAll(".checkbox_selecionar_linha:checked");
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

        carregarDadosNaTabela(novosDados, ["id_produto", "produto", "quantidade","preco_varejo", "desconto", "valor_total"], document.querySelector("#tabela_produtos"), true, false)

        popup("fechar", 0, btn_selecionar_relacao)

        document.querySelectorAll(".btn_excluir").forEach(btn => {
            // Adiciona o evento de click para cada botão de excluir
            btn.addEventListener("click", (e) => {
                // Remove a linha da tabela e da lista de produtos selecionados
                let id_tr = e.currentTarget.parentElement.parentElement.id.replace("tr_", "");
                let tr = e.currentTarget.parentElement.parentElement;
                tr.remove(tr)

                idProdutosSelecionados = idProdutosSelecionados.filter(id => id !== id_tr);
            });
        });

        document.querySelectorAll(".td_quantidade").forEach(td => {
            td.classList.add("td_container_input")
            let inputQuantidade = document.createElement("input");
            inputQuantidade.type = "number";
            inputQuantidade.value = 1; // Define o valor inicial como 1
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
            inputDesconto.value = 0; // Define o valor inicial como 0
            inputDesconto.classList.add("input_desconto");
            inputDesconto.addEventListener("input", calcularValorTotal);
            inputDesconto.classList.add("input_tabela");

            td.textContent = ""
            td.appendChild(inputDesconto);
        })

        calcularValorTotal();
    }
    let valorTotalTodosProdutos = 0;
    let descontoTotal = 0
    function calcularValorTotal() {
        let inputsQuantidade = document.querySelectorAll(".input_quantidade");
        let inputsDesconto = document.querySelectorAll(".input_desconto");
        let inputsPrecoVarejo = document.querySelectorAll(".td_preco_varejo");
        let inputsValorTotal = document.querySelectorAll(".td_valor_total");
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

    let formEntradaProduto = document.querySelector("#form_entrada_produto");
    formEntradaProduto.addEventListener("submit", async (e) => {
        e.preventDefault();
        let formData = new FormData(formEntradaProduto);
        let data = Object.fromEntries(formData);

        data.desconto = descontoTotal;
        data.total = valorTotalTodosProdutos;
        data.itens = produtosRelacionados;

        console.log(data);
        if (data.itens.length === 0) {
            popup_erro('É necessário selecionar pelo menos um produto para salvar a entrada.');
            document.querySelector("#btn_adicionar_relacao").style.border = "1px solid red";
            setTimeout(() => {
                document.querySelector("#btn_adicionar_relacao").style.border = "none";
            }, 5000);
            return;
        }
        try {
            popup_carregando(false,'Salvando entrada de produto...');
            const response = await fetch('http://localhost:3000/entrada_produto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            popup_carregando(true)
            if (response.ok) {
                popup_aviso('Entrada salva com sucesso!');
                carregarConteudo("movimentacao_de_estoque/entrada_de_produtos/entrada_de_produtos.html", document.querySelector(".principal"), false, entrada_de_produtos);
            } else {
                popup_erro('Erro: ' + result.erro);
            }
        } catch (err) {
            popup_erro('Erro ao conectar com a API.');
            console.error(err);
        }
    })

    document.querySelector("#btn_voltar_entrada_produtos").addEventListener("click", async () => {
        let formData = new FormData(formEntradaProduto);
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
            if (await popup_confirmar("Tem certeza que deseja voltar? Todos os dados inseridos serão perdidos.")) {
                carregarConteudo("movimentacao_de_estoque/entrada_de_produtos/entrada_de_produtos.html", document.querySelector(".principal"), false, entrada_de_produtos)
            } else {
                return;
            }
        }else {
            carregarConteudo("movimentacao_de_estoque/entrada_de_produtos/entrada_de_produtos.html", document.querySelector(".principal"), false, entrada_de_produtos)
        }
    })
}
