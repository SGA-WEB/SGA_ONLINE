import select2 from "../../scripts/select.js";
import {carregarConteudo} from "../../scripts/javaScript.js";
import { popup_carregando } from "../../scripts/popup.js";
import buscarDados  from "../../scripts/buscarDados.js";
import { carregarDadosNaTabela, pesquisar } from "../../scripts/carregarDadosNaTabela.js";
import { mudarPesquisa } from "../../scripts/funcionalidades.js";

export default async function tipo_de_saida() {
    select2("fit-content")
    popup_carregando(false, "Carregando tipos de saida...");
    let dados = await buscarDados('tipos_de_saida')
    console.log(dados)
    const colunas = ["id_tipos_de_saida", "descricao", "cfop_dentro", "cfop_fora", "ativo"]

    carregarDadosNaTabela(dados, colunas)
    pesquisar(dados, colunas)
    mudarPesquisa(document.querySelector("#input_pesquisa_tabela"))

    // document.querySelector("#btn_adicionar_tipos_de_saida").addEventListener("click",() => {
    //     carregarConteudo("tipo_de_saida/cadastro_tipo_saida/cadastro_tipo_saida.html", document.querySelector(".principal"), false, cadastro_tipo_saida, dados)
    // })
    popup_carregando(true)
}