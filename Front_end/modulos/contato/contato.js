import { btnMenuLateral, carregarConteudo, fecharMenu } from "../../scripts/javaScript.js"
import buscarDados from "../../scripts/buscarDados.js"
import { dataAtual, mudarPesquisa } from "../../scripts/funcionalidades.js"
import select2 from "../../scripts/select.js"
import cadastro_contato from "./cadastro_contato/cadastro_contato.js"
import { carregarDadosNaTabela, pesquisar } from "../../scripts/carregarDadosNaTabela.js"
import carregarDadosNosCards from "../../scripts/carregarDadosNosCards.js"

export default async function contato() {
    let input_pesquisa = document.querySelector(".input_pesquisa")

    select2("140px")
    mudarPesquisa(input_pesquisa)
    dataAtual()

    let btn_criar_contato = document.querySelector("#btn_criar_contato")
    btn_criar_contato.addEventListener("click", async () => {
        carregarConteudo(
            "contato/cadastro_contato/cadastro_contato.html",
            document.querySelector(".modulo"),
            false,
            cadastro_contato,
        )
    })

    const dadosContato = await buscarDados("contato");
    dadosContato.forEach(c => {
        c.classificacao = Array.isArray(c.categorias)
            ? c.categorias.map(cat => cat.nome).join(", ")
            : "";
    });
    const colunas = ["id_contato", "razao_social", "nome_fantasia", "fone1", "tipo_pessoa", "classificacao"]
    carregarDadosNaTabela(dadosContato, colunas)
    pesquisar(dadosContato, colunas)

    function marcarClassificacaoCard() {
        document.querySelectorAll(".card_chave").forEach(chave => {
            if (chave.textContent === "Classificação") {
                chave.closest(".card_info").classList.add("card_info--classificacao")
            }
        })
    }

    let btn_change_view_mode = document.querySelector(".btn_change_view_mode");
    btn_change_view_mode.addEventListener("click", () => {
        if (btn_change_view_mode.classList.contains("table_mode")) {
            const colunasBancoDeDados = ["id_contato", "razao_social", "fone1", "tipo_pessoa", "classificacao"]
            const colunasExibir = ["Código", "Razão Social", "Fone 1", "Tipo Pessoa", "Classificação"]
            carregarDadosNosCards(dadosContato, colunasBancoDeDados, colunasExibir)
            marcarClassificacaoCard()
            pesquisar(dadosContato, colunasExibir, null, true, colunasBancoDeDados)
            btn_change_view_mode.classList.remove("table_mode")
            btn_change_view_mode.classList.add("card_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo tabela"
        } else {
            document.querySelector('.container_tabela').innerHTML = `
                <table class="tabela" id="tabela_contatos">
                    <thead>
                        <tr>
                            <th class="th_selecionar_todos">
                                <input type="checkbox" name="selecionar_todos" id="selecionar_todos">
                            </th>
                            <th id="tabela_codigo">Código</th>
                            <th id="tabela_razao">Razão Social</th>
                            <th id="tabela_nome">Nome Fantasia</th>
                            <th id="tabela_fone">Fone 1</th>
                            <th id="tabela_categoria">Tipo Pessoa</th>
                            <th id="tabela_classificacao">Classificação</th>
                        </tr>
                    </thead>
                    <tbody class="tbody">
                    </tbody>
                </table>
            `
            carregarDadosNaTabela(dadosContato, colunas)
            pesquisar(dadosContato, colunas)
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
