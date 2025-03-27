import { mudarPesquisa } from "../../scripts/funcionalidades.js";
import buscarDados from "../../scripts/buscarDados.js";
import select2 from "../../scripts/select.js";
import { carregarConteudo } from "../../scripts/javaScript.js";
import { dataAtual } from "../../scripts/funcionalidades.js";
export default function centro_de_estoque() {
    mudarPesquisa(document.querySelector(".input_pesquisa"));
    select2("120px");
    buscarDados('sga.centro_estoque'); // Busca os dados da tabela, exibe na tela e permite pesquisar

    let btnAdicionar = document.querySelector("#btn_adicionar_centro_de_estoque");
    btnAdicionar.addEventListener("click",() => {
        carregarConteudo("centro_de_estoque/cadastro_centro_de_estoque/cadastro_centro_de_estoque.html",  document.querySelector(".principal")) // Carrega o módulo de cadastro de produto
   
        let intervalo = setInterval(() => { //verifica se o modulo foi carregado
           if (document.querySelector(".modulo")) {
               dataAtual() // Pega a data atual e adiciona ao input
               select2("100%") // Inicializa o select2 como 100% da largura
               document.querySelector("#btn_voltar_produtos").addEventListener("click", () => {
                   // Botão que volta para a tela de produtos
                   carregarConteudo("centro_de_estoque/centro_de_estoque.html", document.querySelector(".principal"))
               })
               document.querySelector(".btn_salvar").addEventListener("click", () => {
                   // Botão que salva o centro_de_estoque
                   alert("centro_de_estoque salvo com sucesso!")
                   carregarConteudo("centro_de_estoque/centro_de_estoque.html", document.querySelector(".principal"))
               })
   
               clearInterval(intervalo)
           }
        }, 100);
    })
}