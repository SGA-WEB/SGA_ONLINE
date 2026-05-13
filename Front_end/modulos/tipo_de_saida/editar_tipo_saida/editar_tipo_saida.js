import { formatarData } from "../../../scripts/funcionalidades.js"
import { carregarConteudo } from "../../../scripts/javaScript.js"
import { popup_carregando, popup_aviso, popup_erro } from "../../../scripts/popup.js"
import select2 from "../../../scripts/select.js"
import tipo_de_saida from "../tipo_de_saida.js"

export default function editar_tipo_saida(dado, telaAnteriorVisualizar) {
    select2("100%")

    document.querySelector("#btn_voltar_tipos_de_saida").addEventListener("click", () => {
        carregarConteudo("tipo_de_saida/tipo_de_saida.html", document.querySelector(".principal"), false, tipo_de_saida)
    })

    document.querySelector(".data_cadastro").innerHTML = formatarData(dado.data_criacao)
    document.querySelector(".codigo_id").innerHTML = dado.id_tipos_de_saida
    document.querySelector("#descricao").value = dado.descricao
    document.querySelector("#cfop_dentro").value = dado.cfop_dentro
    document.querySelector("#cfop_fora").value = dado.cfop_fora
    document.querySelector("#ativo").value = dado.ativo
    document.querySelector("#devolução_compra").checked = dado.devolução_compra
    document.querySelector("#remessa_conserto").checked = dado.remessa_conserto
    document.querySelector("#trans_filiais").checked = dado.trans_filiais
    document.querySelector("#baixa_perda_quebra").checked = dado.baixa_perda_quebra
    document.querySelector("#saida_uso_consumo").checked = dado.saida_uso_consumo

    document.querySelector("#form_editar_tipo_saida").addEventListener("submit", async (e) => {
        e.preventDefault()

        // Validação das checkboxes
        const checkboxes = document.querySelectorAll('.checkbox_opcao')
        const algumaMarcada = Array.from(checkboxes).some(cb => cb.checked)

        if (!algumaMarcada) {
            const primeiraCheckbox = checkboxes[0]
            primeiraCheckbox.setCustomValidity('Marque ao menos uma opção.')
            primeiraCheckbox.reportValidity()
            return
        }

        checkboxes.forEach(cb => cb.setCustomValidity(''))

        await salvarEdicao(dado.id_tipos_de_saida)

        async function salvarEdicao(id_tipos_de_saida) {
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
            }

            popup_carregando()
            try {
                const response = await fetch('http://localhost:3000/tipos_de_saida/' + id_tipos_de_saida, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })

                const responseData = await response.json()
                if (response.ok) {
                    popup_aviso('Tipo de saída alterada com sucesso!')
                    popup_carregando(true)
                    carregarConteudo("tipo_de_saida/tipo_de_saida.html", document.querySelector(".principal"), false, tipo_de_saida, data)
                } else {
                    alert(`Erro: ${responseData.error}`)
                }
            } catch (error) {
                console.error('Erro na requisição:', error)
                popup_erro('Erro ao conectar com o servidor.')
            } finally {
                popup_carregando(true)
            }
        }
    })

    document.querySelector(".btn_cancelar").addEventListener("click", (e) => {
        e.preventDefault()
        carregarConteudo("tipo_de_saida/tipo_de_saida.html", document.querySelector(".principal"), false, tipo_de_saida, dado)
    })
}