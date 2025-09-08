import { popup, popup_aviso, popup_carregando, popup_erro, popup_confirmar } from "../../scripts/popup.js";
import buscarDados from "../../scripts/buscarDados.js"; // Importa a função que busca os dados da tabela
import { carregarDadosNaTabela } from "../../scripts/carregarDadosNaTabela.js";

export default async function excluir_tipos_de_entrada(dado, callbackFunction, ...param) {
    let confirmacao = await popup_confirmar(`Tem certeza que deseja excluir o tipo de entrada ${dado['id_tipo_entrada']} - ${dado['nome_tipo_entrada']}?`)

    if (confirmacao) {
        popup_carregando()
        try {
            const response = await fetch(`http://localhost:3000/tipos_entrada/${dado.id_tipo_entrada}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            popup_carregando(true)
            if (response.ok) {
                popup_aviso(`Tipo de entrada ${dado.nome_tipo_entrada} excluído com sucesso!`)
                if (callbackFunction) {
                    callbackFunction(...param) // Chama a função de callback, se existir
                }
                let dados = await buscarDados('tipos_entrada'); // Busca os dados da tabela, exibe na tela e permite pesquisar
                carregarDadosNaTabela(dados, ["id_tipo_entrada", "nome_tipo_entrada", "cfop_dentro", "cfop_fora", "ativo"]) // Exibe na tela e permite pesquisar
            }
        } catch (err) {
            popup_carregando(true)
            console.log('Erro ao excluir tipo de entrada:', err)
            popup_erro(`Erro ao excluir tipo de entrada: ${dado.nome_tipo_entrada} - ${err.message}`);
        }
    }
}
