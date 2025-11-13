import select2 from "../../../scripts/select.js"
import { carregarConteudo } from "../../../scripts/javaScript.js"

export default async function visualizar_orcamento (dado) {
    select2("100%")

    console.log(dado)

    document.querySelector("#btn_voltar_orcamento").addEventListener("click", ()=>{
        carregarConteudo("orcamento/orcamento.html", document.querySelector(".principal"))
    })
}
