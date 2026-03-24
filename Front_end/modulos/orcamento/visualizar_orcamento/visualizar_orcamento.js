import select2 from "../../../scripts/select.js"
import { carregarConteudo } from "../../../scripts/javaScript.js"

export default async function visualizar_orcamento (dado) {
    select2("100%")
    document.querySelector(".codigo_id").textContent = dado.id_orcamento
    document.querySelector(".codigo_id").textContent = dado._orcamento
    document.querySelector("#cliente").value = dado.cliente_razao_social
    document.querySelector("#status").value = dado.status
    document.querySelector("#criado_por").value = dado.criado_por_nome
    document.querySelector("#subtotal").value = dado.subtotal
    document.querySelector("#valor_desconto").value = dado.desconto_total
    document.querySelector("#valor_total").value = dado.valor_total
    document.querySelector("#observacao").value = dado.observacao
    document.querySelector(".data_criacao").textContent = formatarData(dado.data_criacao)
    document.querySelector("#btn_voltar_orcamento").addEventListener("click", ()=>{
        carregarConteudo("orcamento/orcamento.html", document.querySelector(".principal"))
    })
}
