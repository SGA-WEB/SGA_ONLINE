import { formatarData } from "../../../scripts/funcionalidades.js"
import { carregarConteudo } from "../../../scripts/javaScript.js"
import { popup_carregando,popup_aviso } from "../../../scripts/popup.js"
import select2 from "../../../scripts/select.js"
import tipo_de_saida from "../tipo_de_saida.js"

export default function editar_tipo_saida(dado, telaAnteriorVisualizar) {
    select2("100%")
    document.querySelector("#btn_voltar_tipos_de_saida").addEventListener("click", () => {
        carregarConteudo("tipo_de_saida/tipo_de_saida.html", document.querySelector(".principal"),false, tipo_de_saida)
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

    document.querySelector(".btn_salvar").addEventListener("click", async (e) => {
        e.preventDefault()
        salvarEdicao(dado.id_tipos_de_saida)
        async function salvarEdicao(id_tipos_de_saida) {
            const descricao = document.querySelector("#descricao").value
            const cfop_dentro = document.querySelector("#cfop_dentro").value
            const cfop_fora = document.querySelector("#cfop_fora").value
            const ativo = document.querySelector("#ativo").value
            const devolução_compra = document.querySelector("#devolução_compra").checked
            const remessa_conserto = document.querySelector("#remessa_conserto").checked
            const trans_filiais = document.querySelector("#trans_filiais").checked
            const baixa_perda_quebra = document.querySelector("#baixa_perda_quebra").checked
            const saida_uso_consumo = document.querySelector("#saida_uso_consumo").checked

            popup_carregando()
            try {
                const response = await fetch('http://localhost:3000/tipos_de_saida/'+id_tipos_de_saida, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ descricao, cfop_dentro, cfop_fora, ativo, devolução_compra, remessa_conserto, trans_filiais, baixa_perda_quebra, saida_uso_consumo})
                });

                const data = await response.json();
                if (response.ok) {
                    const novoDado = {
                        // objeto para atualizar a tela de visualizar comforme os novos dados
                        descricao: descricao,
                        cfop_fora: cfop_fora,
                        cfop_dentro: cfop_dentro,
                        ativo: ativo,
                        devolução_compra: devolução_compra,
                        remessa_conserto: remessa_conserto,
                        trans_filiais: trans_filiais,
                        baixa_perda_quebra: baixa_perda_quebra,
                        saida_uso_consumo: saida_uso_consumo
                    }
                    popup_aviso('Tipo de saida alterada com sucesso!');
                    popup_carregando(true)
                    carregarConteudo("tipo_de_saida/tipo_de_saida.html", document.querySelector(".principal"), false, tipo_de_saida, novoDado)


                } else {
                    alert (`Erro: ${data.error}`);

                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                popup_erro('Erro ao conectar com o servidor.');
            }
        }
    })
    document.querySelector(".btn_cancelar").addEventListener("click", (e) => {
        e.preventDefault()
        carregarConteudo("tipo_de_saida/tipo_de_saida.html", document.querySelector(".principal"), false, tipo_de_saida,dado)
    })
}
