document.addEventListener('DOMContentLoaded', function() {
    console.log('Script carregou!');

    const spanNomeUsuario = document.getElementById('nome_usuario');
    if (!spanNomeUsuario) {
        console.error('Elemento com id="nome_usuario" NÃO encontrado!');
    } else {
        console.log('Elemento id="nome_usuario" encontrado.');
    }

    fetch('https://sga-online-api.onrender.com/api/usuario', {
        credentials: 'include'
    })
    .then(response => {
        console.log('Status da resposta:', response.status);
        return response.json();
    })
    .then(resposta => {
        console.log('Resposta da API:', resposta);
        if (resposta.logado && resposta.usuario && resposta.usuario.nome) {
            spanNomeUsuario.textContent = resposta.usuario.nome;
            const iniciais = resposta.usuario.nome
                .split(' ')
                .map(p => p[0])
                .join('')
                .substring(0,2)
                .toUpperCase();
            document.getElementById('logo_usuario_header').textContent = iniciais;
        } else {
            console.warn('Usuário não logado ou resposta inesperada.');
            // window.location.href = '../SGA_online-login/index.html';
        }
    })
    .catch(error => {
        console.error('Erro ao buscar usuário logado:', error);
    });
});
