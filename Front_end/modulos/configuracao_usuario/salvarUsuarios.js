export default function salvarUsuario (dado) {
    'use strict';
    console.log(dado)

    document.querySelector("#campo_editar_nome").value = dado[0].nome
    document.querySelector("#campo_editar_email").value = dado[0].email
    document.querySelector("#campo_editar_fone").value = dado[0].tel
    document.querySelector("#senha_usuario").value = dado[0].password

};