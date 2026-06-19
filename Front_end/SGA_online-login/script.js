import select2 from "../scripts/select.js";
import { popup_aviso, popup_carregando, popup_erro } from "../scripts/popup.js";
import { visibilidadeSenha } from "../scripts/funcionalidades.js";

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.login-form');
    const email = document.getElementById('email'); // Corrigido: id correto é "email"
    const senha = document.getElementById('senha');
    const empresa = document.getElementById('selecione-a-empresa');
    console.log('Script de login carregado');
    select2("fit-content"); // Chama a função select2 para estilizar o select

    const imgVisibilidade = document.getElementById('view_off_login');
    imgVisibilidade.addEventListener("click", () => visibilidadeSenha(senha, imgVisibilidade, 'imagens/'));

    // Função para validar os campos do formulário
    function validarFormulario() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let valid = true;

        if (!email || !email.value.trim()) { // Certifique-se de que o campo existe e tem valor
            popup_erro('E-mail não pode estar vazio');
            valid = false;
        } else if (!emailRegex.test(email.value.trim())) { // Use .trim() para remover espaços em branco
            popup_erro('Formato de e-mail inválido');
            valid = false;
        }

        const senhaValor = senha ? senha.value.trim() : '';
        if (senhaValor === '') {
            popup_erro('Senha não pode estar vazia');
            valid = false;
        } else if (senhaValor.length < 6) {
            popup_erro('Senha deve ter no mínimo 6 caracteres');
            valid = false;
        }

        if (empresa && empresa.value === 'default') {
            popup_erro('Selecione uma empresa');
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

            if (dados.sucesso) {
                localStorage.setItem('usuarioLogadoId', dados.usuario.id_usuario);
                localStorage.setItem('usuarioLogadoNome', dados.usuario.nome);
                popup_aviso('Login realizado com sucesso!');
                window.location.href = '/Front_end/Principal/principal.html';
            } else {
                popup_erro(dados.erro);
            }
        } catch (error) {
            popup_erro('Erro ao enviar os dados: ' + error.message);
        }
    }

    // Manipulador do evento de submit
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário
        popup_carregando('Verificando credenciais...');

        // Valida o formulário antes de prosseguir
        if (validarFormulario()) {
            const emailValor = email.value.trim();
            const senhaValor = senha.value.trim();

            // Envia os dados ao servidor
            await enviarDados(emailValor, senhaValor);
        }
    });
});
