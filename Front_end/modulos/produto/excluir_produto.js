import { popup, popup_aviso, popup_carregando, popup_erro, popup_confirmar, popup_confirmar_exclusao } from "../../scripts/popup.js"
import buscarDados from "../../scripts/buscarDados.js"
import { carregarDadosNaTabela } from "../../scripts/carregarDadosNaTabela.js"

export default async function excluir_produto(dado, callbackFunction, ...param) {
    let confirmacao = await popup_confirmar_exclusao(`Tem certeza que deseja excluir o produto ${dado['id_produto']} - ${dado['produto']}?`)

    if (confirmacao) {
        popup_carregando()
        try {
            const response = await fetch(`http://localhost:3000/produto/${dado.id_produto}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            popup_carregando(true)
            if (response.ok) {
                popup_aviso(`produto ${dado.produto} excluído com sucesso!`)
                if (callbackFunction) {
                    callbackFunction(...param) // Chama a função de callback, se existir
                }
                let dados = await buscarDados('produto'); // Busca os dados da tabela, exibe na tela e permite pesquisar
                carregarDadosNaTabela(dados, ["id_produto", "produto", "quantidade","preco_varejo", "preco_atacado","corredor", "prateleira"])
            } else {
                popup_erro(`Erro ao excluir produto 1: ${data.error}`)
            }
        } catch (err) {
            popup_carregando(true)
            console.log('Erro ao excluir produto:', err)
            popup_erro(`Erro ao excluir produto: ${dado.produto}`)
        }
    }
}
