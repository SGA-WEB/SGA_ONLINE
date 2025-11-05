import { popup_aviso, popup_carregando, popup_erro, popup_confirmar } from "../../scripts/popup.js";
import buscarDados from "../../scripts/buscarDados.js"; // Importa a função que busca os dados da tabela
import { carregarDadosNaTabela } from "../../scripts/carregarDadosNaTabela.js";

export default async function excluir_tipo_saida(dado, callbackFunction, ...param) {
    let confirmacao = await popup_confirmar(`Tem certeza que deseja excluir o tipo de saida ${dado.id_tipos_de_saida} - ${dado.descricao}?`)

    if (confirmacao) {
        popup_carregando()
        try {
            const response = await fetch(`http://localhost:3000/tipos_de_saida/${dado.id_tipos_de_saida}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            popup_carregando(true)
            if (response.ok) {
                popup_aviso(`Tipo de saida ${dado.descricao} excluído com sucesso!`)
                if (callbackFunction) {
                    callbackFunction(...param) // Chama a função de callback, se existir
                } 
                let dados = await buscarDados('tipos_de_saida'); // Busca os dados da tabela, exibe na tela e permite pesquisar
                console.log(dados)
                carregarDadosNaTabela(dados, ["id_tipos_de_saida", "descricao", "cfop_dentro","cfop_fora","ativo"]) // Exibe na tela e permite pesquisar
            }
        } catch (err) {
            popup_carregando(true)
            console.log('Erro ao excluir tipo de saida:', err)
            popup_erro(`Erro ao excluir tipo de saida: ${dado.descricao} - ${err.message}`);
        }
    }
}
