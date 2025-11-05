import { popup, popup_aviso, popup_carregando, popup_erro, popup_confirmar_exclusao } from "../../../scripts/popup.js"
import buscarDados from "../../../scripts/buscarDados.js"
import { carregarDadosNaTabela } from "../../../scripts/carregarDadosNaTabela.js"
import { carregarConteudo } from "../../../scripts/javaScript.js"
import saida_de_produtos from "./saida_de_produtos.js"

export default async function excluir_saida_de_produtos(dado, callbackFunction, ...param) {
    let confirmacao = await popup_confirmar_exclusao(`Tem certeza que deseja excluir a saida de produto: ${dado['id_saida_produto']} ?`)

    if (confirmacao) {
        popup_carregando()
        try {
            const response = await fetch(`http://localhost:3000/saida_produto/${dado.id_saida_produto}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            popup_carregando(true)
            if (response.ok) {
                popup_aviso(`saida de produto ${dado.id_saida_produto} excluído com sucesso!`)
                await carregarConteudo(
                    "movimentacao_de_estoque/saida_de_produtos/saida_de_produtos.html",
                    document.querySelector(".principal"),
                    false,
                    saida_de_produtos
                )
                if (callbackFunction) {
                    callbackFunction(...param) // Chama a função de callback, se existir
                }
                let dados = await buscarDados("saida_produto"); // Busca os dados da tabela, exibe na tela e permite pesquisar
                carregarDadosNaTabela(
                    dados,
                    [
                        "id_saida_produto",
                        "tipo_saida",
                        "numero_nf",
                        "data_saida",
                        "destinatario_razao_social",
                        "valor_total",
                        "desconto",
                        "status"
                    ]
                )
            } else {
                popup_erro(`Erro ao excluir saida_de_produtos 1: ${data.error}`)
            }
        } catch (err) {
            popup_carregando(true)
            console.log('Erro ao excluir saida de produto:', err)
            popup_erro(`Erro ao excluir saida de produto: ${dado.produto}`)
        }
    }
}
