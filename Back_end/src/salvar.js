document.getElementById('formCadastro').addEventListener('submit', async function(e) {
    e.preventDefault();  // Previne o comportamento padrão do formulário

    // Coleta os dados dos campos
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const celular = document.getElementById('celular').value;
    const senha = document.getElementById('senha').value;

    // Cria um objeto com os dados do formulário
    const dados = { nome, email, celular, senha };

    try {
        console.log('Enviando dados para a API...', dados);  // Log para verificar os dados

        // Requisição fetch para enviar os dados para o back-end
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        // Verifica se a resposta da API foi bem-sucedida
        if (response.ok) {
            // Se a resposta for bem-sucedida, tenta converter para JSON
            const resultado = await response.json();
            console.log('Resultado:', resultado);  // Log para ver o que o servidor está retornando

            // Exibir mensagem de sucesso
            document.getElementById('resultado').innerHTML = `<p>${resultado.message}</p>`;
        } else {
            // Se a resposta não for ok, exibe erro com o status
            const errorResult = await response.json();  // Tentando ler a resposta de erro
            console.log('Erro:', errorResult);  // Log para verificar a resposta de erro
            document.getElementById('resultado').innerHTML = `<p>Erro: ${errorResult.message || 'Erro desconhecido'}</p>`;
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        document.getElementById('resultado').innerHTML = `<p>Erro ao tentar se comunicar com o servidor.</p>`;
    }
});
