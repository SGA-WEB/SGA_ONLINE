import select2 from "../../../scripts/select.js"
import { carregarConteudo } from "../../../scripts/javaScript.js"
import { formatarData } from "../../../scripts/funcionalidades.js"

export default async function visualizar_orcamento (dado) {
    select2("100%")
    document.querySelector(".codigo_id").textContent = dado.id_orcamento
    document.querySelector("#cliente").value = dado.cliente_razao_social
    document.querySelector("#desconto_total").value = dado.desconto_total
    document.querySelector("#criado_por_nome").value = dado.criado_por_nome
    document.querySelector("#status").value = dado.status
    document.querySelector(".data_cadastro").textContent = formatarData(dado.data_criacao)
    document.querySelector("#btn_voltar_orcamento").addEventListener("click", ()=>{
        carregarConteudo("orcamento/orcamento.html", document.querySelector(".principal"))
    })
}
