document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/usuario', {
        credentials: 'include' // importante para enviar cookies de sessão
    })
    .then(response => response.json())
    .then(resposta => {
        console.log('Resposta da API:', resposta);
        if (resposta.logado && resposta.usuario && resposta.usuario.nome) {
            // Atualiza o nome do usuário
            document.getElementById('nome_usuario').textContent = resposta.usuario.nome;

            // (Opcional) Atualiza as iniciais do usuário no círculo
            const iniciais = resposta.usuario.nome
                .split(' ')
                .map(p => p[0])
                .join('')
                .substring(0,2)
                .toUpperCase();
            document.getElementById('logo_usuario_header').textContent = iniciais;
        } else {
            // Se não estiver logado, pode redirecionar para a página de login
            // window.location.href = '../SGA_online-login/index.html';
        }
    })
    .catch(error => {
        console.error('Erro ao buscar usuário logado:', error);
    });
});

