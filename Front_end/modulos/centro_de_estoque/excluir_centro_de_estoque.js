import { popup, popup_aviso, popup_carregando, popup_erro } from "../../scripts/popup.js";
import buscarDados from "../../scripts/buscarDados.js"; // Importa a função que busca os dados da tabela
export default function excluir_centro_de_estoque(dado, callbackFunction, ...param) {
    let codigo_popup_excluir = document.querySelector(".codigo_popup_excluir")
    let item_popup_excluir = document.querySelector(".item_popup_excluir")

    codigo_popup_excluir.innerHTML = dado.id_centro_estoque
    item_popup_excluir.innerHTML = dado.nome_centro_estoque

    let btn_popup_excluir_excluir = document.querySelector("#btn_popup_excluir_excluir")
    let btn_popup_excluir_cancelar = document.querySelector("#btn_popup_excluir_cancelar")

    btn_popup_excluir_excluir.addEventListener("click", async () => {
        popup("fechar", 0, btn_popup_excluir_excluir)
        popup_carregando()
        try {
            const response = await fetch(`http://localhost:3000/centro_estoque/${dado.id_centro_estoque}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            popup_carregando(true)
            if (response.ok) {
                popup_aviso(`Centro de estoque ${dado.nome_centro_estoque} excluído com sucesso!`)
                if (callbackFunction) {
                    callbackFunction(...param) // Chama a função de callback, se existir
                }
                buscarDados('centro_estoque', 4) // Atualiza a tabela de centros de estoque
            } else {
                popup_erro(`Erro ao excluir centro de estoque: ${data.error}`)
            }
        } catch (err) {
            popup_carregando(true)
            popup_erro(`Erro ao excluir centro de estoque: ${dado.nome_centro_estoque}`)
        }
    })
}