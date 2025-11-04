import { carregarConteudo, fecharMenu } from "../../scripts/javaScript.js"
import { dataAtual, mudarPesquisa, visibilidadeMenulateral } from "../../scripts/funcionalidades.js"
import buscarDados from "../../scripts/buscarDados.js"
import select2 from "../../scripts/select.js"
import { carregarDadosNaTabela, pesquisar } from "../../scripts/carregarDadosNaTabela.js"
import cadastro_produto from "./cadastro_produto/cadastro_produto.js"
import carregarDadosNosCards from "../../scripts/carregarDadosNosCards.js"

export default async function produto() {
    /*
        Autor: matheushnunes
        Data: 23/02/2025

        Função:
        - Carrega o módulo de produtos;
        - Ao clicar no botão de adicionar produto, o módulo de cadastro de produto é carregado;
        - Exibe os produtos na tela através da busca no servidor;
    */


    let btn_add = document.querySelector("#btn_adicionar")
    btn_add.addEventListener("click", () => {
        carregarConteudo("produto/cadastro_produto/cadastro_produto.html", document.querySelector(".principal"), false, cadastro_produto) // Carrega o módulo de cadastro de produto
    })

    let btn_change_view_mode = document.querySelector(".btn_change_view_mode");
    btn_change_view_mode.addEventListener("click", () => {
        if (btn_change_view_mode.classList.contains("table_mode")) {
            const colunasBancoDeDados = ["id_produto", "produto", "data_de_cadastro", "quantidade", "preco_varejo", "preco_atacado", "corredor", "prateleira"]
            const colunasExibir = ["Id", "Produto", "Data de Cadastro", "Quantidade", "Preço de varejo", "Preço de atacado", "Corredor", "Prateleira"]
            carregarDadosNosCards(dados, colunasBancoDeDados, colunasExibir)
            pesquisar(dados, colunasExibir, null, true, colunasBancoDeDados)
            btn_change_view_mode.classList.remove("table_mode")
            btn_change_view_mode.classList.add("card_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo tabela"
        } else {
            // Exibir modo tabela
            // Cria a tabela novamente e exibe os dados
            document.querySelector('.container_tabela').innerHTML = `
                <table class="tabela" id="tabela_produtos">
                    <thead>
                        <tr>
                            <th class="th_selecionar_todos">
                                <input type="checkbox" name="selecionar_todos" id="selecionar_todos">
                            </th>
                            <th id="tabela_codigo">Código</th>
                            <th id="tabela_produto">Produto</th>
                            <th id="tabela_quantidade">Qtde.</th>
                            <th id="tabela_preco_varejo">Preço Varejo</th>
                            <th id="tabela_preco_atacado">Preço Atacado</th>
                            <th id="corredor">Corredor</th>
                            <th id="prateleira">Prateleira</th>
                        </tr>
                    </thead>
                    <tbody class="tbody">

                    </tbody>
                </table>
            `
            carregarDadosNaTabela(dados, ["id_produto", "produto", "quantidade", "preco_varejo", "preco_atacado", "corredor", "prateleira"])
            pesquisar(dados, ["id_produto", "produto", "quantidade", "preco_varejo", "preco_atacado", "corredor", "prateleira"])
            btn_change_view_mode.classList.remove("card_mode")
            btn_change_view_mode.classList.add("table_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo card"
        }
    })

    mudarPesquisa(document.querySelector(".input_pesquisa"))

    select2("9em")

    let dados = await buscarDados("produto")
    carregarDadosNaTabela(dados, ["id_produto", "produto", "quantidade", "preco_varejo", "preco_atacado", "corredor", "prateleira"])
    pesquisar(dados, ["id_produto", "produto", "quantidade", "preco_varejo", "preco_atacado", "corredor", "prateleira"])

    fecharMenu(document.querySelector(".tabela").offsetWidth, 480)
    window.addEventListener('resize', (e) => {
        if (document.querySelector(".tabela") != null) {
            fecharMenu(document.querySelector(".tabela").offsetWidth, 750)

            visibilidadeMenulateral(document.querySelector(".tabela").offsetWidth, 750)
        }
    })
}

