let form = document.querySelector(".formulario");
let emailInput = document.querySelector("#email");
let btnSubmit = document.querySelector("#btn_submit");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (form.checkValidity()) {
        const emailDigitado = emailInput.value;

        // 1. Muda o texto do botão para dar um feedback visual
        const textoOriginalBtn = btnSubmit.value;
        btnSubmit.value = "Enviando...";
        btnSubmit.disabled = true; // Impede que o usuário clique várias vezes

        try {
            // 2. Chama a API do Back-end
            // IMPORTANTE: Ajuste a porta 3000 caso o seu servidor Node esteja rodando em outra porta
            const response = await fetch('http://localhost:3000/api/esqueci-senha', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: emailDigitado })
            });

            const data = await response.json();

            if (response.ok && data.sucesso) {
                // 3. Salva o e-mail temporariamente na sessão
                // Isso é essencial para a tela de verificação saber quem validar!
                sessionStorage.setItem("emailRecuperacao", emailDigitado);

                // 4. Redireciona para a próxima tela
                window.location.href = "../verificacao_email/verificacao.html";
            } else {
                // Se o e-mail não existir no banco, mostra o erro do back-end
                alert(data.erro || "Ocorreu um erro ao tentar enviar o e-mail.");
                btnSubmit.value = textoOriginalBtn;
                btnSubmit.disabled = false;
            }

        } catch (error) {
            console.error("Erro na comunicação com a API:", error);
            alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
            btnSubmit.value = textoOriginalBtn;
            btnSubmit.disabled = false;
        }
    }
});

// Lógica do botão voltar (Mantida igual à sua original)
let btn_voltar = document.querySelector("#btn_voltar");
if (localStorage.getItem("from_config_usuario")) {
    btn_voltar.removeAttribute("href");
    btn_voltar.addEventListener("click", () => {
        window.history.back();
    });
}
