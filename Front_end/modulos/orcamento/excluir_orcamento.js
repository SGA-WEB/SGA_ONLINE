import { popup, popup_aviso, popup_carregando, popup_erro, popup_confirmar_exclusao } from "../../scripts/popup.js";
import buscarDados from "../../scripts/buscarDados.js"; // Importa a função que busca os dados da tabela
import { carregarDadosNaTabela } from "../../scripts/carregarDadosNaTabela.js";
import carregarDadosNosCards from "../../scripts/carregarDadosNosCards.js";
import { carregarConteudo } from "../../scripts/javaScript.js";
export default async function excluir_orcamento(dado, callbackFunction, ...param) {
    console.log(dado)
    let confirmacao = await popup_confirmar_exclusao(`Tem certeza que deseja excluir o orcamento ${dado['id_orcamento']} do ${dado['cliente_razao_social']}?`)

    if (confirmacao) {
        popup_carregando()
        try {
            const response = await fetch(`http://localhost:3000/orcamento/${dado.id_orcamento}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            popup_carregando(true)
            if (response.ok) {
                popup_aviso(`orcamento ${dado.id_orcamento} excluído com sucesso!`)
                if (callbackFunction) {
                    callbackFunction(...param) // Chama a função de callback, se existir
                }
                let dados = await buscarDados('orcamento'); // Busca os dados da tabela, exibe na tela e permite pesquisar
                if (document.querySelector("tbody")) {
                    carregarConteudo("orcamento/orcamento.html", document.querySelector(".principal"))
                } else {
                }
            }
        } catch (err) {
            popup_carregando(true)
            console.log('Erro ao excluir orcamento:', err)
            popup_erro(`Erro ao excluir orcamento: ${dado.id_orcamento}`)
        }
    }
}
