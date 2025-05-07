function popup (status, idx = 0, btn) {
    /*
        Autor: matheushnunes;

        Parâmetros:
        - status: String que define se o popup será aberto ou fechado;
        - idx: Número que define qual popup será aberto ou fechado (caso haja mais de um na página);
        - btn: Elemento que chamou a função;

        Função:
        - Abre ou fecha um popup;
        - Fecha o popup quando o usuário clicar fora dele;
    */

    let container_popup = document.querySelectorAll(".container_popup")[idx]
    let btn_fechar_popup = document.querySelectorAll(".btn_fechar_popup")[idx]
    let fecharPopupQuandoClicarForaDele = (e) => {
        let popup = document.querySelectorAll(".popup")[idx]
        if (container_popup.style.display == "flex"){
            if (!popup.contains(e.target) && (!btn.contains(e.target))) { // Verifica se o clique foi fora do popup e não foi feito no botão de mudar foto
                container_popup.style.display = "none"
                window.removeEventListener("click", fecharPopupQuandoClicarForaDele); // Remove o evento de clique fora do popup
            }
        }
        window.removeEventListener("click", fecharPopupQuandoClicarForaDele); // Remove o evento de clique fora do popup
    }

    function fecharPopup(btn) {
        container_popup.style.display = "none"
        btn.removeEventListener("click",btn) // Remove o evento de clique no botão do popup
        window.removeEventListener("click", fecharPopupQuandoClicarForaDele); // Remove o evento de clique fora do popup
    }

    if (status == "abrir"){
        container_popup.style.display = "flex"
        window.addEventListener("click", fecharPopupQuandoClicarForaDele) // Adiciona o evento de clique fora do popup
    } else {
        container_popup.style.display = "none"
    }

    btn_fechar_popup.addEventListener("click", () => {
        fecharPopup(btn_fechar_popup)
    })

    // Se for o popup de alerta que tiver o botão de cancelar:

    let btn_popup_excluir_cancelar = document.querySelector("#btn_popup_excluir_cancelar")
    if (btn_popup_excluir_cancelar){
        btn_popup_excluir_cancelar.addEventListener("click", () => {
           fecharPopup(btn_popup_excluir_cancelar)
        })
    }
}

function popup_aviso(mensagem = "Ação realizada com sucesso!") {
    const popup = document.getElementById('popup_aviso');
    const p_mensagem = document.querySelector('.mensagem_aviso');
    const btn_fechar_popup = document.querySelector('#btn_fechar_popup_aviso');

    // Remove a classe hide_popup para mostrar o popup
    popup.classList.remove('hide_popup');
    p_mensagem.textContent = mensagem;

    // Reinicia a animação da barra de progresso
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.animation = 'none';
    void progressBar.offsetWidth; // Trigger reflow
    progressBar.style.animation = 'progress 3s linear forwards';

    btn_fechar_popup.addEventListener('click', function() {
        popup.classList.add('hide_popup');
    });

    // Esconde o popup após 3 segundos (tempo da animação da barra)
    setTimeout(function() {
        popup.classList.add('hide_popup');
    }, 3000);
}

function popup_carregando(fecharPopup = false,mensagem = "Salvando alterações...") {
    const popup = document.getElementById('popup_carregando');
    const p_mensagem = popup.querySelector('.mensagem_aviso');

    p_mensagem.textContent = mensagem;
    popup.classList.remove('hide_popup');

    if (fecharPopup) {
        popup.classList.add('hide_popup');
    }

    return popup;
}

function popup_erro(mensagem = "Erro ao realizar a ação!") {
    const popup = document.getElementById('popup_erro');
    const p_mensagem = popup.querySelector('.mensagem_erro');
    const btn_fechar_popup = document.querySelector('#btn_fechar_popup_erro');

    // Remove a classe hide_popup para mostrar o popup
    popup.classList.remove('hide_popup');
    p_mensagem.textContent = mensagem;

    // Reinicia a animação da barra de progresso
    const progressBar = document.querySelector('#progress-bar-erro');
    progressBar.style.animation = 'none';
    void progressBar.offsetWidth; // Trigger reflow
    progressBar.style.animation = 'progress 5s linear forwards';

    // Esconde o popup após 5 segundos (tempo da animação da barra)
    let timetout = setTimeout(function() {
        popup.classList.add('hide_popup');
        clearTimeout(timetout); // Limpa o timeout para evitar múltiplas chamadas
    }, 5000);

    btn_fechar_popup.addEventListener('click', function() {
        popup.classList.add('hide_popup');
        clearTimeout(timetout);
    });
}

export { popup, popup_aviso, popup_carregando, popup_erro };
