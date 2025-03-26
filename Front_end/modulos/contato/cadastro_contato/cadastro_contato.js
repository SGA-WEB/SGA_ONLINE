import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { dataAtual } from "../../../scripts/funcionalidades.js";

function navLink (link) {
    switch (link) {
        case "link_contato":
            carregarConteudo("contato/cadastro_contato/criar_contato/criar_contato.html", document.querySelector(".principal"),true);
        break;
        case "link_endereco":
            carregarConteudo("contato/cadastro_contato/endereco_contato/endereco_contato.html", document.querySelector(".modulo"),true);
            let intervalo = setInterval(() => {
                if(document.querySelector(".modulo")){
                    document.querySelector(".btn_salvar").addEventListener("click", () => { 
                        alert("Contato salvo com sucesso!")
                        carregarConteudo("contato/lista_contatos/contato.html", document.querySelector(".principal"))
                    })
                    clearInterval(intervalo);
                }
            }, 100)
        break;
    }
}

function estilo_nav (e) {
    let link = e
    if (e == "voltar_contatos") {
        carregarConteudo("contato/lista_contatos/contato.html", document.querySelector(".principal"))
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

function cadastro_contato(link) {
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

    document.querySelector(".btn_salvar").addEventListener("click", () => { 
        alert("Contato salvo com sucesso!")
        carregarConteudo("contato/lista_contatos/contato.html", document.querySelector(".principal"))
    })
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

export { cadastro_contato, btnNav }
