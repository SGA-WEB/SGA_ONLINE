import select2 from "../../../scripts/select.js";
import buscarDados from "../../../scripts/buscarDados.js";
import { carregarDadosNaTabela, pesquisar } from "../../../scripts/carregarDadosNaTabela.js";
import { mudarPesquisa } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";

export default async function saida_de_produtos() {
    select2("10rem")
    mudarPesquisa(document.querySelector("#input_pesquisa_tabela"))

    let dados = await buscarDados("saida_produto")
    let colunasExibir = ["ID de Saída", "Tipo de Saída", "Data", "Vendedor", "Cliente", "Produto", "Qtde.", "Valor Un.", "Valor Total", "Status da Saída"]

    carregarDadosNaTabela(dados, colunasExibir)
    pesquisar(dados, colunasExibir)
    document.querySelector("#btn_adicionar").addEventListener("click", ()=> {
        carregarConteudo("movimentacao_de_estoque/saida_de_produto/cadastro_saida_de_produto/cadastro_saida_de_produto.html", document.querySelector(".principal"))
    })
}
