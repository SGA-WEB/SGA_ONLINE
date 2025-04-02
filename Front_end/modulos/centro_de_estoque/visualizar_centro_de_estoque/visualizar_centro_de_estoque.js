import { dataAtual, aguardarRenderizacao } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import popup from "../../../scripts/popup.js";
import select2 from "../../../scripts/select.js"

import editar_centro_de_estoque from "../editar_centro_de_estoque/editar_centro_de_estoque.js"
import excluir_centro_de_estoque from "../excluir_centro_de_estoque.js";

export default function visualizar_centro_de_estoque(dado) {
    select2("100%")
    dataAtual()
    
    document.querySelector("#nome_centro_de_estoque").value = dado.descricao_centro_estoque
    document.querySelector("#localizacao").value = dado.localizacao_centro_estoque
    document.querySelector("#padrao_centro_de_estoque").value = dado.padrao_centro_estoque ? "Sim" : "Não"
    document.querySelector("#descricao").value = dado.descricao_centro_estoque

    document.querySelector("#btn_voltar_centro_de_estoque").addEventListener("click", () => {
        // Botão que volta para a tela de centro de estoque
        carregarConteudo("centro_de_estoque/centro_de_estoque.html", document.querySelector(".principal"))
    })

    document.querySelector(".btn_editar").addEventListener("click", () => {
        carregarConteudo("centro_de_estoque/editar_centro_de_estoque/editar_centro_de_estoque.html", document.querySelector(".principal"), false, editar_centro_de_estoque, dado, true)
    })

    let btn_excluir = document.querySelector(".btn_excluir")
    btn_excluir.addEventListener("click",() => {
        popup("abrir", 0, btn_excluir)
        excluir_centro_de_estoque(dado)
    })
}