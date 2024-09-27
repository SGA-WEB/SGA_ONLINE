//Muda estilo do botão "sair" 
function alterarEstilo() {
    var link = document.getElementById("meuLink");
    link.style.color = "gray"; // Altera a cor
    link.style.textDecoration = "none"; // Remove o sublinhado
}

//Configurações menu dropdown:

//função trocar visibilidade do menu comforme for clicado
function displayMenu(id){
    let menu = document.getElementById(id)
    let menus = document.querySelectorAll(".dropdown") //pega todos os menus dropdown da página

    if (menu.style.display == "none") { //altera a visibilidade do menu clicado
        menu.style.display = "block"
    } else {
        menu.style.display = "none"
    }

    menus.forEach(e=>{
        if (e.style.display == "block" && e.id != id) {
            e.style.display = "none"
        }
    }) // deixa todos os outros menus que não foi o clicado com display none
}

let btn_menus = document.querySelectorAll(".btn_menu") //Seleciona todos os botões dos modulos
btn_menus.forEach((e)=>{
    e.addEventListener("click",(e)=>{
        let modulo = e.currentTarget.id // Pega o id do modulo que foi clicado
        switch (modulo) { // De acordo com o id do mudulo clicado o switch chama a função com esse id como parâmetro
            case "btn_estoque":
                displayMenu("dd_estoque")
                break;
            case "btn_vendas":
                displayMenu("dd_vendas")
                break;
            case "btn_relatorios":
                displayMenu("dd_relatorios")
                break;
            case "btn_financeiro":
                displayMenu("dd_financeiro")
                break;
            case "btn_administracao":
                displayMenu("dd_administracao")
                break;
        }


        let btns_menu = document.querySelectorAll(".btn_menu")
        btns_menu.forEach(e=>{
            if(e.id == modulo)
                e.classList.toggle("modulo_selecionado") // Adicionando a classe selecionado no modulo que foi clicado
            else
                e.classList.remove("modulo_selecionado") // Retirando a classe selecionado de todos os outros modulos
        })

        document.querySelectorAll(".item_dropdown").forEach(e=>{ // Quando for selecionado um módulo é retirado o estilo de todos os itens do menu
            e.classList.remove("item_menu_selecionado")
        }) 
    })
})

// Comfigurações de estilo dos itens do menu dropdown
let itens_dropdown = document.querySelectorAll(".item_dropdown") // Pega todos os itens de todos os módulos
itens_dropdown.forEach(e=>{
    e.addEventListener("click",e=>{ // Adiciona a função de clicar em todos
        itens_dropdown.forEach(i=>{
            if (i.id == e.currentTarget.id){
                // Adiciona ou tira a classe "item_menu_selecionado" somente do item clicado
                e.currentTarget.classList.toggle("item_menu_selecionado")
            } else {
                // Tira a classe de todos os outros items
                i.classList.remove("item_menu_selecionado")
            }
        })
    })
})

// Fechar menu lateral:

function minimizarMenu(status){
    let mini = document.querySelectorAll(".btn, .btn_menu, .item_menu, #container_btn_fechar, #container_logo_busca, #menu_lateral, .span_modulo, .seta_cima_baixo")
    mini.forEach(e => e.classList.toggle("mini"))

    if (status == "fechar"){
        document.querySelectorAll(".dropdown").forEach(e => e.style.display = "none")
        btnMenu()
    }
    else {
        // document.querySelectorAll(".dropdown").forEach((e)=>{
        //     console.log(e.id)
        // })
    }
}

function btnMenu(){
    let btn_menu = document.querySelectorAll(".btn_menu.mini")
    console.log(btnMenu)
    btn_menu.forEach((e)=>{
        e.addEventListener("click", ()=>{
            console.log(btn_menu)
            minimizarMenu("abrir")
        })
    })
}
let btn_fechar_menu = document.querySelector("#btn_fechar_menu")
btn_fechar_menu.addEventListener('click',()=>{
    let icone_aba = document.querySelector("#icone_aba")
    if (icone_aba.classList[0] == "aba_fechar") {
        icone_aba.src = "imagens/icone_abrir_aba.png"
        icone_aba.className = "aba_abrir"
    } else {
        icone_aba.src = "imagens/icone_fechar_aba.png"
        icone_aba.className = "aba_fechar"
    }

    minimizarMenu("fechar")
})

