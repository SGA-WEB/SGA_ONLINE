// Função que minimiza o menu lateral:
import { btnMenuLateral, carregarConteudo, fecharMenu } from "../../scripts/javaScript.js"
import buscarDados from "../../scripts/buscarDados.js"
import { mudarPesquisa } from "../../scripts/funcionalidades.js"
import select2 from "../../scripts/select.js"
import cadastro_contato from "./cadastro_contato/cadastro_contato.js"

export default function contato() {
    let input_pesquisa = document.querySelector(".input_pesquisa")
    // Fecha o menu lateral se a tela tiver menos de 480px de largura no resize
    fecharMenu(document.querySelector(".tabela").offsetWidth,480)
    window.addEventListener('resize', (e) => {
        if (document.querySelector(".tabela") != null){
            fecharMenu(document.querySelector(".tabela").offsetWidth, 480)
        } 
    })

    // Inicializa o select2
    select2("140px")
    // Botão pesquisar:
    mudarPesquisa(input_pesquisa)

    // Botão criar contato:
    let btn_criar_contato = document.querySelector("#btn_criar_contato")
    btn_criar_contato.addEventListener("click", async ()=>{
        await carregarConteudo("contato/cadastro_contato/nav_contato.html", document.querySelector(".principal")) // carrega o menu de navegação superior do cadastro de contato

        carregarConteudo(
            "contato/cadastro_contato/criar_contato/criar_contato.html",
            document.querySelector(".modulo"),
            false,
            cadastro_contato, 
        )
    })
    buscarDados("sga.contato") // Busca os dados da tabela, exibe na tela e permite pesquisar
}
