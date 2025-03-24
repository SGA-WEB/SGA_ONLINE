import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { dataAtual, esperarCarregarConteudo } from "../../../scripts/funcionalidades.js";

export default function cadastro_contato () {
    esperarCarregarConteudo(cadastroContatoMain)

    let cont = 0
    console.log(cont)
    function cadastroContatoMain() {
        // Mudar de tela ao clicar no menu superior da tela de contato:
        let links_nav = document.querySelectorAll(".link_nav") // seleciona todos os links do menu superior
        if (cont == 0) 
            links_nav[0].classList.add("link_nav_selecionado") // Adiciona a classe ao primeiro link assim que o modulo for carregado

        document.querySelectorAll('.link_nav:not(.link_nav_selecionado)').forEach(link => { // Seleciona todos os links que não possuem a classe link_nav_selecionado
            link.addEventListener("click", (e) => { 
                estilo_nav(e.target);
            });
        });
    
        // Mudar o input de data de cadastro para o dia atual:
        dataAtual()
    
        fecharMenu(document.querySelector(".modulo").offsetWidth, 584)
        window.addEventListener('resize', (e) => { 
            if(document.querySelector(".modulo") != null){
                fecharMenu(document.querySelector(".modulo").offsetWidth, 421)
            } 
        })
    
        btnsProximoEVoltar()
        cont++
    }

    function navLink (link) {
        switch (link) {
            case "link_contato":
                carregarConteudo("contato/cadastro_contato/criar_contato/criar_contato.html", document.querySelector(".principal"), cadastroContatoMain);
            break;
            case "link_endereco":
                carregarConteudo("contato/cadastro_contato/endereco_contato/endereco_contato.html", document.querySelector(".modulo"), cadastroContatoMain);
            break;
        }
    }
    
    function estilo_nav (e) {
        let link = e
        if (e == "voltar_contatos") {
            carregarConteudo("contato/contato.html", document.querySelector(".principal"))
        }

        let links_selecionado = document.querySelectorAll(".link_nav") // Seleciona todos os links selecionados
        links_selecionado.forEach(e=>{
            e.classList.remove("link_nav_selecionado") // Retira a classe
        })

        e.classList.add("link_nav_selecionado") // Adiciona a classe ao link clicado
        navLink(link.id)
    }

    function btnsProximoEVoltar() {
        let btn_nav = document.querySelectorAll(".btn_nav")
        btn_nav.forEach(e=>{
            e.addEventListener("click", (e)=>{
                let btn = e.target.closest(".btn_nav").id.slice(4) // Pega o id do botão que foi clicado e retira o "btn_"
                
                estilo_nav(btn)
            })
        })
    }
}
