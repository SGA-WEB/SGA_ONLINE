import { carregarConteudo, fecharMenu } from "../../scripts/javaScript.js";
import cadastro_tipo_entrada from "./cadastro_tipo_entrada/cadastro_tipo_entrada.js";
import buscarDados from "../../scripts/buscarDados.js";
import { carregarDadosNaTabela, pesquisar } from "../../scripts/carregarDadosNaTabela.js";
import select2 from "../../scripts/select.js";
import { mudarPesquisa } from "../../scripts/funcionalidades.js";
import { popup_carregando } from "../../scripts/popup.js";
import carregarDadosNosCards from "../../scripts/carregarDadosNosCards.js";

export default async function tipos_de_entrada() {
    popup_carregando(false, "Carregando tipos de entrada...");
    let dados = await buscarDados('tipos_entrada')
    const colunas = ["id_tipo_de_entrada", "descricao", "cfop_dentro", "cfop_fora", "ativo"]

    select2("fit-content")
    carregarDadosNaTabela(dados, colunas)
    pesquisar(dados, colunas)
    mudarPesquisa(document.querySelector("#input_pesquisa_tabela"))
    popup_carregando(true)

    let btn_change_view_mode = document.querySelector(".btn_change_view_mode");
    btn_change_view_mode.addEventListener("click", () => {
        if (btn_change_view_mode.classList.contains("table_mode")) {
            const colunasBancoDeDados = colunas
            const colunasExibirNaTabela = ["Id", "Descrição", "CFOP (Dentro)", "CFOP (Fora)", "Ativo"]
            carregarDadosNosCards(dados, colunasBancoDeDados, colunasExibirNaTabela)
            pesquisar(dados, colunasExibirNaTabela, null, true, colunasBancoDeDados)
            btn_change_view_mode.classList.remove("table_mode")
            btn_change_view_mode.classList.add("card_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo tabela"
        } else {
            document.querySelector('.container_tabela').innerHTML = `
                <table class="tabela" id="tabela_tipo_entrada">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" name="selecionar_todos" id="selecionar_todos">
                            </th>
                            <th>Código</th>
                            <th>Descrição</th>
                            <th>CFOP (Dentro)</th>
                            <th>CFOP (Fora)</th>
                            <th>Ativo</th>
                        </tr>
                    </thead>
                    <tbody class="tbody">
                    </tbody>
                </table>
            `
            carregarDadosNaTabela(dados, colunas)
            pesquisar(dados, colunas)
            btn_change_view_mode.classList.remove("card_mode")
            btn_change_view_mode.classList.add("table_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo card"
        }
    })

    document.querySelector("#btn_adicionar_tipos_de_entrada").addEventListener("click", () => {
        carregarConteudo("tipo_de_entrada/cadastro_tipo_entrada/cadastro_tipo_entrada.html", document.querySelector(".principal"), false, cadastro_tipo_entrada, dados)
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
