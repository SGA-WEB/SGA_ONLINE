import { popup, popup_aviso, popup_carregando, popup_erro, popup_confirmar_exclusao } from "../../scripts/popup.js";
import buscarDados from "../../scripts/buscarDados.js"; // Importa a função que busca os dados da tabela
import { carregarDadosNaTabela } from "../../scripts/carregarDadosNaTabela.js";
import carregarDadosNosCards from "../../scripts/carregarDadosNosCards.js";

export default async function excluir_centro_de_estoque(dado, callbackFunction, ...param) {
    let confirmacao = await popup_confirmar_exclusao(`Tem certeza que deseja excluir o centro de estoque ${dado['id_centro_estoque']} - ${dado['nome_centro_estoque']}?`)

    if (confirmacao) {
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
                let dados = await buscarDados('centro_estoque'); // Busca os dados da tabela, exibe na tela e permite pesquisar
                if (document.querySelector("tbody")) {
                    carregarDadosNaTabela(dados, ["id_centro_estoque", "nome_centro_estoque", "localizacao_centro_estoque", "padrao_centro_estoque"]) // Exibe na tela e permite pesquisar
                } else {
                    carregarDadosNosCards(dados, ["id_centro_estoque", "nome_centro_estoque", "data_cadastro", "localizacao_centro_estoque", "padrao_centro_estoque"], ["id", "nome", "Data de Cadastro", "Localização", "Padrão"])
                }
            }
        } catch (err) {
            popup_carregando(true)
            console.log('Erro ao excluir centro de estoque:', err)
            popup_erro(`Erro ao excluir centro de estoque: ${dado.nome_centro_estoque}`)
        }
    }
}
