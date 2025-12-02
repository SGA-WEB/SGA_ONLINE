import select2 from "../../../scripts/select.js"
import { carregarConteudo } from "../../../scripts/javaScript.js"

export default async function visualizar_orcamento (dado) {
    select2("100%")
    console.log(dado)
    document.querySelector(".codigo_id").textContent = dado.id_orcamento
    document.querySelector(".codigo_id").textContent = dado._orcamento
    document.querySelector("#cliente").value = dado.cliente_razao_social
    document.querySelector("#status").value = dado.status
    // document.querySelector("#criado_por_nome").value = dado.criado_por_nome_orcamento
    // document.querySelector("#status").value = dado.status_orcamento
    // document.querySelector(".data_criacao").textContent = formatarData(dado.data_criacao)
    document.querySelector("#btn_voltar_orcamento").addEventListener("click", ()=>{
        carregarConteudo("orcamento/orcamento.html", document.querySelector(".principal"))
    })
}
