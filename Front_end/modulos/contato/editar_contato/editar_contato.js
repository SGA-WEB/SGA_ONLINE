import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { dataAtual, esperarCarregarConteudo } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import contato from "../contato.js";
import visualizar_contato from "../visualizar_contato/visualizar_contato.js";

export default function editar_contato (dado, telaAnteriorVisualizar) {
    let caminho = "contato/contato.html"
    let funcao = contato
    console.log(telaAnteriorVisualizar)

    if (telaAnteriorVisualizar) {
        caminho = "contato/visualizar_contato/criar_contato/visualizar_contato.html"
        funcao = visualizar_contato
    }

    esperarCarregarConteudo(cadastroContatoMain)

    let cont = 0
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
    
        setTimeout(() => {
            dataAtual()
            btnsProximoEVoltar()
            inserirDadoDoBanco()
            select2("100%")
            document.querySelector(".btn_salvar").addEventListener("click",() => {
                carregarConteudo("contato/contato.html", document.querySelector(".principal"))
            })
            document.querySelector(".btn_cancelar").addEventListener("click",() => {
                carregarConteudo(caminho, document.querySelector(".principal"), funcao(dado))
            })
        }, 300);
        
        fecharMenu(document.querySelector(".modulo").offsetWidth, 584)
        window.addEventListener('resize', (e) => { 
            if(document.querySelector(".modulo") != null){
                fecharMenu(document.querySelector(".modulo").offsetWidth, 421)
            } 
        })

        cont++
    }

    function estilo_nav (e) {
        let link = e
        if (e == "voltar_contatos") {
            if (telaAnteriorVisualizar) {
                carregarConteudo(
                    `contato/visualizar_contato/nav_contato.html`,
                    document.querySelector('.principal'),
                    visualizar_contato(dado, true)
                )
                setTimeout(() => {
                    console.log(document.querySelector(".modulo"))
                    carregarConteudo(
                        `contato/visualizar_contato/criar_contato/visualizar_contato.html`,
                        document.querySelector('.modulo'),
                        visualizar_contato(dado, true),
                        true
                    );
                }, 400);
            }
            carregarConteudo(caminho, document.querySelector(".principal"),funcao(dado))
            return
        }
        let links_selecionado = document.querySelectorAll(".link_nav") // Seleciona todos os links selecionados
        links_selecionado.forEach(e=>{
            e.classList.remove("link_nav_selecionado") // Retira a classe
        })
        
        e.classList.add("link_nav_selecionado") // Adiciona a classe ao link clicado
        navLink(link.id)
    }
    
    function navLink (link) {
        switch (link) {
            case "link_contato":
                carregarConteudo("contato/editar_contato/criar_contato/editar_contato.html", document.querySelector(".modulo"), cadastroContatoMain);
            break;
            case "link_endereco":
                carregarConteudo("contato/editar_contato/endereco_contato/editar_endereco_contato.html", document.querySelector(".modulo"), cadastroContatoMain);
            break;
        }
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
            document.getElementById(dado.categoria.toLowerCase()).checked = true
            document.querySelector("#fone1").value = dado.fone1
        }
    }
}
