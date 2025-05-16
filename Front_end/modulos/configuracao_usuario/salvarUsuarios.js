export default function salvarUsuario(dado) {
    'use strict';
    dado = dado[0];
    console.log(dado);

    // Preenche os campos do formulário
    document.querySelector("#campo_editar_nome").value = dado.nome;
    document.querySelector("#campo_editar_email").value = dado.email;
    document.querySelector("#campo_editar_fone").value = dado.celular;
    document.querySelector("#senha_usuario").value = dado.senha;
    
    document.querySelector("#btn_salvar_configuracoes_usuario").addEventListener("click", async () => {
        const nome = document.querySelector("#campo_editar_nome").value;
        const email = document.querySelector("#campo_editar_email").value;
        const celular = document.querySelector("#campo_editar_fone").value;
        const senha = document.querySelector("#senha_usuario").value;
        
        const novoObjeto = {
            id_usuario: dado.id_usuario,
            nome: nome,
            email: email,
            celular: celular,
            senha: senha
        };

        console.log(novoObjeto);

        // Envia os dados atualizados para o backend
        try {
            const response = await fetch(`http://localhost:3000/usuarios/${dado.id_usuario}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoObjeto),
            });

            if (response.ok) {
                alert('Usuário atualizado com sucesso!');
            } else {
                const errorData = await response.json();
                alert(`Erro ao atualizar: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Falha ao conectar ao servidor.');
        }
    });
}