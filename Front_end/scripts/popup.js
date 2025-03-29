export default function popup (status, idx = 0, btn) {
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
    btn_popup_excluir_cancelar.addEventListener("click", () => {
       fecharPopup(btn_popup_excluir_cancelar)
    })
}