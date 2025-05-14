import buscarDados from "../../scripts/buscarDados.js";
import { visibilidadeSenha } from "../../scripts/funcionalidades.js";
import { carregarConteudo, mudarLogo } from "../../scripts/javaScript.js";
import {popup} from "../../scripts/popup.js";
import salvarUsuario from "./salvarUsuarios.js";

export default function configuracao_usuario( data ) {
    function fechar_menu_editar() {
        menu_editar_foto.classList.add("hide")
    }

    document.querySelector("#menu_usuario").style.display = "none"

    const btnEditarFoto = document.querySelector('.btn_editar_foto');
    let menu_editar_foto = document.querySelector(".editar_foto")
    btnEditarFoto.addEventListener('click', () => {
        menu_editar_foto.classList.remove("hide")
    })

    window.addEventListener('click', (e) => {
        if (!btnEditarFoto.contains(e.target) && !menu_editar_foto.contains(e.target)) {
            fechar_menu_editar()
        }
    })

    let btn_mudar_foto = document.querySelector("#btn_mudar_foto")
    btn_mudar_foto.addEventListener('click', () => {
        popup('abrir', 0, btn_mudar_foto)
        fechar_menu_editar()
    })

    let btn_alterar_senha = document.querySelector(".btn_alterar_senha")
    btn_alterar_senha.addEventListener('click', () => {
        window.location.href = "../redefinicao_senha/envio_email/envio_email.html"
        window.localStorage.setItem("from_config_usuario", true)
    })

    let tamanho_maximo = 2 * 1024 * 1024;

    const btn_upload = document.querySelector(".btn_upload_img");

    btn_upload.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file.size > tamanho_maximo) {
                alert("O tamanho da imagem excede 2MB.");
            } else {
                const reader = new FileReader();
                reader.onload = function(event) {
                    alterar_img_perfil(event.target.result)
                    salvarfotoservidor(file);
                };
                reader.readAsDataURL(file);
            }
        });

        fileInput.click();
    });

    const salvarfotoservidor = async (file) => {
        const formData = new FormData();
        formData.append('imagem', file);

        try {
            popup_carregando(false, "Salvando imagem...")

            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('userId', userId);

            const response = await fetch('http://localhost:3000/upload-avatar', {
                method: 'POST',
                body: formData
            });

            if (!resposta.ok) throw new Error("Erro no upload");

            const dados = await resposta.json();
            console.log("Imagem salva no servidor!", dados);

            // Salvar no localStorage para persistência
            localStorage.setItem('userImage', dados.imageUrl);
        } catch (erro) {
            console.error("Falha no upload", erro);
            alert("Erro ao enviar a imagem. Tente novamente.");
        }
    };

    btn_upload.addEventListener('dragover', (e) => {
        e.preventDefault();
        btn_upload.classList.add("drag");
    });

    btn_upload.addEventListener('dragleave', () => {
        btn_upload.classList.remove("drag");
    });

    // Salvar imagem ao arrastar para o botão
    btn_upload.addEventListener('drop', (e) => {
        e.preventDefault();
        btn_upload.classList.remove("drag");
        const file = e.dataTransfer.files[0];
        if (file.size > tamanho_maximo) {
            alert("O tamanho da imagem excede 2MB.");
        } else {
            const reader = new FileReader();
            reader.onload = function(event) {
                alterar_img_perfil(event.target.result);
                salvarfotoservidor(file);
            };
            reader.readAsDataURL(file);
        }
    });

    let campos_usuario = [...document.querySelectorAll(".container_campo_input")]
    campos_usuario.forEach(e => {
        e.addEventListener("click", (el) => {
            if (!el.target.classList.contains("campo_input_noborder")) {
                let input = e.querySelector("input")
                if (input.type != "password") input.focus()
                if (input.type != "email") input.setSelectionRange(input.value.length, input.value.length)
            }
        })
    })

    let campo_senha = document.querySelector("#senha_usuario")
    let img_visibilidade_senha = document.querySelector(".visibilidade")
    img_visibilidade_senha.addEventListener("click", () => {
        visibilidadeSenha(campo_senha, img_visibilidade_senha)
    })

    let btn_voltar = document.querySelector(".btn_voltar")
    btn_voltar.addEventListener('click', () => {
        carregarConteudo("dashboard/dashboard.html", document.querySelector(".principal"))
    })

    let btn_salvar = document.querySelector(".btn_salvar")
    btn_salvar.addEventListener('click', () => {
        alert("Configurações salvas com sucesso!")
    })

    let btn_ver_foto = document.querySelector("#btn_ver_foto")
    btn_ver_foto.addEventListener('click', () => {
        popup('abrir', 1, btn_ver_foto)
        fechar_menu_editar()
    })

    mudarLogo()
    let btn_remover_foto = document.querySelector("#btn_remover_foto")
    btn_remover_foto.addEventListener('click', () => {
        let confirmar = window.confirm("Tem certeza que deseja remover a foto de perfil?")
        fechar_menu_editar()
 HEAD
        if (confirmar) {
            localStorage.removeItem('userImage');
            mudarLogo();
        }
    })

    buscarDados("sga.usuario", false, salvarUsuario)
}    

 acba54076742655d066161deccaa28ec062178f3
