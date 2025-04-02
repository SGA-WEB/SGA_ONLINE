import { carregarConteudo } from "../../../scripts/javaScript.js"
import select2 from "../../../scripts/select.js"
import editar_produto from "../editar_produto/editar_produto.js"
import excluir_produto from "../excluir_produto.js"
import popup from "../../../scripts/popup.js"
import { dataAtual } from "../../../scripts/funcionalidades.js"

export default function visualizar_produto (dado) {
    select2("10rem")
    let codigo_produto = document.querySelector('.codigo_id')
    let valor_varejo = document.querySelector('#valor_varejo')
    let valor_atacado = document.querySelector('#valor_atacado')
    let nome_produto = document.querySelector('#nome_produto')
    let quantidade_em_estoque = document.querySelector('#quantidade_em_estoque')

    codigo_produto.textContent = dado.id_produto
    valor_varejo.value = dado.preco_varejo
    valor_atacado.value = dado.preco_atacado
    nome_produto.value = dado.produto
    quantidade_em_estoque.value = dado.quantidade

    let btnVoltar = document.querySelector('.btn_voltar')
    btnVoltar.addEventListener('click', () => {
        carregarConteudo("produto/produto.html", document.querySelector('.principal'))
    })

    document.querySelector("#btn_voltar_produtos").addEventListener("click", () => {
        // Botão que volta para a tela de centro de estoque
        carregarConteudo("produto/produto.html", document.querySelector(".principal"))
    })

    document.querySelector(".btn_editar").addEventListener("click", () => {
        carregarConteudo("produto/editar_produto/editar_produto.html", document.querySelector(".principal"),editar_produto, false, dado, true)
    })

    let btn_excluir = document.querySelector(".btn_excluir")
    btn_excluir.addEventListener("click",() => {
        popup("abrir", 0, btn_excluir)
        excluir_produto(dado)
    })
}