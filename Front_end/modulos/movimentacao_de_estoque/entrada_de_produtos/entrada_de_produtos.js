import buscarDados from "../../../scripts/buscarDados.js";
import { carregarDadosNaTabela, pesquisar } from "../../../scripts/carregarDadosNaTabela.js";
import { mudarPesquisa } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js";
import cadastro_entrada_produtos from "./cadastro_entrada_produtos/cadastro_entrada_produtos.js";

export default async function entrada_de_produtos() {
    select2("10rem")
    mudarPesquisa(document.querySelector("#input_pesquisa_tabela"))

    let dados = await buscarDados("entrada_produto")
    console.log(dados)
    let colunasExibir = ["id_entrada_produto", "tipo_entrada", "numero_nf", "data_recebimento", "fornecedor_razao_social", "valor_total", "desconto", "total", "status" ]

    carregarDadosNaTabela(dados, colunasExibir)
    pesquisar(dados, colunasExibir)

    let btn_adicionar = document.querySelector("#btn_adicionar")
    btn_adicionar.addEventListener("click", () => {
        carregarConteudo(
            "movimentacao_de_estoque/entrada_de_produtos/cadastro_entrada_produtos/cadastro_entrada_produtos.html",
            document.querySelector(".principal"),
            false,
            cadastro_entrada_produtos,
            dados
        )
    })
}
