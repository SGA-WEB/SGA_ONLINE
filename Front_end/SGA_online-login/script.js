document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login-form');
    const usuario = document.getElementById('usuario');
    const senha = document.getElementById('senha');
    const empresa = document.getElementById('selecione-a-empresa');
    const mensagemErro = document.getElementById('mensagemErro');

    form.addEventListener('submit', function(event) {
        let valid = true;
        // Remova ou comente a linha abaixo se não precisar limpar erros
        // clearAllErrors();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (usuario && usuario.value.trim() === '') {
            alert('Usuário não pode estar vazio');
            valid = false;
        } else if (usuario && !emailRegex.test(usuario.value)) {
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
    
        if (!valid) {
            event.preventDefault();
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (usuario && senha) {
            const email = usuario.value;
            const senhaValor = senha.value;

            try {
                const resposta = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha: senhaValor }),
                });

                const dados = await resposta.json();

                if (resposta.ok) {
                    alert('Login bem-sucedido!');
                    window.location.href = '/Front_end/Principal/principal.html';
                } else {
                    if (mensagemErro) {
                        mensagemErro.textContent = dados.error;
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
    });
});

