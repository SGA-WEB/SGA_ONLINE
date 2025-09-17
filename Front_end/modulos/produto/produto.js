import { carregarConteudo, fecharMenu } from "../../scripts/javaScript.js"
import { dataAtual, mudarPesquisa, visibilidadeMenulateral } from "../../scripts/funcionalidades.js"
import buscarDados from "../../scripts/buscarDados.js"
import select2 from "../../scripts/select.js"
import {carregarDadosNaTabela, pesquisar} from "../../scripts/carregarDadosNaTabela.js"

export default async function produto () {
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

    let dados = await buscarDados("produto")
    carregarDadosNaTabela(dados, ["id_produto", "produto", "quantidade","preco_varejo", "preco_atacado","corredor", "prateleira"])
    pesquisar(dados, ["id_produto", "produto", "quantidade","preco_varejo", "preco_atacado","corredor", "prateleira"])

    fecharMenu(document.querySelector(".tabela").offsetWidth,480)
    window.addEventListener('resize', (e) => {
        if (document.querySelector(".tabela") != null){
            fecharMenu(document.querySelector(".tabela").offsetWidth, 750)

            visibilidadeMenulateral(document.querySelector(".tabela").offsetWidth, 750)
        } 
    })  
}

