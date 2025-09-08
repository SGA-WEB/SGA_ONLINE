import { popup, popup_aviso, popup_carregando, popup_erro, popup_confirmar_exclusao } from "../../../scripts/popup.js"
import buscarDados from "../../../scripts/buscarDados.js"
import { carregarDadosNaTabela } from "../../../scripts/carregarDadosNaTabela.js"
import { carregarConteudo } from "../../../scripts/javaScript.js"

export default async function excluir_entrada_de_produtos(dado, callbackFunction, ...param) {
    let confirmacao = await popup_confirmar_exclusao(`Tem certeza que deseja excluir a entrada de produto: ${dado['id_entrada_produto']} ?`)

    if (confirmacao) {
        popup_carregando()
        try {
            const response = await fetch(`http://localhost:3000/entrada_produto/${dado.id_entrada_produto}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            popup_carregando(true)
            if (response.ok) {
                popup_aviso(`entrada de produto ${dado.id_entrada_produto} excluído com sucesso!`)
                await carregarConteudo(
                    "movimentacao_de_estoque/entrada_de_produtos/entrada_de_produtos.html",
                    document.querySelector(".principal")// Não há função de callback para esta ação
                )
                if (callbackFunction) {
                    callbackFunction(...param) // Chama a função de callback, se existir
                }
                let dados = await buscarDados("entrada_produto"); // Busca os dados da tabela, exibe na tela e permite pesquisar
                carregarDadosNaTabela(dados, ["id_entrada_produto", "tipo_entrada", "numero_nf", "data_recebimento", "fornecedor_razao_social", "valor_total", "desconto", "status"])
            } else {
                popup_erro(`Erro ao excluir entrada_de_produtos 1: ${data.error}`)
            }
        } catch (err) {
            popup_carregando(true)
            console.log('Erro ao excluir entrada de produto:', err)
            popup_erro(`Erro ao excluir entrada de produto: ${dado.produto}`)
        }
    }
}
