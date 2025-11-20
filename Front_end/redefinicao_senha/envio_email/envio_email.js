// import {carregarConteudo} from "../../scripts/javaScript.js";

let form = document.querySelector(".formulario")
form.addEventListener("submit",(e)=>{
    e.preventDefault()
    if (form.checkValidity()) {
        window.location.href = "../verificacao_email/verificacao.html"
    }
})

let btn_voltar = document.querySelector("#btn_voltar")
if (localStorage.getItem("from_config_usuario")) {
    btn_voltar.removeAttribute("href")
    btn_voltar.addEventListener("click", () => {
        window.history.back()
    })
}
