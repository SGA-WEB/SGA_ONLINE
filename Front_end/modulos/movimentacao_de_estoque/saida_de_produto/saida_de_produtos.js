import buscarDados from "../../../scripts/buscarDados.js";
import { carregarDadosNaTabela, pesquisar } from "../../../scripts/carregarDadosNaTabela.js";
import { mudarPesquisa } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js";
import cadastro_saida_de_produto from "./cadastro_saida_de_produto/cadastro_saida_de_produto.js";

export default async function saida_de_produtos() {
    select2("10rem");
    mudarPesquisa(document.querySelector("#input_pesquisa_tabela"));

    let dados = await buscarDados("saida_produto");
    // Usar nomes das propriedades do objeto retornado, para que o carregarDadosNaTabela funcione corretamente.
    let colunasExibir = [
        "id_saida_produto", 
        "tipo_saida", 
        "data_saida", 
        "vendedor_nome", 
        "cliente_nome", 
        "produto_nome", 
        "quantidade", 
        "valor_unitario", 
        "valor_total", 
        "status_saida"
    ];

    carregarDadosNaTabela(dados, colunasExibir);
    pesquisar(dados, colunasExibir);

    let btn_adicionar = document.querySelector("#btn_adicionar");
    btn_adicionar.addEventListener("click", () => {
        carregarConteudo(
            "movimentacao_de_estoque/saida_de_produto/cadastro_saida_de_produto/cadastro_saida_de_produto.html",
            document.querySelector(".principal"),
            false,
            cadastro_saida_de_produto,
            dados
        );
    });
}
