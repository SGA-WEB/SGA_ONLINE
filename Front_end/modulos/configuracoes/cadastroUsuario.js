import { popup_erro } from "../../scripts/popup.js";

export default function cadastroUsuario(dado) {
    'use strict';
    dado = dado[0];
    console.log(dado);

    document.querySelector(".button-salvar").addEventListener("submit", (e) => {
        e.preventDefault()
        let nome = document.querySelector("#digite-nome").value
        let senha = document.querySelector("#senha").value
        let confirmesenha = document.querySelector("#confirmar-senha")
        let email = document.querySelector("#email").value
        let confirmeemail = document.querySelector("#confirmar-email")
        let fone = document.querySelector("#fone").value
        if (senha!=confirmesenha) {
            popup_erro("As senhas digitadas são diferentes. Tente novamente.")
        } 
    })
    
   
}