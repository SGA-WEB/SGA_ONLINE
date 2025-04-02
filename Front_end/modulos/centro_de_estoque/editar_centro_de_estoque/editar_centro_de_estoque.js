import { dataAtual, aguardarRenderizacao } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js"
import visualizar_centro_de_estoque from "../visualizar_centro_de_estoque/visualizar_centro_de_estoque.js";
import centro_de_estoque from "../centro_de_estoque.js";

export default function editar_centro_de_estoque(dado, telaAnteriorVisualizar) {
    let caminho = "centro_de_estoque/centro_de_estoque.html"
    let funcao = centro_de_estoque

    if (telaAnteriorVisualizar) {
        // se a tela anterior for a de visualizar deve voltar
        // o caminho e a função é mudada para ir para tela de visualizar
        caminho = "centro_de_estoque/visualizar_centro_de_estoque/visualizar_centro_de_estoque.html"
        funcao = visualizar_centro_de_estoque
    }

    select2("100%")
    dataAtual()
    document.querySelector("#nome_centro_de_estoque").value = dado.descricao_centro_estoque
    document.querySelector("#localizacao").value = dado.localizacao_centro_estoque
    document.querySelector("#padrao_centro_de_estoque").value = dado.padrao_centro_estoque ? "Sim" : "Não"
    document.querySelector("#descricao").value = dado.descricao_centro_estoque

    document.querySelector("#btn_voltar_produtos").addEventListener("click", () => {
        carregarConteudo(caminho, document.querySelector(".principal"), funcao, false, dado)
    })

    document.querySelector(".btn_salvar").addEventListener("click", () => { 
        carregarConteudo("centro_de_estoque/centro_de_estoque.html", document.querySelector(".principal"), centro_de_estoque, false, dado)
    })

    document.querySelector(".btn_cancelar").addEventListener("click", () => {
        carregarConteudo(caminho, document.querySelector(".principal"),false, funcao, dado)
    })
}