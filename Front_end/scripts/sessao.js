document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/usuario', {
        credentials: 'include' // importante para enviar cookies de sessão
    })
    .then(response => response.json())
    .then(resposta => {
        console.log('Resposta da API:', resposta);
            if (resposta.logado && resposta.usuario && typeof resposta.usuario.nome === 'string') {
                // Atualiza o nome do usuário
                document.getElementById('nome_usuario').textContent = resposta.usuario.nome;
            
                // (Opcional) Atualiza as iniciais do usuário no círculo
                const iniciais = resposta.usuario.nome
                    .split(' ')
                    .map(p => p[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();
                document.getElementById('logo_usuario_header').textContent = iniciais;
            } else {
                console.warn('Usuário não está logado ou nome do usuário não está disponível.');
            }        
    })
    .catch(error => {
        console.error('Erro ao buscar usuário logado:', error);
    });
});

