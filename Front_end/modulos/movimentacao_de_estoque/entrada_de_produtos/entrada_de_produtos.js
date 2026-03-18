import buscarDados from "../../../scripts/buscarDados.js";
import { carregarDadosNaTabela, pesquisar } from "../../../scripts/carregarDadosNaTabela.js";
import { mudarPesquisa } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js";
import cadastro_entrada_produtos from "./cadastro_entrada_produtos/cadastro_entrada_produtos.js";
import carregarDadosNosCards from "../../../scripts/carregarDadosNosCards.js";
import { fecharMenu } from "../../../scripts/javaScript.js";

export default async function entrada_de_produtos() {
    select2("10rem")
    mudarPesquisa(document.querySelector("#input_pesquisa_tabela"))

    let dados = await buscarDados("entrada_produto")
    let colunasExibir = ["id_entrada_produto", "tipo_entrada", "numero_nf", "data_recebimento", "fornecedor_razao_social", "valor_total", "desconto", "status"]

    carregarDadosNaTabela(dados, colunasExibir)
    pesquisar(dados, colunasExibir)

    let btn_change_view_mode = document.querySelector(".btn_change_view_mode");
    btn_change_view_mode.addEventListener("click", () => {
        if (btn_change_view_mode.classList.contains("table_mode")) {
            const colunasBancoDeDados = colunasExibir
            const colunasExibirNaTabela = ["Id", "Tipo de Entrada", "Número NF", "Data Recebimento", "Fornecedor", "Valor Total", "Desconto", "Status"]
            carregarDadosNosCards(dados, colunasBancoDeDados, colunasExibirNaTabela)
            pesquisar(dados, colunasExibirNaTabela, null, true, colunasBancoDeDados)
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
                            <th id="tabela_tipo_de_entrada">Tipo de Entrada</th>
                            <th id="tabela_numero_nf">Número NF</th>
                            <th id="tabela_data_recebimento">Data recebimento</th>
                            <th id="tabela_fornecedor">Fornecedor</th>
                            <th id="tabela_valor_total">Valor total</th>
                            <th id="tabela_desconto">Desconto</th>
                            <th id="tabela_status">Status</th>
                        </tr>
                    </thead>
                    <tbody class="tbody">

                    </tbody>
                </table>
            `
            carregarDadosNaTabela(dados, colunasExibir)
            pesquisar(dados, colunasExibir)
            btn_change_view_mode.classList.remove("card_mode")
            btn_change_view_mode.classList.add("table_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo card"
        }
    })

    let btn_adicionar = document.querySelector("#btn_adicionar")
    btn_adicionar.addEventListener("click", () => {
        carregarConteudo(
            "movimentacao_de_estoque/entrada_de_produtos/cadastro_entrada_produtos/cadastro_entrada_produtos.html",
            document.querySelector(".principal"),
            false,
            cadastro_entrada_produtos,
            dados
        )
    })

    let widthModulo = document.querySelector(".modulo").offsetWidth;

    window.addEventListener("resize", () => {
        if (document.querySelector(".tabela")) {
            fecharMenu(document.querySelector(".tabela").offsetWidth, 510)
        }

        widthModulo = document.querySelector(".modulo").offsetWidth

        // Mostra o modo card quando o body for menor que 600px
        if (widthModulo <= 510 && !btn_change_view_mode.classList.contains("card_mode")) {
            btn_change_view_mode.click()
        }
    })

    // Assim que a tela é carregada se o body for menor que 510px mostra a tabela em modo card
    if (widthModulo <= 510) {
        btn_change_view_mode.click()
    }
}
