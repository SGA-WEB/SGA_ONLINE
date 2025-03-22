import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { dataAtual } from "../../../scripts/funcionalidades.js";
import { esperarCarregarConteudo } from "../../../scripts/funcionalidades.js";

export default function visualizar_contato () {
    esperarCarregarConteudo(visualizar_contato)

    function navLink (link) {
        switch (link) {
            case "link_contato":
                carregarConteudo("contato/visualizar_contato/criar_contato/criar_contato.html", document.querySelector(".principal"));
            break;
            case "link_endereco":
                carregarConteudo("contato/visualizar_contato/endereco_contato/endereco_contato.html", document.querySelector(".modulo"));
            break;
        }
    }
    
    function estilo_nav (e) {
        let link = e
        if (e == "voltar_contatos") {
            ("contato/contato.html", document.querySelector(".principal"))
        } else {
            if (typeof(e) == "string") {
                link = document.getElementById(e)
            }
            link.classList.add("link_nav_selecionado") // Adiciona a classe ao link clicado
        }
    
        let links_selecionado = document.querySelectorAll(".link_nav_selecionado") // Seleciona todos os links selecionados
        links_selecionado.forEach(e=>{
            if (e.id != link.id){ // Se o link selecionado for diferente do link clicado
                e.classList.remove("link_nav_selecionado") // Retira a classe
            } else { // Se o link selecionado for o link clicado
                e.classList.add("link_nav_selecionado") // Adiciona a classe
            }
        })
        navLink(link.id)
    }
    
    function visualizar_contato(link) {
        // Mudar de tela ao clicar no menu superior da tela de contato:
        let links_nav = document.querySelectorAll(".link_nav") // seleciona todos os links do menu superior
        links_nav[0].classList.add("link_nav_selecionado") // Adiciona a classe ao primeiro link assim que o modulo for carregado
        links_nav.forEach(link=>{
            link.addEventListener("click",(e)=>{ // Adiciona o evento de clicar em todos os links 
               estilo_nav(e.target)
            })
        })
    
        // Mudar o input de data de cadastro para o dia atual:
        dataAtual()
    
        fecharMenu(document.querySelector(".modulo").offsetWidth, 584)
        window.addEventListener('resize', (e) => { 
            if(document.querySelector(".modulo") != null){
                fecharMenu(document.querySelector(".modulo").offsetWidth, 421)
            } 
        })

        btnNav()
    }
    
    function btnNav() {
        let btn_nav = document.querySelectorAll(".btn_nav")
        btn_nav.forEach(e=>{
            e.addEventListener("click", (e)=>{
                let btn = e.target.closest(".btn_nav").id.slice(4) // Pega o id do botão que foi clicado e retira o "btn_"
                estilo_nav(btn)
            })
        })
    }
} 
