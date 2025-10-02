// import buscarDados from "../../../scripts/buscarDados.js";
// import { carregarDadosNaTabela, pesquisar } from "../../../scripts/carregarDadosNaTabela.js";
import { mudarPesquisa } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js";
import cadastro_saida_produtos from "./cadastro_saida_produtos/cadastro_saida_produtos.js";
import  buscarDados from "../../../scripts/buscarDados.js";
import { carregarDadosNaTabela, pesquisar } from "../../../scripts/carregarDadosNaTabela.js";


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
    let btn_adicionar = document.querySelector("#btn_adicionar")
    btn_adicionar.addEventListener("click", () => {
        console.log("clicou")
        carregarConteudo(
            "movimentacao_de_estoque/saida_de_produtos/cadastro_saida_produtos/cadastro_saida_produtos.html",
            document.querySelector(".principal"),
            false,
            cadastro_saida_produtos,
            // dados
        )
    })
}
