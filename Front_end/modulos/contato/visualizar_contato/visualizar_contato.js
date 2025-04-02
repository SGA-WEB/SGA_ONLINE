import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { dataAtual } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import editar_contato from "../editar_contato/editar_contato.js";
import excluir_contato from "../excluir_contato.js";

export default function visualizar_contato (dado) {
    let cont = 0        
    // Mudar de tela ao clicar no menu superior da tela de contato:
    let links_nav = document.querySelectorAll(".link_nav") // seleciona todos os links do menu superior
    if (cont == 0) {
        links_nav[0].classList.add("link_nav_selecionado") // Adiciona a classe ao primeiro link assim que o modulo for carregado
    }

    document.querySelectorAll('.link_nav').forEach(link => { // Seleciona todos os links que não possuem a classe link_nav_selecionado
        link.addEventListener("click", (e) => { 
            estilo_nav(e.target);
        });
    });

    dataAtual()
    select2("100%")
    btnsProximoEVoltar()
    inserirDadoDoBanco()
    addListenerBtnsAcoes()
    
    function addListenerBtnsAcoes () {
        document.querySelector(".btn_editar").addEventListener("click", async () => {
            await carregarConteudo(
                `contato/editar_contato/nav_contato.html`,
                document.querySelector('.principal')
            )
            carregarConteudo(
                `contato/editar_contato/criar_contato/editar_contato.html`,
                document.querySelector('.modulo'),
                false,
                editar_contato,
                dado,
                true
            );
        })
    
        let btn_excluir = document.querySelector(".btn_excluir")
        btn_excluir.addEventListener("click",() => {
            popup("abrir", 0, btn_excluir)
            excluir_contato(dado)
        })
    }

    
    fecharMenu(document.querySelector(".modulo").offsetWidth, 584)
    window.addEventListener('resize', (e) => { 
        if(document.querySelector(".modulo") != null){
            fecharMenu(document.querySelector(".modulo").offsetWidth, 421)
        } 
    })

    function estilo_nav (e) {
        let link = e
        if (e == "voltar_contatos") {
            carregarConteudo("contato/contato.html", document.querySelector(".principal"))
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
                carregarConteudo("contato/visualizar_contato/criar_contato/visualizar_contato.html", document.querySelector(".modulo"), false, chamarFuncoesNovamente); // E passada a função chamarFuncoesNovamente para que os dados sejam inseridos novamente na tela e os botões "proximo" e "voltar" sejam ativados
            break;
            case "link_endereco":
                carregarConteudo("contato/visualizar_contato/endereco_contato/visualizar_endereco_contato.html", document.querySelector(".modulo"), false, chamarFuncoesNovamente);
            break;
        }
    }

    function chamarFuncoesNovamente () {
        btnsProximoEVoltar()
        inserirDadoDoBanco()
        addListenerBtnsAcoes()
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
        if (document.querySelector(".h2_titulo").textContent == "Visualizar contato"){ // Verifica se a tela é de visualização
            document.querySelector(".codigo_id").textContent = dado.id_contato
            document.querySelector("#nome_razao_social").value = dado.razao_social
            document.querySelector("#nome_fantasia").value = dado.nome_fantasia
            document.getElementById(dado.categoria.toLowerCase().replace("á","a")).checked = true //Caso seja funcionário o acento é retirado para pegar id correto 
            document.querySelector("#fone1").value = dado.fone1
        }
    }
    cont++
} 
