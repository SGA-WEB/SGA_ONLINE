import { mudarPesquisa } from "../../scripts/funcionalidades.js";
import buscarDados from "../../scripts/buscarDados.js";
import select2 from "../../scripts/select.js";
import { carregarConteudo, fecharMenu } from "../../scripts/javaScript.js";
import { dataAtual } from "../../scripts/funcionalidades.js";
import { carregarDadosNaTabela, pesquisar } from "../../scripts/carregarDadosNaTabela.js";
import cadastro_centro_de_estoque from "./cadastro_centro_de_estoque/cadastro_centro_de_estoque.js";
import carregarDadosNosCards from "../../scripts/carregarDadosNosCards.js";

export default async function centro_de_estoque() {
    mudarPesquisa(document.querySelector(".input_pesquisa"));
    select2("120px");
    let dados = await buscarDados('centro_estoque'); // Busca os dados da tabela, exibe na tela e permite pesquisar

    carregarDadosNaTabela(dados, ["id_centro_estoque", "nome_centro_estoque", "localizacao_centro_estoque", "padrao_centro_estoque"]) // Exibe na tela e permite pesquisar
    pesquisar(dados, ["id_centro_estoque", "nome_centro_estoque", "localizacao_centro_estoque", "padrao_centro_estoque"])

    let btn_change_view_mode = document.querySelector(".btn_change_view_mode");
    btn_change_view_mode.addEventListener("click", () => {
        if (btn_change_view_mode.classList.contains("table_mode")) {
            carregarDadosNosCards(dados, ["id_centro_estoque", "nome_centro_estoque", "data_cadastro", "localizacao_centro_estoque", "padrao_centro_estoque"], ["id", "nome", "Data de Cadastro", "Localização", "Padrão"])
            btn_change_view_mode.classList.remove("table_mode")
            btn_change_view_mode.classList.add("card_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo tabela"
        } else {
            // Exibir modo tabela
            // Cria a tabela novamente e exibe os dados
            document.querySelector('.container_tabela').innerHTML = `
                    <table class="tabela" id="tabela_centro_estoque">
                    <thead>
                        <tr>
                            <th class="th_selecionar_todos">
                                <input type="checkbox" name="selecionar_todos" id="selecionar_todos" />
                            </th>
                            <th id="tabela_codigo">Código</th>
                            <th id="tabela_descricao">Nome</th>
                            <th id="tabela_localizacao">Localização</th>
                            <th id="tabela_padrao">Padrão</th>
                        </tr>
                    </thead>
                    <tbody class="tbody tbody_centro_estoque">

                    </tbody>
                </table>
            `
            carregarDadosNaTabela(dados, ["id_centro_estoque", "nome_centro_estoque", "localizacao_centro_estoque", "padrao_centro_estoque"])
            pesquisar(dados, ["id_centro_estoque", "nome_centro_estoque", "localizacao_centro_estoque", "padrao_centro_estoque"])
            btn_change_view_mode.classList.remove("card_mode")
            btn_change_view_mode.classList.add("table_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo card"
        }
    })

    let btnAdicionar = document.querySelector("#btn_adicionar_centro_de_estoque");
    btnAdicionar.addEventListener("click", () => {
        carregarConteudo("centro_de_estoque/cadastro_centro_de_estoque/cadastro_centro_de_estoque.html", document.querySelector(".principal"), false, cadastro_centro_de_estoque) // Carrega o módulo de cadastro de produto
    })

    window.addEventListener("resize", () => {
        fecharMenu(document.querySelector(".tabela").offsetWidth, 510)
    })
}
