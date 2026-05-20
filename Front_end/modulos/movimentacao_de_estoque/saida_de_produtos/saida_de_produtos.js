import { mudarPesquisa } from "../../../scripts/funcionalidades.js";
import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js";
import cadastro_saida_produtos from "./cadastro_saida_produtos/cadastro_saida_produtos.js";
import buscarDados from "../../../scripts/buscarDados.js";
import { carregarDadosNaTabela, pesquisar } from "../../../scripts/carregarDadosNaTabela.js";
import carregarDadosNosCards from "../../../scripts/carregarDadosNosCards.js";

export default async function saida_de_produtos() {
    select2("10rem")
    mudarPesquisa(document.querySelector("#input_pesquisa_tabela"))

    let dados = await buscarDados("saida_produto")
    let colunasExibir = [
        "id_saida_produto",
        "tipo_saida",
        "numero_nf",
        "data_saida",
        "destinatario_razao_social",
        "valor_total",
        "desconto",
        "status"
    ]

    carregarDadosNaTabela(dados, colunasExibir)
    pesquisar(dados, colunasExibir)

    let btn_change_view_mode = document.querySelector(".btn_change_view_mode");
    btn_change_view_mode.addEventListener("click", () => {
        if (btn_change_view_mode.classList.contains("table_mode")) {
            const colunasBancoDeDados = colunasExibir
            const colunasExibirNaTabela = ["Id", "Tipo de Saída", "Número NF", "Data Saída", "Destinatário", "Valor Total", "Desconto", "Status"]
            carregarDadosNosCards(dados, colunasBancoDeDados, colunasExibirNaTabela)
            pesquisar(dados, colunasExibirNaTabela, null, true, colunasBancoDeDados)
            btn_change_view_mode.classList.remove("table_mode")
            btn_change_view_mode.classList.add("card_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo tabela"
        } else {
            document.querySelector('.container_tabela').innerHTML = `
                <table class="tabela" id="tabela_produtos">
                    <thead>
                        <tr>
                            <th class="th_selecionar_todos">
                                <input type="checkbox" name="selecionar_todos" id="selecionar_todos">
                            </th>
                            <th id="tabela_codigo">Código</th>
                            <th id="tabela_tipo_de_saida">Tipo de Saída</th>
                            <th id="tabela_numero_nf">Número NF</th>
                            <th id="tabela_data_saida">Data Saída</th>
                            <th id="tabela_destinatario">Destinatário</th>
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
            "movimentacao_de_estoque/saida_de_produtos/cadastro_saida_produtos/cadastro_saida_produtos.html",
            document.querySelector(".principal"),
            false,
            cadastro_saida_produtos,
            dados
        )
    })

    let widthModulo = document.querySelector(".modulo").offsetWidth;

    window.addEventListener("resize", () => {
        if (document.querySelector(".tabela")) {
            fecharMenu(document.querySelector(".tabela").offsetWidth, 510)
        }

        widthModulo = document.querySelector(".modulo").offsetWidth

        if (widthModulo <= 510 && !btn_change_view_mode.classList.contains("card_mode")) {
            btn_change_view_mode.click()
        }
    })

    if (widthModulo <= 510) {
        btn_change_view_mode.click()
    }
}
