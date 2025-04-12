import { popup, popup_carregando, popup_aviso, popup_erro } from "../../scripts/popup.js"
import buscarDados from "../../scripts/buscarDados.js"

export default function excluir_contato(dado) {
    let codigo_popup_excluir = document.querySelector(".codigo_popup_excluir")
    let item_popup_excluir = document.querySelector(".item_popup_excluir")
    console.log(dado)
    codigo_popup_excluir.innerHTML = dado.id_contato
    item_popup_excluir.innerHTML = dado.razao_social

    btn_popup_excluir_excluir.addEventListener("click", async () => {
        popup("fechar", 0, btn_popup_excluir_excluir)
        popup_carregando()
        try {
            const response = await fetch(`http://localhost:3000/contato/${dado.id_contato}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            popup_carregando(true)
            if (response.ok) {
                popup_aviso(`Centro de estoque ${dado.id_contato} excluído com sucesso!`)
                if (callbackFunction) {
                    callbackFunction(...param) // Chama a função de callback, se existir
                }
                buscarDados('contato', 5) // Atualiza a tabela de contato
            } else {
                popup_erro(`Erro ao excluir prodtuoi 1: ${data.error}`)
            }
        } catch (err) {
            console.log(err)
            popup_carregando(true)
            popup_erro(`Erro ao excluir centro de estoque 2: ${dado.descricao_contato}`)
        }
    })
}