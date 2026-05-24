import { mudarPesquisa } from "../../scripts/funcionalidades.js";
import buscarDados from "../../scripts/buscarDados.js";
import select2 from "../../scripts/select.js";
import { carregarConteudo, fecharMenu } from "../../scripts/javaScript.js";
import { dataAtual } from "../../scripts/funcionalidades.js";
import { carregarDadosNaTabela, pesquisar } from "../../scripts/carregarDadosNaTabela.js";
import carregarDadosNosCards from "../../scripts/carregarDadosNosCards.js";
import cadastro_orcamento from "../orcamento/cadastro_orcamento/cadastro_orcamento.js";

export default async function orcamento() {
    mudarPesquisa(document.querySelector(".input_pesquisa"));
    select2("120px");
    let dados = await buscarDados('orcamento'); // Busca os dados da tabela, exibe na tela e permite pesquisar
    let colunas = ["id_orcamento", "cliente_razao_social", "status", "criado_por_nome", "data_criacao","subtotal","desconto_total","valor_total"]
    carregarDadosNaTabela(dados, colunas, document.querySelector(".tabela"), true, true) // Exibe na tela e permite pesquisar
    pesquisar(dados, colunas, document.querySelector(".tabela"), true, true)

    let btnAdicionar = document.querySelector("#btn_criar_orcamento");
    btnAdicionar.addEventListener("click", () => {
        carregarConteudo("orcamento/cadastro_orcamento/cadastro_orcamento.html", document.querySelector(".principal"), false, cadastro_orcamento, dados)
    })

    let btn_change_view_mode = document.querySelector(".btn_change_view_mode");
    btn_change_view_mode.addEventListener("click", () => {
        if (btn_change_view_mode.classList.contains("table_mode")) {
            const colunasBancoDeDados = ["id_orcamento", "cliente_razao_social", "status", "criado_por_nome", "data_criacao", "subtotal", "desconto_total", "valor_total"]
            const colunasExibir = ["Código", "Cliente", "Status", "Criado por", "Criado em", "Subtotal", "Desconto", "Total"]
            carregarDadosNosCards(dados, colunasBancoDeDados, colunasExibir)
            pesquisar(dados, colunasExibir, null, true, colunasBancoDeDados)
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
                            <th id="codigo">Código</th>
                            <th id="cliente">Cliente</th>
                            <th id="status">Status</th>
                            <th id="criado_por">Criado por:</th>
                            <th id="criado_em">Criado em:</th>
                            <th id="total">Total</th>
                            <th id="desconto">Desconto:</th>
                            <th id="subtotal">Subtotal:</th>
                        </tr>
                    </thead>
                    <tbody class="tbody">
                    </tbody>
                </table>
            `
            carregarDadosNaTabela(dados, colunas, document.querySelector(".tabela"), true, true)
            pesquisar(dados, colunas, document.querySelector(".tabela"), true, true)
            btn_change_view_mode.classList.remove("card_mode")
            btn_change_view_mode.classList.add("table_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo card"
        }
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
