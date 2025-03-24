import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { dataAtual, esperarCarregarConteudo } from "../../../scripts/funcionalidades.js";

export default function cadastro_contato () {
    esperarCarregarConteudo(cadastroContatoMain)

    let cont = 0

    function cadastroContatoMain() {
        // Mudar de tela ao clicar no menu superior da tela de contato:
        let links_nav = document.querySelectorAll(".link_nav") // seleciona todos os links do menu superior
        if (cont == 0) 
            links_nav[0].classList.add("link_nav_selecionado") // Adiciona a classe ao primeiro link assim que o modulo for carregado
        console.log(links_nav)
        links_nav.forEach(link => {
            link.removeEventListener("click", handleClick); // Remove o evento anterior
            link.addEventListener("click", handleClick); // Adiciona o evento
        });

        function handleClick(e) {
            estilo_nav(e.target);
        }
    
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
            console.log(e, link)
            if (e.id != link.id){ // Se o link selecionado for diferente do link clicado
                e.classList.remove("link_nav_selecionado") // Retira a classe
            }
        })
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
