import { carregarConteudo } from "../../../scripts/javaScript.js";
import { popup_aviso, popup_carregando, popup_erro } from "../../../scripts/popup.js";
import select2 from "../../../scripts/select.js";
import { dataAtual } from "../../../scripts/funcionalidades.js";
import tipo_de_saida from "../tipo_de_saida.js";
import buscarDados from "../../../scripts/buscarDados.js";

export default async function cadastro_tipo_saida() {
    select2("100%")
    dataAtual()

    let proximo_id_tipos_de_saida = await buscarDados('proximo_id_tipos_de_saida');
    document.querySelector(".codigo_id").innerHTML = proximo_id_tipos_de_saida.proximo_id;

    document.querySelector("#btn_voltar_tipos_de_saida").addEventListener("click", () => {
        carregarConteudo("tipo_de_saida/tipo_de_saida.html", document.querySelector(".principal"), false, tipo_de_saida);
    })

    let btn_salvar = document.querySelector("form")
    btn_salvar.addEventListener("submit", async (e) => {
        e.preventDefault()

        // Validação das checkboxes
        const checkboxes = document.querySelectorAll('.checkbox_opcao');
        const algumaMarcada = Array.from(checkboxes).some(cb => cb.checked);

        if (!algumaMarcada) {
            const primeiraCheckbox = checkboxes[0];
            primeiraCheckbox.setCustomValidity('Marque ao menos uma opção.');
            primeiraCheckbox.reportValidity();
            return;
        }

        // Limpa a validação caso esteja marcada
        checkboxes.forEach(cb => cb.setCustomValidity(''));

        popup_carregando(false, "Salvando tipo de saída...");
        const data = {
            descricao: document.getElementById('descricao').value,
            cfop_dentro: document.getElementById('cfop_dentro').value,
            cfop_fora: document.getElementById('cfop_fora').value,
            ativo: document.getElementById('ativo').value === "true",
            devolução_compra: document.getElementById('devolução_compra').checked,
            remessa_conserto: document.getElementById('remessa_conserto').checked,
            trans_filiais: document.getElementById('trans_filiais').checked,
            baixa_perda_quebra: document.getElementById('baixa_perda_quebra').checked,
            saida_uso_consumo: document.getElementById('saida_uso_consumo').checked
        };

        try {
            const response = await fetch('http://localhost:3000/tipos_de_saida', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            popup_carregando(true)
            if (response.ok) {
                popup_aviso('Cadastro feito com sucesso!');
                carregarConteudo("tipo_de_saida/tipo_de_saida.html", document.querySelector(".principal"), false, tipo_de_saida)
            } else {
                const erro = await response.json();
                popup_erro('Erro ao cadastrar: ' + erro.message);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            popup_erro('Erro ao conectar com o servidor.');
        }
    })
}