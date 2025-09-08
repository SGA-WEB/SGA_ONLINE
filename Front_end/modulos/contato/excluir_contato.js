import { popup, popup_carregando, popup_aviso, popup_erro, popup_confirmar } from "../../scripts/popup.js"
import buscarDados from "../../scripts/buscarDados.js"
import { carregarDadosNaTabela } from "../../scripts/carregarDadosNaTabela.js"

export default async function excluir_contato(dado, callbackFunction, ...param) {
    let confirmacao = await popup_confirmar(`Tem certeza que deseja excluir o contato ${dado['id_contato']} - ${dado['razao_social']}?`)

    if (confirmacao) {
        popup_carregando()
        try {
            const response = await fetch(`http://localhost:3000/contato/${dado.id_contato}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            popup_carregando(true)
            if (response.ok) {
                popup_aviso(`contato ${dado.razao_social} excluído com sucesso!`)
                if (callbackFunction) {
                    callbackFunction(...param) // Chama a função de callback, se existir
                }
                let dados = await buscarDados('contato'); // Busca os dados da tabela, exibe na tela e permite pesquisar
                carregarDadosNaTabela(dados, ["id_contato", "razao_social", "nome_fantasia", "fone1", "tipo_pessoa"])
            } else {
                popup_erro(`Erro ao excluir produto 1: ${data.error}`)
            }
        } catch (err) {
            popup_carregando(true)
            console.log('Erro ao excluir contato:', err)
            popup_erro(`Erro ao excluir contato: ${dado.contato}`)
        }
    }
}
