import { carregarConteudo } from "../../scripts/javaScript.js";
import cadastro_tipo_entrada from "./cadastro_tipo_entrada/cadastro_tipo_entrada.js";
import buscarDados from "../../scripts/buscarDados.js";
import { carregarDadosNaTabela } from "../../scripts/carregarDadosNaTabela.js";
import select2 from "../../scripts/select.js";
import { pesquisar } from "../../scripts/carregarDadosNaTabela.js";
import { mudarPesquisa } from "../../scripts/funcionalidades.js";
import { popup_carregando } from "../../scripts/popup.js";

export default async function tipos_de_entrada () {
    popup_carregando(false, "Carregando tipos de entrada...");
    let dados = await buscarDados('tipos_entrada')
    const colunas = ["id_tipo_de_entrada", "descricao", "cfop_dentro", "cfop_fora", "ativo"]

    select2("fit-content")
    carregarDadosNaTabela(dados, colunas)
    pesquisar(dados, colunas)
    mudarPesquisa(document.querySelector("#input_pesquisa_tabela"))

    document.querySelector("#btn_adicionar_tipos_de_entrada").addEventListener("click",() => {
        carregarConteudo("tipo_de_entrada/cadastro_tipo_entrada/cadastro_tipo_entrada.html", document.querySelector(".principal"), false, cadastro_tipo_entrada, dados)
    })
    popup_carregando(true)
}
