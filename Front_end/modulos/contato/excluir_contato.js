export default function excluir_contato(dado) {
    let codigo_popup_excluir = document.querySelector(".codigo_popup_excluir")
    let item_popup_excluir = document.querySelector(".item_popup_excluir")

    codigo_popup_excluir.innerHTML = dado.id_contato
    item_popup_excluir.innerHTML = dado.razao_social
}