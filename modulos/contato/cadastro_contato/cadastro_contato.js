import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"

function navLink (link) {
    switch (link) {
        case "link_contato":
            carregarConteudo("contato/cadastro_contato/criar_contato/criar_contato.html", document.querySelector(".principal"),true);
        break;
        case "link_endereco":
            carregarConteudo("contato/cadastro_contato/endereco_contato/endereco_contato.html", document.querySelector(".modulo"),true);
        break;
        case "link_configuracoes":
            carregarConteudo("contato/cadastro_contato/configuracoes_contato/configuracoes_contato.html", document.querySelector(".modulo"),true);
        break;
    }
}

function estilo_nav (e) {
    let link = e
    if (typeof(e) == "string") {
        link = document.getElementById(e)
    }
    link.classList.add("link_nav_selecionado") // Adiciona a classe ao link clicado

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

    let p_data_cadastro = document.querySelector("#data_cadastro")
    let data = new Date()
    let dia = data.getDate()
    let mes = data.getMonth() + 1 // Mes comeca em 0
    if (dia <= 9) { // Se o dia for menor que 9 adiciona um 0 na frente
        dia = "0" + dia
    }
    if (mes <= 9) { // Se o mes for menor que 9 adiciona um 0 na frente
        mes = "0" + mes
    }
    p_data_cadastro.innerHTML = `${dia}/${mes}/${data.getFullYear()}`

    fecharMenu(document.querySelector(".modulo").offsetWidth, 584)
    window.addEventListener('resize', (e) => { 
        if(document.querySelector(".modulo") != null){
            fecharMenu(document.querySelector(".modulo").offsetWidth, 421)
        } 
    })

    // Adiciona o framework select2 ao campo de seleção
    $(document).ready(function () {
        $('.campo_select').select2({
            placeholder: 'Selecione a coluna',
            width: '100%',
            minimumResultsForSearch: Infinity,
        });
    });

    document.getElementsByName("tipo_contato").forEach(e=>{
        e.addEventListener('change', (e) => {
            if(e.target.id == "contato_fisico") {
                let container_radios = document.querySelector("#container_radios");
                let container_data_rg = document.createElement("div");
                container_data_rg.id = "container_data_rg";
                container_data_rg.classList.add("container_small_width");
                container_radios.after(container_data_rg);
                container_data_rg.innerHTML = `
                    <div class="campo_contato small_width">
                        <label for="data_nascimento">Data de nascimento:</label>
                        <input type="date" name="data_nascimento" id="data_nascimento" class="campo_input">
                    </div>
                    <div class="campo_contato small_width">
                        <label for="rg">RG:</label>
                        <input type="number" name="rg" id="rg" class="campo_input">
                    </div>
                `;
            }else {
                container_data_rg.remove()
            }
        })
    })
}


function btnNav() {
    let btn_nav = document.querySelectorAll(".btn_nav")
    btn_nav.forEach(e=>{
        e.addEventListener("click", (e)=>{
            let btn = e.target.closest(".btn_nav").id.slice(4) // Pega o id do botão que foi clicado e retira o "btn_"
            if (btn == "voltar_contatos") {
                carregarConteudo("contato/contato.html", document.querySelector(".principal")) // Volta para a tela de contatos
            } else {
                estilo_nav(btn)
            }
        })
    })
}

export { cadastro_contato, btnNav }
