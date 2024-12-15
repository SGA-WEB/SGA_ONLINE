import { visibilidadeSenha } from "../../scripts/funcionalidades.js";
import { carregarConteudo, mudarLogo } from "../../scripts/javaScript.js";
import popup from "../../scripts/popup.js";

export default function configuracao_usuario() {
    function fechar_menu_editar() {
        menu_editar_foto.classList.add("hide")
    }

    // Quando o usuáiro clicar no botão de configuração essa função é chamada e o menu do usuário será fechado:
    document.querySelector("#menu_usuario").style.display = "none"

    const btnEditarFoto = document.querySelector('.btn_editar_foto');
    let menu_editar_foto = document.querySelector(".editar_foto")
    btnEditarFoto.addEventListener('click', () => {
        // Abre o menu de editar foto
        menu_editar_foto.classList.remove("hide")
    })

    window.addEventListener('click', (e) => {
        // Some com o menu quando o usuário clicar fora dele
        if(!btnEditarFoto.contains(e.target) && !menu_editar_foto.contains(e.target)){
            fechar_menu_editar()
        }
    })
    
    let btn_mudar_foto = document.querySelector("#btn_mudar_foto")
    btn_mudar_foto.addEventListener('click', () => {
        popup('abrir', 0, btn_mudar_foto)
        fechar_menu_editar()
    })

    // Botão de alterar senha

    let btn_alterar_senha = document.querySelector(".btn_alterar_senha")
    btn_alterar_senha.addEventListener('click', () => {
        window.location.href = "../redefinicao_senha/envio_email/envio_email.html"
        window.localStorage.setItem("from_config_usuario", true)
    })

    // fazer upload da imagem dentro do popup:

    let tamanho_maximo = 2 * 1024 * 1024 // 2MB
    // o javaSript pega o tamanho do arquivo em bytes

    function alterar_img_perfil(img) {
        let div_logo_usuario = document.querySelectorAll(".logo_usuario")        
        div_logo_usuario.forEach(e => {
            e.innerHTML = ""
            e.style.backgroundColor = "#fff"
            let img_perfil = document.createElement("img")
            img_perfil.src = img
            img_perfil.classList.add("img_perfil")
            e.appendChild(img_perfil)
            popup("fechar")
        })
    }

    const btn_upload = document.querySelector(".btn_upload_img");

    // Função para abrir a janela de seleção de arquivos
    btn_upload.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file.size > tamanho_maximo) {
                alert("O tamanho da imagem selecionada excede o limite de 2MB.");
            } else {
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Exibir a imagem selecionada
                    alterar_img_perfil(event.target.result)
                };
                reader.readAsDataURL(file);
            }
        });

        fileInput.click();  // Simula o clique no input file
    });

    // Adiciona funcionalidade de arraste
    btn_upload.addEventListener('dragover', (e) => {
        e.preventDefault();
        btn_upload.classList.add("drag");
    });

    btn_upload.addEventListener('dragleave', (e) => {
        btn_upload.classList.remove("drag");
    });

    btn_upload.addEventListener('drop', (e) => {
        e.preventDefault();
        btn_upload.classList.remove("drag");
        const file = e.dataTransfer.files[0];
        if (file.size > tamanho_maximo) {
            alert("O tamanho da imagem selecionada excede o limite de 2MB.");
        } else {
            const reader = new FileReader();
            reader.onload = function(event) {
                alterar_img_perfil(event.target.result)
            };
            reader.readAsDataURL(file);
        }
    });

    // Focar no campo do usuário quando clicar no container dele ou no botão de editar
    let campos_usuario = [...document.querySelectorAll(".container_campo_input")]
    campos_usuario.forEach(e => {
        e.addEventListener("click", (el) => {
            if( !el.target.classList.contains("campo_input_noborder")){
                let input = e.querySelector("input")
                if (input.type != "password"){
                    input.focus()
                }
                if (input.type != "email") {
                    input.setSelectionRange(input.value.length, input.value.length)
                }
            }
        })
    })

    let campo_senha = document.querySelector("#senha_usuario")
    let img_visibilidade_senha = document.querySelector(".visibilidade")
    img_visibilidade_senha.addEventListener("click", ()=> {
        visibilidadeSenha(campo_senha,img_visibilidade_senha)
    })

    // Botão voltar:
    let btn_voltar = document.querySelector(".btn_voltar")
    btn_voltar.addEventListener('click', () => {
        carregarConteudo("dashboard/dashboard.html", document.querySelector(".principal"))
    })

    // Botão de salvar:
    let btn_salvar = document.querySelector(".btn_salvar")
    btn_salvar.addEventListener('click', () => {
        alert("Configurações salvas com sucesso!")
        carregarConteudo("dashboard/dashboard.html", document.querySelector(".principal"))
    })

    // Pop Up ver foto:
    let btn_ver_foto = document.querySelector("#btn_ver_foto")
    btn_ver_foto.addEventListener('click', () => {
        popup('abrir',1,btn_ver_foto)
        fechar_menu_editar()
    })

    // Botão de remover foto:
    mudarLogo() // Atualiza a logo assim que a página for carregada
    let btn_remover_foto = document.querySelector("#btn_remover_foto")
    btn_remover_foto.addEventListener('click', () => {
       mudarLogo()
       fechar_menu_editar()
    })
}    
