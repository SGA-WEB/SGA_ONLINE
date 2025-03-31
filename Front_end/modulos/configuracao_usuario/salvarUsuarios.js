export default function salvarUsuario (dado) {
    'use strict';
    dado = dado[0]
    console.log(dado)


    document.querySelector("#campo_editar_nome").value = dado.nome
    document.querySelector("#campo_editar_email").value = dado.email
    document.querySelector("#campo_editar_fone").value = dado.celular
    document.querySelector("#senha_usuario").value = dado.senha
    
    document.querySelector("#btn_salvar_configuracoes_usuario").addEventListener("click", () => {
        let nome = document.querySelector("#campo_editar_nome").value
        let email = document.querySelector("#campo_editar_email").value
        let celular = document.querySelector("#campo_editar_fone").value
        let senha = document.querySelector("#senha_usuario").value
        
        let novoObjeto = {
            nome: nome,
            email: email,
            celular: celular,
            senha: senha
        }

        console.log(novoObjeto)
    })
}; 