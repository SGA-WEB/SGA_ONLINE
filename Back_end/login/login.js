document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que o formulário recarregue a página
    console.log("Formulário enviado");

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }), // Dados enviados ao back-end
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('mensagem').textContent = data.message;
            // Redirecionar para a página principal
            window.location.href = '/pagina-principal.html'; // Substitua pelo caminho da sua página
        } else {
            document.getElementById('mensagem').textContent = data.message;
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        document.getElementById('mensagem').textContent = 'Erro ao conectar ao servidor';
    }
});
