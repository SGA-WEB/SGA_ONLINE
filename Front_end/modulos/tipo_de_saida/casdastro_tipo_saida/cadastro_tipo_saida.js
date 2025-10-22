import { carregarConteudo } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js";
import { popup_aviso, popup_carregando, popup_erro } from "../../../scripts/popup.js"; // MODIFICADO: Adicionei popup_erro que faltava no seu import original
import tipos_de_saida from "../tipo_de_saida.js"; // MODIFICADO: Importa o arquivo de 'saida'
import { dataAtual } from "../../../scripts/funcionalidades.js";

// MODIFICADO: Nome da função e do parâmetro
export default function cadastro_tipo_saida(tipos_saidas) {
    select2("100%")
    // dataAtual() // Você tinha essa chamada, mas não parecia usá-la. Mantive comentada.

    let ultimoId = 0; // MODIFICADO: Inicia com 0 caso a lista esteja vazia
    // MODIFICADO: Loop e propriedade do ID
    tipos_saidas.forEach(saida => {
        if (saida.id_tipo_de_saida > ultimoId) {
             ultimoId = saida.id_tipo_de_saida;
        }
    });

    const novoId = ultimoId + 1;
    // MODIFICADO: Seletor do campo de código e define o .value
    const campoCodigo = document.querySelector("#codigo");
    campoCodigo.value = novoId;
    campoCodigo.disabled = true; // Boa prática desabilitar o campo de ID

    // MODIFICADO: Seletor do botão voltar
    document.querySelector("#btn_voltar_tipos_de_saida").addEventListener("click", () => {
        // MODIFICADO: Caminho e módulo de destino
        carregarConteudo("tipo_de_saida/tipos_de_saida.html", document.querySelector(".principal"), false, tipos_de_saida);
    })

    let form = document.querySelector("form")
    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        // MODIFICADO: Mensagem do popup
        popup_carregando(false, "Salvando tipo de saída...");
        
        // MODIFICADO: Objeto 'data' para bater com os campos do novo HTML
        const data = {
            id_tipo_de_saida: novoId,
            descricao: document.getElementById('descricao').value,
            cfop_dentro: document.getElementById('cfop_dentro').value,
            cfop_fora: document.getElementById('cfop_fora').value,
            ativo: document.getElementById('ativo').value === "true",
            // Novos campos de checkbox
            devolucao_compra: document.getElementById('devolução_compra').checked,
            remessa_conserto: document.getElementById('remessa_conserto').checked,
            trans_filias: document.getElementById('trans_filias').checked, // ATENÇÃO: Corrija o ID no HTML!
            baixa_perda_quebra: document.getElementById('baixa_perda_quebra').checked,
            padrao: document.getElementById('saida_uso_consumo').checked // Assumi que 'saida_uso_consumo' é o 'padrao'
        };

        try {
            // MODIFICADO: Endpoint da API para 'tipos_saida'
            const response = await fetch('http://localhost:3000/tipos_saida', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            popup_carregando(true)
            
            if (response.ok) {
                popup_aviso('Cadastro feito com sucesso!');
                // MODIFICADO: Caminho e módulo de destino
                carregarConteudo("tipo_de_saida/tipos_de_saida.html", document.querySelector(".principal"), false, tipos_de_saida)
            } else {
                const erro = await response.json();
                popup_erro('Erro ao cadastrar: ' + (erro.message || 'Erro desconhecido'));
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            popup_erro('Erro ao conectar com o servidor.');
        }
    })
}