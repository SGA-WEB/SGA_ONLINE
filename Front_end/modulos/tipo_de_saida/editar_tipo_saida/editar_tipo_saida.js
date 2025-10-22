import { dataAtual, aguardarRenderizacao, formatarData } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js"
import { popup, popup_aviso, popup_carregando } from "../../../scripts/popup.js";
// MODIFICADO: Importa o arquivo de 'tipos_de_saida'
import tipos_de_saida from "../tipos_de_saida.js"; // Ajuste o caminho se necessário

// MODIFICADO: Nome da função
export default function editar_tipo_de_saida(dado, telaAnteriorVisualizar) {
    select2("100%")
    
    // MODIFICADO: Seletor do botão voltar
    document.querySelector("#btn_voltar_tipos_de_saida").addEventListener("click", () => {
        // MODIFICADO: Caminho e função de destino
        carregarConteudo("tipo_de_saida/tipos_de_saida.html", document.querySelector(".principal"), false, tipos_de_saida)
    })

    // --- Preenchimento dos dados ---
    document.querySelector(".data_cadastro").innerHTML = formatarData(dado.data_criacao)
    // MODIFICADO: Propriedade do ID (assumindo que mudou no objeto 'dado')
    document.querySelector(".codigo_id").innerHTML = dado.id_tipo_de_saida 
    document.querySelector("#descricao").value = dado.descricao
    document.querySelector("#cfop_dentro").value = dado.cfop_dentro
    document.querySelector("#cfop_fora").value = dado.cfop_fora
    document.querySelector("#ativo").value = dado.ativo

    // MODIFICADO: Seletores de checkbox para bater com o novo HTML
    // Assumi os nomes das propriedades no objeto 'dado'. Ajuste se necessário.
    document.querySelector("#devolução_compra").checked = dado.devolucao_compra 
    document.querySelector("#remessa_conserto").checked = dado.remessa_conserto
    document.querySelector("#trans_filias").checked = dado.trans_filias // ATENÇÃO: Corrija o ID no HTML para 'trans_filias'
    document.querySelector("#baixa_perda_quebra").checked = dado.baixa_perda_quebra
    document.querySelector("#saida_uso_consumo").checked = dado.padrao // Assumindo que 'padrao' é a propriedade para este campo

    
    document.querySelector(".btn_salvar").addEventListener("click", async (e) => {
        // Adicionado: previne o comportamento padrão de submit do formulário
        e.preventDefault(); 
        
        // MODIFICADO: Passa o ID correto
        salvarEdicao(dado.id_tipo_de_saida) 
    })

    // MODIFICADO: Nome do parâmetro da função
    async function salvarEdicao(id_tipo_de_saida) {
        // --- Coleta dos dados ---
        const descricao = document.querySelector("#descricao").value
        const cfop_dentro = document.querySelector("#cfop_dentro").value
        const cfop_fora = document.querySelector("#cfop_fora").value
        const ativo = document.querySelector("#ativo").value

        // MODIFICADO: Coleta dos checkboxes corretos
        const devolucao_compra = document.querySelector("#devolução_compra").checked
        const remessa_conserto = document.querySelector("#remessa_conserto").checked
        const trans_filias = document.querySelector("#trans_filias").checked // ATENÇÃO: Corrija o ID no HTML
        const baixa_perda_quebra = document.querySelector("#baixa_perda_quebra").checked
        const padrao = document.querySelector("#saida_uso_consumo").checked // Campo agora se chama 'saida_uso_consumo'
        
        popup_carregando()
        try {
            // MODIFICADO: Endpoint da API para 'tipos_saida' e ID correto
            const response = await fetch(`http://localhost:3000/tipos_saida/${id_tipo_de_saida}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                // MODIFICADO: Corpo (body) do JSON com as novas propriedades
                body: JSON.stringify({ 
                    descricao, 
                    cfop_dentro, 
                    cfop_fora, 
                    ativo, 
                    devolucao_compra, 
                    remessa_conserto, 
                    trans_filias, 
                    baixa_perda_quebra, 
                    padrao 
                })
            });

            const data = await response.json();

            if (response.ok) {
                // MODIFICADO: Objeto para atualizar a tela de visualizar
                const novoDado = { 
                    id_tipo_de_saida: id_tipo_de_saida,
                    data_criacao: dado.data_criacao, // Mantém a data de criação original
                    descricao: descricao,
                    cfop_fora: cfop_fora,
                    cfop_dentro: cfop_dentro,
                    ativo: ativo,
                    devolucao_compra: devolucao_compra,
                    remessa_conserto: remessa_conserto,
                    trans_filias: trans_filias,
                    baixa_perda_quebra: baixa_perda_quebra,
                    padrao: padrao
                }
                
                popup_carregando(true)
                // MODIFICADO: Caminho e função de destino
                carregarConteudo("tipo_de_saida/tipos_de_saida.html", document.querySelector(".principal"), false, tipos_de_saida, novoDado)
                // MODIFICADO: Mensagem de sucesso
                popup_aviso("Tipo de saída alterado com sucesso!")
            } else {
                alert(`Erro: ${data.error}`);
            }
        } catch (error) {
            console.error('Falha ao conectar com o servidor:', error);
            alert('Erro ao salvar alterações. Tente novamente.');
        }
    }

    document.querySelector(".btn_cancelar").addEventListener("click", () => {
        // MODIFICADO: Caminho e função de destino
        carregarConteudo("tipo_de_saida/tipos_de_saida.html", document.querySelector(".principal"), false, tipos_de_saida, dado)
    })
    
}