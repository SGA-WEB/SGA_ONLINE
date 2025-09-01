import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { formatarData } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import contato from "../contato.js";
import visualizar_contato from "../visualizar_contato/visualizar_contato.js";
import { popup_aviso, popup_carregando, popup_erro } from "../../../scripts/popup.js";
import { salvarDadosDoBancoNoLocalStorage, salvarDadosDoLocalStorageNoBanco, salvarNovosDadosDaTelaNoLocalStorage, inserirDadoDoLocalStorageNaTela } from "../localStorage.js";

export default async function editar_contato (dado, telaAnteriorVisualizar) {
    let caminho = "contato/contato.html"
    let funcao = contato
    let elementoPai = document.querySelector(".principal")

    const response = await fetch(`http://localhost:3000/api/endereco/${dado.fk_id_endereco}`);
    const endereco = await response.json();

    if (telaAnteriorVisualizar) {
        caminho = "contato/visualizar_contato/criar_contato/visualizar_contato.html"
        funcao = visualizar_contato
        elementoPai = document.querySelector(".modulo")
    }

    let cont = 0

    let links_nav = document.querySelectorAll(".link_nav") // seleciona todos os links do menu superior
    if (cont == 0) {
        links_nav[0].classList.add("link_nav_selecionado") // Adiciona a classe ao primeiro link assim que o modulo for carregado
    }

    document.querySelectorAll('.link_nav').forEach(link => { // Seleciona todos os links
        link.addEventListener("click", (e) => {
            estilo_nav(e.target);
        });
    });
    localStorage.clear()
    if (localStorage.length == 0) {
        salvarDadosDoBancoNoLocalStorage(dado, endereco)
    }
    btnsProximoEVoltar()
    inserirDadoDoLocalStorageNaTela("Editar contato")
    addListenerBtns()
    select2("100%")

    fecharMenu(document.querySelector(".modulo").offsetWidth, 584)
    window.addEventListener('resize', (e) => {
        if(document.querySelector(".modulo") != null){
            fecharMenu(document.querySelector(".modulo").offsetWidth, 421)
        }
    })

    function addListenerBtns () {
        document.querySelector(".btn_cancelar").addEventListener("click", () => {
            carregarConteudo(caminho, elementoPai, false, funcao, dado)
            localStorage.clear()
        })
        document.querySelector(".btn_salvar").addEventListener("click", () => salvarDadosDoLocalStorageNoBanco(dado, caminho, elementoPai, funcao));
    }

    function btnsProximoEVoltar() {
        let btn_nav = document.querySelectorAll(".btn_nav")
        btn_nav.forEach(e=>{
            e.addEventListener("click", (e)=>{
                let btn = e.target.closest(".btn_nav").id.slice(4) // Pega o id do botão que foi clicado e retira o "btn_"
                let link_nav = document.getElementById(btn)
                if (link_nav == null) {
                    link_nav = "voltar_contatos"
                }
                estilo_nav(link_nav)
            })
        })
    }

    async function estilo_nav (e) {
        let link = e
        let links_nav= document.querySelectorAll(".link_nav") // Seleciona todos os links do nav
        links_nav.forEach(e=>{
            e.classList.remove("link_nav_selecionado") // desmarca todos
        })
        if (e == "voltar_contatos") {
            localStorage.clear()
            carregarConteudo(caminho, elementoPai, false, funcao, dado)
            return
        }

        e.classList.add("link_nav_selecionado") // Adiciona a classe ao link clicado
        await mudarDeAba(link.id)
    }

    async function mudarDeAba (link) {
        salvarNovosDadosDaTelaNoLocalStorage(dado, "Editar contato")
        switch (link) {
            case "link_contato":
                await carregarConteudo("contato/editar_contato/criar_contato/editar_contato.html", document.querySelector(".modulo"), false, chamarFuncoes); // E passada a função chamarFuncoes para que os botões sejam ativados e os dados sejam inseridos novamente
            break;
            case "link_endereco":
                carregarConteudo("contato/editar_contato/endereco_contato/editar_endereco_contato.html", document.querySelector(".modulo"), false, chamarFuncoes);
            break;
        }
    }

    function chamarFuncoes () {
        btnsProximoEVoltar()
        inserirDadoDoLocalStorageNaTela("Editar contato")
        addListenerBtns()
        select2("100%")
    }

    window.addEventListener("beforeunload", function(event) {
        // Limpa o storage ao recarregar a página
        localStorage.clear()
    });

}
