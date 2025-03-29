import { dataAtual, esperarCarregarConteudo } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js"
import visualizar_centro_de_estoque from "../visualizar_centro_de_estoque/visualizar_centro_de_estoque.js";

export default function editar_centro_de_estoque(dado, telaAnterior) {
    esperarCarregarConteudo(moduloCarregado)

    function moduloCarregado() {
        console.log(dado)
        select2("100%")
        dataAtual()
        document.querySelector("#nome_centro_de_estoque").value = dado.descricao_centro_estoque
        document.querySelector("#localizacao").value = dado.localizacao_centro_estoque
        document.querySelector("#padrao_centro_de_estoque").value = dado.padrao_centro_estoque ? "Sim" : "Não"
        document.querySelector("#descricao").value = dado.descricao_centro_estoque

        if (telaAnterior === "visualizar_centro_de_estoque") {
            document.querySelector("#btn_voltar_produtos").addEventListener("click", () => {
                carregarConteudo("centro_de_estoque/visualizar_centro_de_estoque/visualizar_centro_de_estoque.html", document.querySelector(".principal"), visualizar_centro_de_estoque)
            })
        } else {
            document.querySelector("#btn_voltar_produtos").addEventListener("click", () => {
                // Botão que volta para a tela de centro de estoque
                carregarConteudo("centro_de_estoque/centro_de_estoque.html", document.querySelector(".principal"))
            })
        }

        document.querySelector(".btn_salvar").addEventListener("click", () => { 
            carregarConteudo("centro_de_estoque/centro_de_estoque.html", document.querySelector(".principal"))
        })

        document.querySelector(".btn_cancelar").addEventListener("click", () => {
            carregarConteudo("centro_de_estoque/centro_de_estoque.html", document.querySelector(".principal"))
        })
    }
}