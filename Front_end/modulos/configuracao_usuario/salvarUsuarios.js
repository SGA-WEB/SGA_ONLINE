// Versão 100% compatível com seu HTML
export default function salvarUsuario (dado) {
    'use strict';
    dado = dado[0]
    console.log(dado)

    document.querySelector("#campo_editar_nome").value = dado.nome
    document.querySelector("#campo_editar_email").value = dado.email
    
};