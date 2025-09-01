import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { dataAtual } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import { inserirDadoDoLocalStorageNaTela, salvarNovosDadosDaTelaNoLocalStorage } from "../localStorage.js";
import buscarDados from "../../../scripts/buscarDados.js";
import { popup_carregando } from "../../../scripts/popup.js";

export default async function cadastro_contato() {
    let cont = 0
    popup_carregando()

    let contatos = await buscarDados('contato');
    let contatosComMaiorId = contatos.reduce((prev, curr) => {
        return prev.id_contato > curr.id_contato ? prev : curr;
    })
    let nextIdContato = contatosComMaiorId.id_contato + 1;
    document.querySelector(".codigo_id").innerHTML = nextIdContato;

    // Mudar de tela ao clicar no menu superior da tela de contato:
    let links_nav = document.querySelectorAll(".link_nav") // seleciona todos os links do menu superior
    if (cont == 0) {
        links_nav[0].classList.add("link_nav_selecionado") // Adiciona a classe ao primeiro link assim que o modulo for carregado
    }

    document.querySelectorAll('.link_nav').forEach(link => { // Seleciona todos os links
        link.addEventListener("click", (e) => {
            estilo_nav(e.target);
        });
    });

    dataAtual()
    select2("100%")
    btnsProximoEVoltar()
    addListenerBtns()

    fecharMenu(document.querySelector(".modulo").offsetWidth, 584)
    window.addEventListener('resize', (e) => {
        if (document.querySelector(".modulo") != null) {
            fecharMenu(document.querySelector(".modulo").offsetWidth, 421)
        }
    })

    function addListenerBtns() {
        document.querySelector(".btn_cancelar").addEventListener("click", () => {
            carregarConteudo('contato/contato.html', document.querySelector('.principal'), false)
        })
        document.querySelector(".btn_salvar").addEventListener("click", () => {
            let data = new Date()
            salvarNovosDadosDaTelaNoLocalStorage({ data_cadastro: data.toISOString(), id_contato: nextIdContato }, "Cadastro de contato")
        });
    }


    function estilo_nav(e) {
        let link = e
        if (e == "voltar_contatos") {
            carregarConteudo('contato/contato.html', document.querySelector('.principal'), false)
            return
        }
        let links_nav = document.querySelectorAll(".link_nav") // Seleciona todos os links do nav
        links_nav.forEach(e => {
            e.classList.remove("link_nav_selecionado") // desmarca todos
        })

        e.classList.add("link_nav_selecionado") // Adiciona a classe ao link clicado
        mudarDeAba(link.id)
    }

    function mudarDeAba(link) {
        salvarNovosDadosDaTelaNoLocalStorage({ data_cadastro: new Date().toISOString(), id_contato: nextIdContato }, "Cadastro de contato")
        switch (link) {
            case "link_contato":
                carregarConteudo("contato/cadastro_contato/criar_contato/criar_contato.html", document.querySelector(".modulo"), false, chamarFuncoes); // É passada a função chamarFuncoes para que os botões sejam ativados e os dados sejam inseridos novamente
                break;
            case "link_endereco":
                carregarConteudo("contato/cadastro_contato/endereco_contato/endereco_contato.html", document.querySelector(".modulo"), false, chamarFuncoes);
                break;
        }
    }

    function chamarFuncoes() {
        inserirDadoDoLocalStorageNaTela("Cadastro de contato")
        btnsProximoEVoltar()
        addListenerBtns()
        select2("100%")
    }

    function btnsProximoEVoltar() {
        let btn_nav = document.querySelectorAll(".btn_nav")
        btn_nav.forEach(e => {
            e.addEventListener("click", (e) => {
                let btn = e.target.closest(".btn_nav").id.slice(4) // Pega o id do botão que foi clicado e retira o "btn_"
                let link_nav = document.getElementById(btn)
                if (link_nav == null) {
                    link_nav = "voltar_contatos"
                }
                estilo_nav(link_nav)
            })
        })
    }

    popup_carregando(true)
}
