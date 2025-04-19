import { popup, popup_carregando, popup_aviso, popup_erro } from "../../scripts/popup.js"
import buscarDados from "../../scripts/buscarDados.js"
import { carregarDadosNaTabela } from "../../scripts/carregarDadosNaTabela.js"

export default function excluir_contato(dado, callbackFunction, ...param) {
    let codigo_popup_excluir = document.querySelector(".codigo_popup_excluir")
    let item_popup_excluir = document.querySelector(".item_popup_excluir")
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
                popup_aviso(`Centro de estoque ${dado.razao_social} excluído com sucesso!`)
                if (callbackFunction) {
                    callbackFunction(...param) // Chama a função de callback, se existir
                }
                let dados = await buscarDados('contato') // Atualiza a tabela de contato
                carregarDadosNaTabela(dados, ["id_contato", "razao_social", "nome_fantasia", "fone1", "tipo_pessoa"]) // Exibe na tela e permite pesquisar
            } else {
                popup_erro(`Erro ao excluir produto 1: ${data.error}`)
            }
        } catch (err) {
            console.log(err)
            popup_carregando(true)
            popup_erro(`Erro ao excluir centro de estoque 2: ${dado.descricao_contato}`)
        }
    })
}