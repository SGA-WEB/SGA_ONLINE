import { popup_aviso, popup_carregando, popup_erro, popup_confirmar_exclusao } from "../../../scripts/popup.js";

export default async function excluir_tipos_de_entrada(dado, callbackFunction, ...param) {
    let confirmacao = await popup_confirmar_exclusao(`Tem certeza que deseja excluir o tipo de entrada ${dado.id_tipo_de_entrada} - ${dado.descricao}?`)

    if (confirmacao) {
        popup_carregando()
        try {
            const response = await fetch(`http://localhost:3000/tipos_entrada/${dado.id_tipo_de_entrada}`, {
                method: 'DELETE'
            });
            popup_carregando(true)
            if (response.ok) {
                popup_aviso(`Tipo de entrada ${dado.descricao} excluído com sucesso!`)
                document.querySelector(`#tr_${dado.id_tipo_de_entrada}`)?.remove();
                if (callbackFunction) {
                    callbackFunction(...param)
                }
            }
        } catch (err) {
            popup_carregando(true)
            console.log('Erro ao excluir tipo de entrada:', err)
            popup_erro(`Erro ao excluir tipo de entrada: ${dado.descricao} - ${err.message}`);
        }
    }
}
