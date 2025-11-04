
import select2 from "../../../scripts/select.js"
import { formatarData } from "../../../scripts/funcionalidades.js"
import { carregarConteudo } from "../../../scripts/javaScript.js"
import tipo_de_saida from "../tipo_de_saida.js"
import editar_tipo_de_saida from "../editar_tipo_saida/editar_tipo_saida.js"
export default async function visualizar_tipo_saida (dado) {
    
    select2("100%")
    document.querySelector(".data_cadastro").innerHTML = formatarData(dado.data_criacao)
    document.querySelector(".codigo_id").innerHTML = dado.id_tipo_de_saida
    document.querySelector("#descricao").value = dado.descricao
    document.querySelector("#cfop_dentro").value = dado.cfop_dentro
    document.querySelector("#cfop_fora").value = dado.cfop_fora
    document.querySelector("#ativo").value = dado.ativo
    document.querySelector("#devolução_compra").checked = dado.devolução_compra
    document.querySelector("#remessa_conserto").checked = dado.remessa_conserto
    document.querySelector("#trans_filiais").checked = dado.trans_filiais
    document.querySelector("#baixa_perda_quebra").checked = dado.baixa_perda_quebra
    document.querySelector("#saida_uso_consumo").checked = dado.saida_uso_consumo
    document.querySelector(".btn_editar").addEventListener("click", () => {
        carregarConteudo("tipo_de_saida/editar_tipo_saida/editar_tipo_saida.html", document.querySelector(".principal"), false, editar_tipo_de_saida, dado)
    })
    document.querySelector("#btn_voltar_tipo_de_saida").addEventListener("click", () => {
        carregarConteudo("tipo_de_saida/tipo_de_saida.html", document.querySelector(".principal"),false, tipo_de_saida)
    })     
}