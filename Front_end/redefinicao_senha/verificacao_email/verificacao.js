// 1. Recupera o e-mail que foi salvo na tela anterior
const emailRecuperacao = sessionStorage.getItem("emailRecuperacao");

// Segurança: se o usuário acessou essa tela direto pela URL sem passar pelo e-mail, manda ele de volta
if (!emailRecuperacao) {
    window.location.href = "../envio_email/envio_email.html";
}

let campo = document.querySelector("#codigo");
let alerta = document.querySelector("#feed_codigo");
let btn_reenviar_email = document.querySelector('#btn_reenviar_email');

campo.addEventListener('input', async () => {
    // Mantém a sua lógica de travar em 6 dígitos
    if (campo.value.length > 6) {
        campo.value = campo.value.slice(0, 6);
    }

    // Quando atingir os 6 dígitos, dispara a API automaticamente
    if (campo.value.length === 6) {
        const codigoDigitado = campo.value;

        // Feedback visual enquanto o servidor pensa
        alerta.innerHTML = "Validando código...";
        alerta.style.color = "#4F46E5"; // Azul
        campo.disabled = true; // Trava o campo para ele não digitar mais nada

        try {
            // Chama a rota do back-end para validar
            const response = await fetch('http://localhost:3000/api/validar-codigo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailRecuperacao,
                    codigo: codigoDigitado
                })
            });

            const data = await response.json();

            if (response.ok && data.sucesso) {
                alerta.innerHTML = "Código válido!";
                alerta.style.color = "green";

                // IMPORTANTE: Salva o ID do usuário para a próxima tela saber de quem é a senha nova
                sessionStorage.setItem("idUsuarioRecuperacao", data.id_usuario);

                // Dá um pequeno delay de meio segundo para o usuário ler a mensagem de sucesso e muda de tela
                setTimeout(() => {
                    window.location.href = "../nova_senha/nova_senha.html";
                }, 500);

            } else {
                // Se o código estiver errado ou expirado
                alerta.innerHTML = data.erro || "Código inválido.";
                alerta.style.color = "red";
                campo.disabled = false; // Destrava o campo
                campo.value = ""; // Limpa o campo
                campo.focus(); // Coloca o cursor piscando de novo para ele tentar novamente
            }

        } catch (error) {
            console.error("Erro ao validar:", error);
            alerta.innerHTML = "Erro de conexão com o servidor.";
            alerta.style.color = "red";
            campo.disabled = false;
        }

    } else {
        // Limpa o alerta se o usuário apagar um número
        alerta.innerHTML = "";
    }
});

// Ação do botão reenviar e-mail
btn_reenviar_email.addEventListener('click', () => {
    // Manda ele de volta para a tela de envio para digitar o e-mail novamente
    window.location.href = "../envio_email/envio_email.html";
});
