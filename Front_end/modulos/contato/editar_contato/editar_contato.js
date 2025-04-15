import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { formatarData } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import contato from "../contato.js";
import visualizar_contato from "../visualizar_contato/visualizar_contato.js";

export default function editar_contato (dado, telaAnteriorVisualizar) {
    let caminho = "contato/contato.html"
    let funcao = contato
    let elementoPai = document.querySelector(".principal")

    if (telaAnteriorVisualizar) {
        caminho = "contato/visualizar_contato/criar_contato/visualizar_contato.html"
        funcao = visualizar_contato
        elementoPai = document.querySelector(".modulo")
    }

    let cont = 0        

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

    btnsProximoEVoltar()
    inserirDadoDoBanco()
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
        })
    }


    function estilo_nav (e) {
        let link = e
        if (e == "voltar_contatos") {
            carregarConteudo(caminho, elementoPai, false, funcao, dado)
            return
        }
        let links_nav= document.querySelectorAll(".link_nav") // Seleciona todos os links do nav
        links_nav.forEach(e=>{
            e.classList.remove("link_nav_selecionado") // desmarca todos
        })
        
        e.classList.add("link_nav_selecionado") // Adiciona a classe ao link clicado
        mudarDeAba(link.id)
    }
    
    function mudarDeAba (link) {
        switch (link) {
            case "link_contato":
                carregarConteudo("contato/editar_contato/criar_contato/editar_contato.html", document.querySelector(".modulo"), false, chamarFuncoes); // E passada a função chamarFuncoes para que os botões sejam ativados e os dados sejam inseridos novamente
            break;
            case "link_endereco":
                carregarConteudo("contato/editar_contato/endereco_contato/editar_endereco_contato.html", document.querySelector(".modulo"), false, chamarFuncoes);
            break;
        }
    }

    function chamarFuncoes () {
        btnsProximoEVoltar()
        inserirDadoDoBanco()
        addListenerBtns()
        select2("100%")
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

    function inserirDadoDoBanco () {
        if (document.querySelector(".h2_titulo").textContent == "Editar contato"){ // Verifica se a tela é de edição de contato
            document.querySelector(".codigo_id").textContent = dado.id_contato
            document.querySelector("#nome_razao_social").value = dado.razao_social
            document.querySelector("#nome_fantasia").value = dado.nome_fantasia
            document.getElementById(dado.categoria.toLowerCase().replace("á","a")).checked = true
            document.querySelector("#fone1").value = dado.fone1
            document.querySelector(".data_cadastro").textContent = formatarData(dado.data_cadastro)
        }
    }
}
