document.addEventListener('DOMContentLoaded', function() {
        const apiUrl = 'http://127.0.0.1:3000/api/usuario';
        console.log(`Tentando acessar a API em: ${apiUrl}`);
        
        fetch(apiUrl, {
            credentials: 'include' // importante para enviar cookies de sessão
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(resposta => {
            console.log('Resposta da API:', resposta);
            if (resposta.logado && resposta.usuario && typeof resposta.usuario.nome === 'string') {
                document.getElementById('nome_usuario').textContent = resposta.usuario.nome;
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
    })    



