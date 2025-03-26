// Função que minimiza o menu lateral:
import { btnMenuLateral, carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import buscarDados from "../../../scripts/buscarDados.js"
import { mudarPesquisa } from "../../../scripts/funcionalidades.js"
import select2 from "../../../scripts/select.js"

export default function contato() {
    /*
        * Função que fecha o menu lateral se a tela tiver menos de 480px de largura
        * e muda o nome da coluna de código na tabela
    */
   
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
    btn_criar_contato.addEventListener("click",()=>{
        carregarConteudo("contato/cadastro_contato/criar_contato/criar_contato.html",document.querySelector(".principal"))
    })

    buscarDados("sga.contato") // Busca os dados da tabela, exibe na tela e permite pesquisar
}
