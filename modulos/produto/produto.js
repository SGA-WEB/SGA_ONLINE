import { carregarConteudo } from "../../scripts/javaScript.js"
import { dataAtual, mudarPesquisa } from "../../scripts/funcionalidades.js"
export default function produto () {
    let btn_add = document.querySelector("#btn_adicionar")
    btn_add.addEventListener("click",() => {
     carregarConteudo("produto/cadastro_produto/cadastro_produto.html",  document.querySelector(".principal"))
     let intervalo = setInterval(() => { //verifica se o modulo foi carregado
        if (document.querySelector(".modulo")) {
            dataAtual() // Pega a data atual e adiciona ao input
            $('.campo_select').select2({ 
                width: '100%', // Muda o tamanho do select 2
                minimumResultsForSearch: Infinity, // Retira o campo de pesquisa
            });
            document.querySelector("#btn_voltar_produtos").addEventListener("click", () => {
                carregarConteudo("produto/produto.html", document.querySelector(".principal"))
            })
            clearInterval(intervalo)
        }
     }, 100);
    })
    mudarPesquisa(document.querySelector(".input_pesquisa"))
}

