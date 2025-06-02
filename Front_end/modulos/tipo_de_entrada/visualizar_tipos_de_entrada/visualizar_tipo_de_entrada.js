import { dataAtual, aguardarRenderizacao, formatarData } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import { popup } from "../../../scripts/popup.js";
import select2 from "../../../scripts/select.js"

import editar_tipo_de_entrada from "../editar_tipos_de_entrada/editar_centro_de_estoque.js";
import excluir_tipos_de_entrada from "../excluir_tipos_de_entrada/excluir_centro_de_estoque.js";

export default function visualizar_tipo_de_entrada(dado) {
    select2("100%")
    document.querySelector("#codigo").textContent = dado.codigo_tipo_de_entrada
    document.querySelector("#descricao").value = dado.descricao_tipo_de_entrada
    document.querySelector("#cfop_dentro").value = dado.cfop_dentro
    document.querySelector("#cfop_fora").value = dado.cfop_fora
    document.querySelector("#ativo").value = dado.ativo ? "Sim" : "Não"
    //document.querySelector(".data_cadastro").textContent = formatarData(dado.data_cadastro)

    document.querySelector("#btn_voltar_tipos_de_entrada").addEventListener("click", () => {
        // Botão que volta para a tela de tipos de entrada
        carregarConteudo("tipo_de_entrada/tipos_de_entrada.html", document.querySelector(".principal"))
    })

    document.querySelector(".btn_editar").addEventListener("click", () => {
        carregarConteudo("tipo_de_entrada/editar_tipo_de_entrada/editar_tipo_de_entrada.html", document.querySelector(".principal"), false, editar_tipo_de_entrada, dado, true)
    })

    let btn_excluir = document.querySelector(".btn_excluir")
    btn_excluir.addEventListener("click", () => {
        excluir_tipos_de_entrada(dado, carregarConteudo, "tipo_de_entrada/tipos_de_entrada.html", document.querySelector(".principal"))
    })
}