import { mudarPesquisa } from "../../scripts/funcionalidades.js";
import buscarDados from "../../scripts/buscarDados.js";
import select2 from "../../scripts/select.js";
import { carregarConteudo, fecharMenu } from "../../scripts/javaScript.js";
import { dataAtual } from "../../scripts/funcionalidades.js";
import { carregarDadosNaTabela, pesquisar } from "../../scripts/carregarDadosNaTabela.js";
import carregarDadosNosCards from "../../scripts/carregarDadosNosCards.js";

export default async function orcamento() {
    mudarPesquisa(document.querySelector(".input_pesquisa"));
    select2("120px");
    let dados = await buscarDados('orcamento'); // Busca os dados da tabela, exibe na tela e permite pesquisar
    console.log(dados)
    let colunas = ["cliente_id", "cliente_razao_social", "status", "criado_por_nome", "data_criacao","valor_total","desconto_total","subtotal"]
    carregarDadosNaTabela(dados, colunas, document.querySelector(".tabela"), true, true) // Exibe na tela e permite pesquisar
    pesquisar(dados, colunas, document.querySelector(".tabela"), true, true)

    // let btnAdicionar = document.querySelector("#btn_adicionar_centro_de_estoque");
    // btnAdicionar.addEventListener("click", () => {
    //     carregarConteudo("centro_de_estoque/cadastro_centro_de_estoque/cadastro_centro_de_estoque.html", document.querySelector(".principal"), false, cadastro_centro_de_estoque) // Carrega o módulo de cadastro de produto
    // })

    window.addEventListener("resize", () => {
        fecharMenu(document.querySelector(".tabela").offsetWidth, 510)
    })
}
