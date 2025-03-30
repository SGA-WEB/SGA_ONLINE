// Versão 100% compatível com seu HTML
export default function salvarUsuario (dado) {
    'use strict';
    console.log(dado)

    document.querySelector("#campo_editar_nome").value = dado[0].nome
    document.querySelector("#campo_editar_email").value = dado[0].email
    
};