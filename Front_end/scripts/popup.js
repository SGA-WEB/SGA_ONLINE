export default function popup (status, idx = 0, btn) {
    let btn_fechar_popup = document.querySelectorAll(".btn_fechar_popup")[idx]
    let container_popup = document.querySelectorAll(".container_popup")[idx]
    
    // função que fecha o popup quando o usuário clicar fora dele
    let fechar_popup = (e) => {
        let popup = document.querySelectorAll(".popup")[idx]
        if (container_popup.style.display == "flex"){
            if (!popup.contains(e.target) && (!btn.contains(e.target))) { // Verifica se o clique foi fora do popup e não foi feito no botão de mudar foto
                    container_popup.style.display = "none"
                    window.removeEventListener("click", fechar_popup); // Remove o evento de clique fora do popup
                }
            }
    }

    if (status == "abrir"){
        container_popup.style.display = "flex"
        window.addEventListener("click", fechar_popup)
    } else {
        container_popup.style.display = "none"
    }
    btn_fechar_popup.addEventListener("click", () => {
        container_popup.style.display = "none"
    })

}