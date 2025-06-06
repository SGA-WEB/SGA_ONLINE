import { dataAtual, mudarPesquisa } from "../../../../scripts/funcionalidades.js";
import select2 from "../../../../scripts/select.js";
import buscarDados from "../../../../scripts/buscarDados.js";
import { carregarConteudo } from "../../../../scripts/javaScript.js";
import entrada_de_produtos from "../entrada_de_produtos.js";
import { popup, popup_confirmar } from "../../../../scripts/popup.js";
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

    document.querySelector(".codigo_id").textContent = ultimoIdProduto + 1

    fornecedores.forEach(fornecedor => {
        let option = document.createElement("option");
        option.value = fornecedor.fornecedor_id;
        option.text = fornecedor.fornecedor_razao_social;
        document.querySelector("#fornecedor").appendChild(option);
    });

    let btn_adicionar_relacao = document.querySelector("#btn_adicionar_relacao");
    btn_adicionar_relacao.addEventListener("click", async () => {
        popup("abrir", 0, btn_adicionar_relacao)
        carregarDadosNaTabela(
            produtos,
            ["id_produto", "produto", "quantidade","preco_varejo", "preco_atacado"],
            document.querySelector("#tabela_selecionar_produtos"),
            false
        )
        pesquisar(
            produtos,
            ["id_produto", "produto", "quantidade","preco_varejo", "preco_atacado"],
            document.querySelector("#tabela_selecionar_produtos"),
            false
        )
        mudarPesquisa(document.querySelector(".input_pesquisa"),"#select_coluna")
        select2("200px")
    })

    let btn_selecionar_relacao = document.querySelector(".btn_selecionar_relacao");
    let idProdutoSelecionados = []
    btn_selecionar_relacao.addEventListener("click", () => {
        let produtoSelecionados = document.querySelectorAll(".checkbox_selecionar_linha:checked");

        produtoSelecionados.forEach(checkbox => {
            idProdutoSelecionados.push(checkbox.id.replace("checkbox_", ""))
        })

        let novosDados = produtos.filter(produto => {
            return idProdutoSelecionados.includes(produto.id_produto.toString())
        })

        carregarDadosNaTabela(novosDados, ["id_produto", "produto", "quantidade","preco_varejo", "preco_atacado"], document.querySelector("#tabela_produtos"), true)

        popup("fechar", 0, btn_selecionar_relacao)
    })


    let formEntradaProduto = document.querySelector("#form_entrada_produto");
    formEntradaProduto.addEventListener("submit", async (e) => {
        e.preventDefault();
        let formData = new FormData(formEntradaProduto);
        let data = Object.fromEntries(formData);

        // Converter campos numéricos corretamente
        console.log(data);
        data.fornecedor = parseInt(data.fornecedor);
        data.valor_total = parseFloat(data.valor_total);
        data.desconto = parseFloat(data.desconto || 0);
        data.total = parseFloat(data.total);

        console.log(data);
        try {
            const response = await fetch('http://localhost:3000/entrada_produto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                alert('Entrada salva com sucesso!');
                form.reset();
            } else {
                alert('Erro: ' + result.erro);
            }
        } catch (err) {
            alert('Erro ao conectar com a API.');
            console.error(err);
        }
    })

    document.querySelector("#btn_voltar_entrada_produtos").addEventListener("click", async () => {
        let formData = new FormData(formEntradaProduto);
        let data = Object.fromEntries(formData);
        let dadosPreenchidos = false

        for (let key in data) {
            if (data[key] === "") {
                data[key] = null;
            }
            if (data[key] !== null) {
                dadosPreenchidos = true;
            }
        }
        if (idProdutoSelecionados.length > 0 || dadosPreenchidos) {
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
