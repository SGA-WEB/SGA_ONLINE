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
        window.addEventListener("click", fechar_popup) // Adiciona o evento de clique fora do popup
    } else {
        container_popup.style.display = "none"
    }

    btn_fechar_popup.addEventListener("click", () => {
        container_popup.style.display = "none"
        btn_fechar_popup.removeEventListener("click",btn_fechar_popup) // Remove o evento de clique no botão do popup
        window.removeEventListener("click", fechar_popup); // Remove o evento de clique fora do popup
    })
}