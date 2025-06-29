import select2 from "../scripts/select.js";

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.login-form');
    const email = document.getElementById('email'); // Corrigido: id correto é "email"
    const senha = document.getElementById('senha');
    const empresa = document.getElementById('selecione-a-empresa');
    const mensagemErro = document.getElementById('mensagemErro');
    console.log('Script de login carregado');
    select2("fit-content"); // Chama a função select2 para estilizar o select

    // Função para validar os campos do formulário
    function validarFormulario() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let valid = true;

        if (!email || !email.value.trim()) { // Certifique-se de que o campo existe e tem valor
            alert('E-mail não pode estar vazio');
            valid = false;
        } else if (!emailRegex.test(email.value.trim())) { // Use .trim() para remover espaços em branco
            alert('Formato de e-mail inválido');
            valid = false;
        }

        const senhaValor = senha ? senha.value.trim() : '';
        if (senhaValor === '') {
            alert('Senha não pode estar vazia');
            valid = false;
        } else if (senhaValor.length < 8) {
            alert('Senha deve ter no mínimo 8 caracteres');
            valid = false;
        }

        if (empresa && empresa.value === 'default') {
            alert('Selecione uma empresa');
            valid = false;
        }

        return valid;
    }

    // Função para enviar os dados via fetch
    async function enviarDados(emailValor, senhaValor) {
        try {
            const resposta = await fetch('http://localhost:3000/api/login', {
                method: 'POST', // Use POST para enviar dados sensíveis
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailValor, senha: senhaValor }),
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                alert('Login bem-sucedido!');
                window.location.href = '/Front_end/Principal/principal.html';
            } else {
                if (mensagemErro) {
                    mensagemErro.textContent = dados.error || 'Erro desconhecido!';
                    mensagemErro.style.color = 'red';
                }
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            if (mensagemErro) {
                mensagemErro.textContent = 'Erro ao conectar com o servidor!';
                mensagemErro.style.color = 'red';
            }
        }
    }

    // Manipulador do evento de submit
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Valida o formulário antes de prosseguir
        if (validarFormulario()) {
            // Exibe mensagem de carregamento
            mensagemErro.textContent = 'Carregando...';
            mensagemErro.style.color = 'blue';

            const emailValor = email.value.trim();
            const senhaValor = senha.value.trim();

            // Envia os dados ao servidor
            await enviarDados(emailValor, senhaValor);
        }
    });
});
