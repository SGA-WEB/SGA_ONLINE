import { carregarConteudo } from "../../scripts/javaScript.js"

export default function configuracoes () {
    let btn_voltar = document.querySelector("#btn_voltar_config")
    btn_voltar.addEventListener("click",()=>{
        document.querySelector(".modulo_selecionado").classList.remove("modulo_selecionado")
        document.querySelector("#btn_dashboard").classList.add("modulo_selecionado")
        carregarConteudo("dashboard/dashboard.html",document.querySelector(".principal"))
    })
}