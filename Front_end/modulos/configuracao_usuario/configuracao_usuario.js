import { visibilidadeSenha, alterarImgPerfil } from "../../scripts/funcionalidades.js";
import { carregarConteudo, mudarLogoParaPadrao } from "../../scripts/javaScript.js";
import { popup, popup_aviso, popup_carregando, popup_confirmar, popup_erro } from "../../scripts/popup.js";

export default async function configuracao_usuario() {
    const response = await fetch(`http://localhost:3000/api/imagem/${1}`);
    const data = await response.json();
    if (data.error) {
        mudarLogoParaPadrao()
    } else {
        alterarImgPerfil(data.imageUrl)
    }

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
        // Some com o menu quando o usuário clicar fora dele
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
                popup_erro("O tamanho da imagem selecionada excede o limite de 2MB.");
            } else {
                const reader = new FileReader();
                reader.onload = function(event) {
<<<<<<< HEAD
                    alterar_img_perfil(event.target.result)
                    salvarfotoservidor(file);
                };
                reader.readAsDataURL(file);
=======
                    // Exibir a imagem selecionada
                    salvarImagemNoBanco(file)
                };
                reader.readAsDataURL(file);

>>>>>>> teste
            }
        });

        fileInput.click();
    });

<<<<<<< HEAD
    const salvarfotoservidor = async (file) => {
        const formData = new FormData();
        formData.append('imagem', file);

=======
    async function salvarImagemNoBanco(file, userId = 1) {
>>>>>>> teste
        try {
            popup_carregando(false, "Salvando imagem...")

            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('userId', userId);

            const response = await fetch('http://localhost:3000/upload-avatar', {
                method: 'POST',
                body: formData
            });

<<<<<<< HEAD
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
=======
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro no servidor');
            }

            const data = await response.json();

            // Verifique se a URL foi retornada corretamente
            if (!data.url) {
                throw new Error('URL da imagem não retornada pelo servidor');
            }

            popup_carregando(true)
            popup("fechar", 0, btn_mudar_foto)
            alterarImgPerfil(data.url)
            return data.url;

        } catch (error) {
            console.error('Erro ao salvar imagem:', error);
            throw error; // Propague o erro para ser tratado no chamador
        }
    }
>>>>>>> teste

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
            popup_aviso("O tamanho da imagem selecionada excede o limite de 2MB.");
        } else {
            const reader = new FileReader();
            reader.onload = function (event) {
            reader.onload = function(event) {
<<<<<<< HEAD
                alterar_img_perfil(event.target.result);
                salvarfotoservidor(file);
=======
                salvarImagemNoBanco(file)
>>>>>>> teste
            };
            reader.readAsDataURL(file);
        }
    });

    let campos_usuario = [...document.querySelectorAll(".container_campo_input")]
    campos_usuario.forEach(e => {
        e.addEventListener("click", (el) => {
            if (!el.target.classList.contains("campo_input_noborder")) {
                let input = e.querySelector("input")
                if (input.type != "password") {
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
    img_visibilidade_senha.addEventListener("click", () => {
        visibilidadeSenha(campo_senha, img_visibilidade_senha)
    })

    let btn_voltar = document.querySelector(".btn_voltar")
    btn_voltar.addEventListener('click', () => {
        carregarConteudo("dashboard/dashboard.html", document.querySelector(".principal"))
    })

    let btn_salvar = document.querySelector(".btn_salvar")
    btn_salvar.addEventListener('click', () => {
        popup_aviso("Configurações salvas com sucesso!")
        carregarConteudo("dashboard/dashboard.html", document.querySelector(".principal"))
    })

    let btn_ver_foto = document.querySelector("#btn_ver_foto")
    btn_ver_foto.addEventListener('click', () => {
        popup('abrir', 1, btn_ver_foto)
        fechar_menu_editar()
    })

<<<<<<< HEAD
    mudarLogo()
=======
    // Botão de remover foto:
>>>>>>> teste
    let btn_remover_foto = document.querySelector("#btn_remover_foto")
    btn_remover_foto.addEventListener('click', async () => {
        let confirmar = await popup_confirmar("Tem certeza que deseja remover a foto de perfil?")
        fechar_menu_editar()
        if(confirmar)
            mudarLogoParaPadrao()
    })
}
