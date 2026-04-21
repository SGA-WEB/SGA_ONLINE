import { visibilidadeSenha } from "../../scripts/funcionalidades.js";
import { popup_aviso, popup_erro, popup_carregando } from "../../scripts/popup.js";

let nova = false;
let senhasOk = false;
const idUsuario = sessionStorage.getItem("idUsuarioRecuperacao");

// Se não houver ID, o usuário não passou pela verificação do código
if (!idUsuario) {
    window.location.href = "../envio_email/envio_email.html";
}

function confirmacao(btn) {
    function htmlValid() {
        if (confirmacao_senha.value !== nova_senha.value) {
            validador.innerHTML = "As senhas não correspondem";
            validador.style.color = "rgb(100, 0, 0)";
            senhasOk = false;
            btn_redefinir.style.cursor = "not-allowed";
        } else if (nova_senha.value.length < 4) { // Validação básica de tamanho
            validador.innerHTML = "A senha deve ter pelo menos 4 caracteres";
            validador.style.color = "rgb(100, 0, 0)";
            senhasOk = false;
        } else {
            validador.innerHTML = "As senhas correspondem";
            validador.style.color = "rgb(0, 100, 0)";
            senhasOk = true;
            btn_redefinir.style.cursor = "pointer";
        }
    }

    if (btn || nova || confirmacao_senha.value.length >= nova_senha.value.length) {
        nova = true;
        htmlValid();
    }

    if (confirmacao_senha.value.length == 0 && nova_senha.value.length == 0) {
        validador.innerHTML = "";
        senhasOk = false;
    }
}

let nova_senha = document.querySelector("#senha");
let confirmacao_senha = document.querySelector("#confirmacao_senha");
let view_senha = document.querySelector("#view_senha");
let view_confirmacao = document.querySelector("#view_confirmacao");
let validador = document.querySelector("#validador_senhas");
let btn_redefinir = document.querySelector("#btn_redefinir");

view_senha.addEventListener("click", () => visibilidadeSenha(nova_senha, view_senha));
view_confirmacao.addEventListener("click", () => visibilidadeSenha(confirmacao_senha, view_confirmacao));

confirmacao_senha.addEventListener("input", () => confirmacao());
nova_senha.addEventListener("input", () => confirmacao());

btn_redefinir.addEventListener("click", async (e) => {
    e.preventDefault();
    if (senhasOk) {
        popup_carregando(false, "Redefinindo senha...");
        btn_redefinir.style.pointerEvents = "none";

        try {
            const response = await fetch('http://localhost:3000/api/redefinir-senha', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: idUsuario,
                    nova_senha: nova_senha.value
                })
            });

            const data = await response.json();

            if (response.ok && data.sucesso) {
                // Limpa a sessão de recuperação
                sessionStorage.removeItem("emailRecuperacao");
                sessionStorage.removeItem("idUsuarioRecuperacao");

                if (window.localStorage.getItem("from_config_usuario")) {
                    popup_aviso("Senha redefinida com sucesso!");
                    window.localStorage.removeItem("from_config_usuario");
                    window.location.href = "../../Principal/principal.html";
                } else {
                    popup_aviso("Senha redefinida com sucesso!\nClique em 'ok' e faça seu login com a nova senha.");
                    window.location.href = "../../SGA_online-login/index.html";
                }
            } else {
                popup_aviso(data.erro || "Erro ao atualizar a senha.");
                btn_redefinir.innerHTML = "Redefinir";
                btn_redefinir.style.pointerEvents = "auto";
            }
        } catch (error) {
            console.error("Erro no fetch:", error);
            popup_erro("Erro ao conectar com o servidor.");
            btn_redefinir.innerHTML = "Redefinir";
            btn_redefinir.style.pointerEvents = "auto";
        }
        popup_carregando(true);
    } else {
        confirmacao(true);
    }
});
