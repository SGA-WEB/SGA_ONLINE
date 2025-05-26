import { carregarConteudo } from "../../scripts/javaScript.js";
import cadastro_tipo_entrada from "./cadastro_tipo_entrada/cadastro_tipo_entrada.js";
import buscarDados from "../../scripts/buscarDados.js";
import { carregarDadosNaTabela } from "../../scripts/carregarDadosNaTabela.js";

export default async function tipos_de_entrada () {
    document.querySelector("#btn_adicionar_tipos_de_entrada").addEventListener("click",() => {
        carregarConteudo("lista_cadastro_entrada/cadastro_tipo_entrada/cadastro_tipo_entrada.html", document.querySelector(".principal"), false, cadastro_tipo_entrada)
    })

    let dados = await buscarDados('tipos_entrada')
    carregarDadosNaTabela(dados, ["codigo", "descricao", "cpop_dentro","cpop_fora","ativo"])
}