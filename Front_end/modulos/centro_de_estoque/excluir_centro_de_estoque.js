export default function excluir_centro_de_estoque(dado){
    // {id_centro_estoque: 2, descricao_centro_estoque: 'Principal', localizacao_centro_estoque: 'Corredor 3', padrao_centro_estoque: true}
    
    let codigo_popup_excluir = document.querySelector(".codigo_popup_excluir")
    let item_popup_excluir = document.querySelector(".item_popup_excluir")

    codigo_popup_excluir.innerHTML = dado.id_centro_estoque
    item_popup_excluir.innerHTML = dado.descricao_centro_estoque
}