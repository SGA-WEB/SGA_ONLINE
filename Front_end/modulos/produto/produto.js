import { carregarConteudo, fecharMenu } from "../../scripts/javaScript.js"
import { dataAtual, mudarPesquisa, visibilidadeMenulateral } from "../../scripts/funcionalidades.js"
import buscarDados from "../../scripts/buscarDados.js"
import select2 from "../../scripts/select.js"
import { carregarDadosNaTabela, pesquisar } from "../../scripts/carregarDadosNaTabela.js"
import cadastro_produto from "./cadastro_produto/cadastro_produto.js"
import carregarDadosNosCards from "../../scripts/carregarDadosNosCards.js"

export default async function produto() {
    let btn_add = document.querySelector("#btn_adicionar")
    btn_add.addEventListener("click", () => {
        carregarConteudo("produto/cadastro_produto/cadastro_produto.html", document.querySelector(".principal"), false, cadastro_produto)
    })

    let btn_change_view_mode = document.querySelector(".btn_change_view_mode");
    
    // Definição das colunas para evitar repetição
    const colunasBD = ["id_produto", "produto", "quantidade", "preco_varejo", "preco_atacado", "corredor", "prateleira"];
    const colunasExibir = ["Id", "Produto", "Quantidade", "Preço Varejo", "Preço Atacado", "Corredor", "Prateleira"];

    btn_change_view_mode.addEventListener("click", () => {
        if (btn_change_view_mode.classList.contains("table_mode")) {
            // MODO CARD
            carregarDadosNosCards(dados, colunasBD, colunasExibir)
            pesquisar(dados, colunasExibir, null, true, colunasBD)
            
            btn_change_view_mode.classList.replace("table_mode", "card_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo tabela"
        } else {
            // MODO TABELA
            document.querySelector('.container_tabela').innerHTML = `
                <table class="tabela" id="tabela_produtos">
                    <thead>
                        <tr>
                            <th class="th_selecionar_todos"><input type="checkbox" id="selecionar_todos"></th>
                            <th>Código</th>
                            <th>Produto</th>
                            <th>Qtde.</th>
                            <th>Preço Varejo</th>
                            <th>Preço Atacado</th>
                            <th>Corredor</th>
                            <th>Prateleira</th>
                        </tr>
                    </thead>
                    <tbody class="tbody"></tbody>
                </table>`;
            
            carregarDadosNaTabela(dados, colunasBD)
            pesquisar(dados, colunasBD)
            
            btn_change_view_mode.classList.replace("card_mode", "table_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo card"
        }
    })

    mudarPesquisa(document.querySelector(".input_pesquisa"))
    select2("9em")

    let dados = await buscarDados("produto")
    carregarDadosNaTabela(dados, colunasBD)
    pesquisar(dados, colunasBD)

    fecharMenu(document.querySelector(".tabela").offsetWidth, 480)

    window.addEventListener('resize', () => {
        const tabela = document.querySelector(".tabela");
        if (tabela) {
            fecharMenu(tabela.offsetWidth, 750)
            visibilidadeMenulateral(tabela.offsetWidth, 750)
        }
        
        let widthModulo = document.querySelector(".modulo").offsetWidth
        if (widthModulo <= 840 && !btn_change_view_mode.classList.contains("card_mode")) {
            btn_change_view_mode.click()
        }
    })

    if (document.querySelector(".modulo").offsetWidth <= 840) {
        btn_change_view_mode.click()
    }
}