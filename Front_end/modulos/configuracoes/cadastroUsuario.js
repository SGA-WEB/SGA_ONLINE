import { popup_erro, popup_aviso } from "../../scripts/popup.js";

export function cadastroUsuario() {
    'use strict';
    let telefone = document.querySelector("#fone")

    const mascaraTelefone = {
        mask: [
            {
                mask: '(00) 00000-0000'
            }
        ]
    };

    // Aplique as máscaras aos elementos
    if (telefone) {
        const fone1Mask = IMask(telefone, mascaraTelefone);
    }


    document.querySelector("#formulario_usuario").addEventListener("submit", async (e) => {
        e.preventDefault()
        let nome = document.querySelector("#digite-nome").value
        let senha = document.querySelector("#senha").value
        let confirmesenha = document.querySelector("#confirmar-senha").value
        let email = document.querySelector("#email").value
        let confirmeemail = document.querySelector("#confirmar-email").value

        let dadosOk = true
        if (senha != confirmesenha) {
            popup_erro("As senhas digitadas são diferentes. Tente novamente.")
            dadosOk = false
        }
        if (email != confirmeemail) {
            popup_erro("Os emails digitados são diferentes. Tente novamente.")
            dadosOk = false
        }
        const novoObjeto = {
            nome: nome,
            email: email,
            celular: telefone,
            senha: senha
        };

        // Envia os dados atualizados para o backend
        if (dadosOk) {
            try {
                const response = await fetch(`http://localhost:3000/usuarios`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(novoObjeto),
                });

                if (response.ok) {
                    popup_aviso("Usuário cadastrado com sucesso!")
                    nome = ""
                    senha = ""
                    confirmesenha = ""
                    email = ""
                    confirmeemail = ""
                    telefone = ""
                } else {
                    const errorData = await response.json();
                    popup_erro(`Erro ao atualizar: ${errorData.error}`);
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                alert('Falha ao conectar ao servidor.');
            }
        }
    })

}
