import { dataAtual, esperarCarregarConteudo } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js"

export default function visualizar_centro_de_estoque(dado) {
    esperarCarregarConteudo(moduloCarregado)

    function moduloCarregado() {
        // {id_centro_estoque: 2, descricao_centro_estoque: 'Principal', localizacao_centro_estoque: 'Corredor 3', padrao_centro_estoque: true}
        select2("100%")
        dataAtual()
        document.querySelector("#nome_centro_de_estoque").value = dado.descricao_centro_estoque
        document.querySelector("#localizacao").value = dado.localizacao_centro_estoque
        document.querySelector("#padrao_centro_de_estoque").value = dado.padrao_centro_estoque ? "Sim" : "Não"
        document.querySelector("#descricao").value = dado.descricao_centro_estoque

        document.querySelector("#btn_voltar_produtos").addEventListener("click", () => {
            // Botão que volta para a tela de centro de estoque
            carregarConteudo("centro_de_estoque/centro_de_estoque.html", document.querySelector(".principal"))
        })
    }
}