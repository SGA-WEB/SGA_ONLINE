import { carregarConteudo } from "../../scripts/javaScript.js"
import { dataAtual, mudarPesquisa } from "../../scripts/funcionalidades.js"
import buscarDados from "../../scripts/buscarDados.js"
import select2 from "../../scripts/select.js"
export default function produto () {
    /*
        Autor: matheushnunes
        Data: 23/02/2025

        Função:
        - Carrega o módulo de produtos;
        - Ao clicar no botão de adicionar produto, o módulo de cadastro de produto é carregado;
        - Exibe os produtos na tela através da busca no servidor;
    */


    let btn_add = document.querySelector("#btn_adicionar")
    btn_add.addEventListener("click",() => {
     carregarConteudo("produto/cadastro_produto/cadastro_produto.html",  document.querySelector(".principal")) // Carrega o módulo de cadastro de produto

     let intervalo = setInterval(() => { //verifica se o modulo foi carregado
        if (document.querySelector(".modulo")) {
            dataAtual() // Pega a data atual e adiciona ao input
            select2("100%") // Inicializa o select2 como 100% da largura
            document.querySelector("#btn_voltar_produtos").addEventListener("click", () => {
                // Botão que volta para a tela de produtos
                carregarConteudo("produto/produto.html", document.querySelector(".principal"))
            })
            document.querySelector(".btn_salvar").addEventListener("click", () => {
                // Botão que salva o produto
                alert("Produto salvo com sucesso!")
                carregarConteudo("produto/produto.html", document.querySelector(".principal"))
            })

            clearInterval(intervalo)
        }
     }, 100);
    })
    mudarPesquisa(document.querySelector(".input_pesquisa"))
    select2("9em")

    buscarDados("sga.produto") // Busca os dados da tabela, exibe na tela e permite pesquisar
}

