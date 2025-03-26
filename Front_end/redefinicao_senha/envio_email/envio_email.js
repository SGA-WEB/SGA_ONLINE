// import {carregarConteudo} from "../../scripts/javaScript.js";

let form = document.querySelector(".formulario")
form.addEventListener("submit",(e)=>{
    e.preventDefault()
    console.log(form.checkValidity())
    if (form.checkValidity()) {
        window.location.href = "../verificacao_email/verificacao.html"  
    }
})

let btn_voltar = document.querySelector("#btn_voltar")
if (localStorage.getItem("from_config_usuario")) {
    btn_voltar.removeAttribute("href")
    btn_voltar.addEventListener("click", () => {
        console.log("clicou")
        window.history.back()
    })
}
