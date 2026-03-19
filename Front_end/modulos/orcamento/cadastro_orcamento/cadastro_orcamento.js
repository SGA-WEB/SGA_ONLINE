import { dataAtual, mudarPesquisa } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import buscarDados from "../../../scripts/buscarDados.js";
import { popup, popup_aviso, popup_carregando, popup_confirmar, popup_erro } from "../../../scripts/popup.js";
import { carregarDadosNaTabela, pesquisar } from "../../../scripts/carregarDadosNaTabela.js";
import orcamento from "../orcamento.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";

// Renomeado para refletir o novo contexto de Orçamento
export default async function cadastro_orcamento(dados) {
    select2("100%")
    dataAtual()

    let produtos = await buscarDados("produto")
    let clientes = await buscarDados("contato");
    let usuarios = await buscarDados("usuarios");
    let ultimoIdOrcamento = await buscarDados("proximo_id_orcamento");
    document.querySelector(".codigo_id").textContent = ultimoIdOrcamento.proximo_id;

    let clientesFiltrados = []

    document.querySelector(".btn_voltar").addEventListener("click", () => {
        carregarConteudo("orcamento/orcamento.html", document.querySelector(".principal"))
    })

    clientes.forEach(contato => {
        contato.categorias.forEach(categoria => {
            if (categoria.nome === "CLIENTE") {
                clientesFiltrados.push(contato)
            }
        })
    })

    let selectCliente = document.querySelector("#cliente_id");
    clientesFiltrados.forEach((cliente) => {
        let option = document.createElement("option");
        option.value = cliente.id_contato;
        option.text = cliente.razao_social;
        selectCliente.appendChild(option);
    })

    let selectCriadoPor = document.querySelector("#criado_por_id");
    usuarios.forEach((usuario) => {
        let option = document.createElement("option");
        option.value = usuario.id_usuario;
        option.text = usuario.nome;
        selectCriadoPor.appendChild(option);
    })

    produtos = produtos.sort((a, b) => a.id_produto - b.id_produto);

    // Adiciona o campo valor_total e o desconto em cada produto
    produtos.map(produto => {
        produto.valor_total = produto.preco_varejo * produto.quantidade;
        produto.desconto = 0;
    })

    let btn_adicionar_relacao = document.querySelector("#btn_adicionar_relacao");
    btn_adicionar_relacao.addEventListener("click", async () => {
        // Quando o botão de adicionar relação for clicado
        popup("abrir", 0, btn_adicionar_relacao)
        carregarDadosNaTabela(
            produtos,
            ["id_produto", "produto", "quantidade","preco_varejo"],
            document.querySelector("#tabela_selecionar_produtos"),
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
        // Lógica para selecionar produtos e carregar na tabela principal (#tabela_produtos)
        let checkboxProdutoSelecionados = document.querySelectorAll("#tabela_selecionar_produtos .checkbox_selecionar_linha:checked");
        idProdutosSelecionados = []
        checkboxProdutoSelecionados.forEach(checkbox => {
            idProdutosSelecionados.push(
                checkbox.id.replace("checkbox_", "")
            )
        })

        let novosDados = produtos.filter(produto => {
            return idProdutosSelecionados.includes(produto.id_produto.toString())
        })

        // Limpa e popula produtosRelacionados (mantendo a lógica de valor/desconto inicial)
        produtosRelacionados = []
        novosDados.forEach(produto => {
            // No Orçamento, 'preco_varejo' provavelmente será o 'valor_unitario' inicial
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
                let id_tr = e.currentTarget.parentElement.parentElement.id.replace("tr_", "");
                let tr = e.currentTarget.parentElement.parentElement;
                tr.remove(tr)

                idProdutosSelecionados = idProdutosSelecionados.filter(id => id !== id_tr);
                produtosRelacionados = produtosRelacionados.filter(produto => {return produto.id_produto !== parseInt(id_tr)});
                calcularValorTotal();
            });
        });

        // Adiciona inputs de Quantidade
        document.querySelectorAll(".td_quantidade").forEach(td => {
            td.classList.add("td_container_input")
            let inputQuantidade = document.createElement("input");
            inputQuantidade.type = "number";
            inputQuantidade.value = 1;
            // ATENÇÃO: Se for Orçamento, o max deveria ser o estoque (produto.quantidade).
            // Manter a lógica anterior:
            inputQuantidade.max = td.textContent; // O valor da célula é a quantidade em estoque
            inputQuantidade.min = 1;
            inputQuantidade.classList.add("input_quantidade");
            inputQuantidade.classList.add("input_tabela");
            inputQuantidade.addEventListener("input", calcularValorTotal);

            td.textContent = ""
            td.appendChild(inputQuantidade);
        })

        // Adiciona inputs de Desconto
        document.querySelectorAll(".td_desconto").forEach(td => {
            td.classList.add("td_container_input")
            let inputDesconto = document.createElement("input");
            inputDesconto.type = "number";
            inputDesconto.value = 0;
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
    let subtotal = 0; // valor antes do desconto
    function calcularValorTotal() {
        let inputsQuantidade = document.querySelectorAll(".input_quantidade");
        let inputsDesconto = document.querySelectorAll(".input_desconto");
        let inputsPrecoVarejo = document.querySelectorAll(".td_preco_varejo");
        let inputsValorTotal = document.querySelectorAll(".td_valor_total");
        // Reseta os valores antes de calcular para evitar acumulação incorreta
        valorTotalTodosProdutos = 0;
        descontoTotal = 0;
        subtotal = 0

        inputsQuantidade.forEach((input, index) => {
            let precoVarejo = inputsPrecoVarejo[index].textContent;
            let quantidade = input.value;
            let desconto = inputsDesconto[index].value;
            let valorTotal = (precoVarejo * quantidade) - desconto;

            // Atualiza os valores na interface e no acumulador
            inputsPrecoVarejo[index].value = precoVarejo;
            inputsQuantidade[index].value = quantidade;
            inputsDesconto[index].value = desconto;
            inputsValorTotal[index].textContent = valorTotal.toFixed(2)

            valorTotalTodosProdutos += valorTotal;
            subtotal += precoVarejo * quantidade;
            descontoTotal += parseFloat(desconto.replace(",", ".")) * 1;

            // Atualiza o objeto produtosRelacionados com os valores atualizados
            produtosRelacionados[index].quantidade = quantidade;
            produtosRelacionados[index].desconto = desconto;
            produtosRelacionados[index].valor_unitario = precoVarejo; // Garantir que o valor unitário no objeto é o valor inicial
        });

    }

    let formOrcamento = document.querySelector("#form_orcamento");
    formOrcamento.addEventListener("submit", async (e) => {
        e.preventDefault();
        let formData = new FormData(formOrcamento);
        let data = Object.fromEntries(formData);

        data.desconto_total = descontoTotal;
        data.subtotal = subtotal;
        data.itens = produtosRelacionados;

        console.log(data)

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
            const response = await fetch('http://localhost:3000/orcamento', {
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
                carregarConteudo("orcamento/orcamento.html", document.querySelector(".principal"), false, orcamento);
            } else {
                popup_erro('Erro: ' + result.erro);
            }
        } catch (err) {
            popup_erro('Erro ao conectar com a API.');
            console.error(err);
        }
    })
}
