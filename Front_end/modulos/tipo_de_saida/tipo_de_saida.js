import select2 from "../../scripts/select.js";
import { carregarConteudo, fecharMenu } from "../../scripts/javaScript.js";
import { popup_carregando } from "../../scripts/popup.js";
import buscarDados from "../../scripts/buscarDados.js";
import { carregarDadosNaTabela, pesquisar } from "../../scripts/carregarDadosNaTabela.js";
import { mudarPesquisa } from "../../scripts/funcionalidades.js";
import cadastro_tipo_saida from "../tipo_de_saida/casdastro_tipo_saida/cadastro_tipo_saida.js";
import carregarDadosNosCards from "../../scripts/carregarDadosNosCards.js";

export default async function tipo_de_saida() {
    select2("fit-content")
    popup_carregando(false, "Carregando tipos de saida...");
    let dados = await buscarDados('tipos_de_saida')
    const colunas = ["id_tipos_de_saida", "descricao", "cfop_dentro", "cfop_fora", "ativo"]

    carregarDadosNaTabela(dados, colunas)
    pesquisar(dados, colunas)
    mudarPesquisa(document.querySelector("#input_pesquisa_tabela"))

    document.querySelector("#btn_adicionar_tipos_de_saida").addEventListener("click", () => {
        carregarConteudo("tipo_de_saida/casdastro_tipo_saida/cadastro_tipo_saida.html", document.querySelector(".principal"), false, cadastro_tipo_saida, dados);
    })

    let btn_change_view_mode = document.querySelector(".btn_change_view_mode");
    btn_change_view_mode.addEventListener("click", () => {
        if (btn_change_view_mode.classList.contains("table_mode")) {
            const colunasBancoDeDados = ["id_tipos_de_saida", "descricao", "cfop_dentro", "cfop_fora", "ativo"]
            const colunasExibir = ["Código", "Descrição", "CFOP(Dentro)", "CFOP(Fora)", "Ativo"]
            carregarDadosNosCards(dados, colunasBancoDeDados, colunasExibir)
            pesquisar(dados, colunasExibir, null, true, colunasBancoDeDados)
            btn_change_view_mode.classList.remove("table_mode")
            btn_change_view_mode.classList.add("card_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo tabela"
        } else {
            document.querySelector('.container_tabela').innerHTML = `
                <table class="tabela" id="tabela_tipo_saida">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" name="selecionar_todos" id="selecionar_todos">
                            </th>
                            <th>Código</th>
                            <th>Descrição</th>
                            <th>CFOP(Dentro)</th>
                            <th>CFOP(Fora)</th>
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

    popup_carregando(true)
}
