export default function excluir_produto(dado) {
    let codigo_popup_excluir = document.querySelector(".codigo_popup_excluir")
    let item_popup_excluir = document.querySelector(".item_popup_excluir")

    codigo_popup_excluir.innerHTML = dado.id_produto
    item_popup_excluir.innerHTML = dado.produto
    console.log(dado)
}