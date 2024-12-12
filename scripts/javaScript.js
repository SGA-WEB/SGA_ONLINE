// Modulos da tela principal:
import dashBorad from "../modulos/dashboard/dashboard.js";
import contato from "../modulos/contato/lista_contatos/contato.js";
import {cadastro_contato, btnNav} from "../modulos/contato/cadastro_contato/cadastro_contato.js";
import configuracao_usuario from "../modulos/configuracao_usuario/configuracao_usuario.js";
import select2 from "./select.js";
import produto from "../modulos/produto/produto.js";
import centro_de_estoque from "../modulos/centro_de_estoque/centro_de_estoque.js";

function mudarLogo(){ // Muda a logo do usuário de acordo com o nome dele
  let div_logo_usuario = document.querySelectorAll(".logo_usuario");
  div_logo_usuario.forEach(e => {
      // Pega a primeira letra do primeiro nome e a primeira letra do ultimo nome no nome do usuário:
      let nome_usuario = document.querySelector("#nome_usuario").textContent.trim();
      let nome_completo = nome_usuario.split(" ");
      let primeira_letra_primeiro_nome = nome_completo[0][0].toUpperCase();
      let primeira_letra_ultimo_nome = nome_completo[nome_completo.length-1][0].toUpperCase();
      e.textContent = primeira_letra_primeiro_nome+primeira_letra_ultimo_nome;
      e.style.backgroundColor = "aqua"
  });
}
mudarLogo()

$(document).ready(function () {
  $('.campo_select').select2({
      placeholder: 'Selecione a coluna',
      width: '140px',
      minimumResultsForSearch: Infinity,
  });
});

let btns_modulos = document.querySelectorAll(".btn, .item_dropdown, #btn_configuracao_usuario") // Seleciona todos os botões dos modulos
btns_modulos.forEach(e =>{
  e.addEventListener("click",()=>{
    // e.id.slice(4): remove o "btn_" do id
    carregarConteudo(`${e.id.slice(4)}/${e.id.slice(4)}.html`, document.querySelector(".principal"))
  })
})

carregarConteudo("dashboard/dashboard.html", document.querySelector(".principal")) // Carrega por padrão assim que a página for carregada o dashboard

let logo_sga_principal = document.querySelector("#logo_sga_principal")
logo_sga_principal.addEventListener("click",()=>{
  carregarConteudo("dashboard/dashboard.html", document.querySelector(".principal"))
}) // Clicar na logo volta para o dashboard

// Função carregar conteúdo html dos módulos
function carregarConteudo(url, elemento, modulo_contato) {
  // Limpa o conteúdo atual antes de carregar o novo
  elemento.innerHTML = "<p>Carregando...</p>";
  url = "../modulos/" + url;
  if (url === "../modulos/contato/contato.html") {
    url = "../modulos/contato/lista_contatos/contato.html";
  }

  // Carrega o conteúdo do arquivo HTML usando fetch
  fetch(url)
  .then(response => {
    if (!response.ok) throw new Error('Erro ao carregar o conteúdo.');
    return response.text();
  })
  .then(html => {
    elemento.innerHTML = html;
    requestAnimationFrame(() => { // Aguarda o carregamento completo do conteúdo HTML antes de executar as funções do JavaScript
      select2()
      if (url === "../modulos/dashboard/dashboard.html") {
        dashBorad();
      }
      if (url === "../modulos/contato/lista_contatos/contato.html") {
        contato();
      }
      if (url === "../modulos/contato/cadastro_contato/criar_contato/criar_contato.html") {
        cadastro_contato();
        btnNav();
      }
      if (url === "../modulos/contato/cadastro_contato/configuracoes_contato/configuracoes_contato.html") {
        configuracoes_contato();
      }
      if (url === "../modulos/configuracao_usuario/configuracao_usuario.html") {
        configuracao_usuario();
      }
      if (url === "../modulos/produto/produto.html") { 
        produto()
      }
      if (url === "../modulos/centro_de_estoque/centro_de_estoque.html") {
        centro_de_estoque()
      }
      if (modulo_contato) { // Se for um dos modulos do contato
        btnNav();
      }
    });
  })
  .catch(error => {
    elemento.innerHTML = "<p>Erro ao carregar o conteúdo.</p>";
    console.error(error);
  });

}



// Função que fecha o menu lateral se a tela tiver menos de um determinado width de largura
function fecharMenu(width, minWidth) {
  if (width <= minWidth) {
      if (!document.querySelector("#menu_lateral").classList.contains("mini"))
        btnMenuLateral()
  } 
}

fecharMenu(document.body.offsetWidth, 640); // Chama a função no load da página para fechar o menu lateral se a tela tiver menos de 640px

// Configurações menu lateral:

// Função trocar visibilidade do menu conforme for clicado
function displayMenu(id, remove_class){
    if(id && id != "btn") { // Se tiver um id e não for o botão
      let menu = id
      let menus = document.querySelectorAll(".dropdown") // Pega todos os menus dropdown da página
      if (menu.style.display == "none") { // Se o dropdown estiver fechado
        menu.parentElement.querySelector(".seta_cima_baixo").style.transform = "rotate(180deg)" // Gira a seta
        menu.style.display = "block"
      } else {
        menu.parentElement.querySelector(".seta_cima_baixo").style.transform = "rotate(0deg)"
        if (remove_class) { // Remove a classe "modulo_selecionado" do módulo que estava selecionado
          document.querySelector(".modulo_pre-selecionado, .modulo_selecionado").classList.remove("modulo_pre-selecionado")
        }
        menu.style.display = "none"
      }
      menus.forEach(e=>{
        if (e.id != menu.id || id == "btn") { 
          e.previousElementSibling.classList.remove("modulo_selecionado") // Deixa todos os outros modulos que não foi o clicado sem a classe "modulo_selecionado"
        }
        if (e.style.display == "block" && e.id != menu.id) {
          e.style.display = "none"
        }
      }) // Deixa todos os outros menus que não foi o clicado com display none
    } else { // Se o módulo clicado for um botão
      let menus = document.querySelectorAll(".dropdown") // Pega todos os menus dropdown da página
      menus.forEach(e =>{
        e.style.display = "none" // Some com todos os menus drop-down 
        document.querySelector(".seta_cima_baixo").style.transform = "rotate(0deg)"
      })
    }
}

// Função que modifica a visibilidade e o estilo dos itens do menu lateral 
function minimizarMenu(status){
    let mini = document.querySelectorAll(".btn, .btn_menu, .item_menu, #container_btn_fechar, #container_logo_busca, #menu_lateral, .span_modulo, .seta_cima_baixo, .graficos, .principal") // Seleciona todos os elementos necessários 
    mini.forEach(e => e.classList.toggle("mini")) // Adiciona ou retira a classe "mini" nos elementos
    if (status == "fechar"){
        document.querySelectorAll(".dropdown").forEach(e => e.style.display = "none") // Deixa invisível os itens do menu dropdown
    }
}

// Função que modifica o botão de abrir e fechar o menu lateral
function btnMenuLateral(target){
    let icone_aba = document.querySelector("#icone_aba")
    if (icone_aba.classList[0] == "aba_fechar") { // Se o menu estiver maximizado 
        icone_aba.src = "../imagens/icone_abrir_aba.png"
        icone_aba.className = "aba_abrir"
        icone_aba.alt = "Icone_abrir_aba_menu"
        minimizarMenu("fechar")
        let modulo_pre_selecionado = document.querySelector(".modulo_pre-selecionado") // Seleciona somente o módulo pre-selecionado
        if (modulo_pre_selecionado) { // Se tiver um módulo pre-selecionado
          modulo_pre_selecionado.querySelector(".seta_cima_baixo").style.transform = "rotate(0deg)" // Gira a seta
          modulo_pre_selecionado.classList.remove("modulo_pre-selecionado") // Remove a classe "modulo_selecionado"
          modulo_pre_selecionado.nextElementSibling.style.display = "none" // Fecha o menu dropdown
        }
    } else { // Se o menu estiver minimizado 
        icone_aba.src = "../imagens/icone_fechar_aba.png"
        icone_aba.className = "aba_fechar"
        icone_aba.alt = "Icone_fechar_aba_menu"
        minimizarMenu("abrir")
        document.querySelector(".item_hiden")?.remove() // se o .item_hiden existir ele é removido
        if(target == "btn_lateral") { // Se o botão apertado for o botão lateral:
            // Se tiver um modulo selecionado e não for um botão é chamada a função para abrir as opções do modulo 
            let modulo_selecionado = document.querySelector(".modulo_selecionado")
            if(modulo_selecionado != null && modulo_selecionado.classList[0] == "btn_menu"){
              displayMenu(modulo_selecionado.nextElementSibling)
            }
        }
    }
}
let btns_menu = document.querySelectorAll(".btn_menu") // Seleciona todos os botões dos modulos
btns_menu.forEach((e)=>{
  e.addEventListener("click",(e)=>{
    let modulo = e.currentTarget // Pega o modulo que foi clicado
    let btnMini = modulo.classList.contains("mini") // Verifica se o botão tem a classe "mini"
    let btn = (modulo.classList[0] == 'btn') // Verifica se a opção selecionada é um botão que não tem um menu dropdown
    let btn_menu_selecionado = modulo.classList.contains("btn_menu_selecionado") // Verifica se o modulo é um dropdown com um item selecionado
    let widthBody = document.body.offsetWidth // Pega o tamanho do body
    btns_menu.forEach(el=>{
      if(el.id == modulo.id){ // Se o elemento for igual o id do modulo clicado
        if(!btnMini && btn) { // Se for um modulo maximizado e for um botão
          el.classList.add("modulo_selecionado") // Adicionando a classe selecionado no modulo que foi clicado
          document.querySelector(".item_hiden")?.remove()
          document.querySelector(".modulo_pre-selecionado")?.classList.remove("modulo_pre-selecionado")
          if(!btn){ // Se não for um botão
            displayMenu(el.nextElementSibling) // Manda como parametro para função o proximo irmão do elemento selecionado
          } else {
            displayMenu("btn")
          }
        } else if (!btnMini) { // Se não for um botão e não estiver minimizado
          if (btn_menu_selecionado) { // For um dropdown com um item selecionado
            el.classList.add("modulo_selecionado")
            try {
              if (el.nextElementSibling.style.display == "block") { // Se o menu dropdown estiver aberto
                displayMenu(el.nextElementSibling) // Fecha o menu dropdown
                let span = document.createElement("span")
                span.classList.add("item_hiden")
                span.textContent = " / " + document.querySelector(".item_menu_selecionado").textContent
                el.querySelector(".span_modulo").appendChild(span) // Adiciona o texto do item selecionado ao botão
              } else {
                displayMenu(el.nextElementSibling)
                document.querySelector(".item_hiden").remove()
              }
            } catch (error) {}
          } else { // Se for um dropdown sem um item selecionado
            el.classList.toggle("modulo_pre-selecionado")
            displayMenu(el.nextElementSibling)
          }
        } else { // Se for um botão minimizado
            if(!btn){ // Se não for um botão
              modulo.classList.add("modulo_pre-selecionado")
              btnMenuLateral()
              displayMenu(modulo.nextElementSibling)
            }else {
              modulo.classList.add("modulo_selecionado") // Se for um botão adiciona a classe
            }
        }
      } else if (btn) {
        el.classList.remove("modulo_selecionado") // Retirando a classe selecionado de todos os outros modulos que não foram clicados
        try {
          document.querySelector(".btn_menu_selecionado").classList.remove("btn_menu_selecionado")
        } catch (error) {}
      }

      if (widthBody <= 480 && btn && !btnMini) {
        btnMenuLateral()
      }
    })

    document.querySelectorAll(".item_dropdown").forEach(e=>{ // Quando for selecionado um módulo é retirado a marcação de todos os itens do menu
      if(!btn_menu_selecionado)
        e.classList.remove("item_menu_selecionado")
    }) 
  }) 
})

let itemMenu = document.querySelectorAll(".item_dropdown")
itemMenu.forEach((e)=>{
  e.addEventListener("click",e=>{
    let widthBody = document.body.offsetWidth // Pega o tamanho do body
    if (widthBody <= 480){
      btnMenuLateral()
    }
  })
})


// Configurações de estilo dos itens do menu dropdown: 
let itens_dropdown = document.querySelectorAll(".item_dropdown") // Pega todos os itens de todos os módulos
itens_dropdown.forEach(e=>{
    e.addEventListener("click",e=>{ // Adiciona a função de clicar em todos
      document.querySelector(".modulo_pre-selecionado")?.classList.remove("modulo_pre-selecionado") // Se tiver um módulo pre-selecionado é retirada sua a classe
        itens_dropdown.forEach(i=>{
            if (i.id == e.currentTarget.id){
              let modulo_selecionado = document.querySelector(".modulo_selecionado") // Pega o modulo que estáva selecionado antes do item ser clicado 
              if (modulo_selecionado) { // Se tiver um módulo selecionado
                modulo_selecionado.classList.remove("modulo_selecionado") // Remove a classe "modulo_selecionado" de todos os módulos selecionados
              }
              let modulo_selecionado_atual = e.currentTarget.parentElement.parentElement.firstElementChild // Pega somente o ultimo módulo selecionado
              modulo_selecionado_atual.classList.add("modulo_selecionado") // Adiciona a classe "modulo_selecionado" somente no módulo clicado
              modulo_selecionado_atual.classList.add("btn_menu_selecionado") // Adiciona a classe "btn_menu_selecionado" somente no módulo clicado

              e.currentTarget.classList.add("item_menu_selecionado") // Adiciona a classe "item_menu_selecionado" somente no item clicado
            } else {
              i.classList.remove("item_menu_selecionado") // Tira a classe de todos os outros items
            }
        })
    })
})

let btn_fechar_menu = document.querySelector("#btn_fechar_menu") // Botão fechar e abrir o menu lateral
let click_btn_menu = false
btn_fechar_menu.addEventListener('click',()=>{
  btnMenuLateral('btn_lateral')
  click_btn_menu = true
})

document.addEventListener("click",(e)=>{
  let menuLateral = document.querySelector("#menu_lateral")
  let widthBody = document.body.offsetWidth // Pega o tamanho do body
  if (widthBody <= 640 && !menuLateral.classList.contains("mini") && !menuLateral.contains(e.target)) { // Clicar fora do menu com o body com menos de 640px fecha ele 
    btnMenuLateral() 
  }
})

// Sempre que a pagina for redimensionada e a tela for menor que 640px ele fecha o menu lateral
window.addEventListener("resize",()=>{
  let widthBody = document.body.offsetWidth // Pega o tamanho do body
  let menu_lateral = document.querySelector("#menu_lateral")
  if (widthBody <= 640 && !menu_lateral.classList.contains("mini")) {
    btnMenuLateral()
  }
});

// Menu Usuário:

let btnUsuario = document.querySelector("#usuario")
let menu_usuario = document.querySelector("#menu_usuario")
let usuario_seta = document.querySelector("#usuario_seta")
btnUsuario.addEventListener("click",()=>{ 
    if (menu_usuario.style.display == "none"){
        menu_usuario.style.display = "flex"
        usuario_seta.style.transform = "rotate(180deg)"
        usuario_seta.style.transition = ".1s"
    } else {
        menu_usuario.style.display = "none"
        usuario_seta.style.transform = "rotate(0deg)"
        usuario_seta.style.transition = ".1s"
    }
  })

// Menu Usuário - Configurações do usuário:
let btn_configuracao_usuario = document.querySelector("#btn_configuracao_usuario")
btn_configuracao_usuario.addEventListener("click",()=>{
  let item_hiden = false
  let btn_modulos_ativos = document.querySelectorAll(".modulo_selecionado, .modulo_pre-selecionado")

  if(document.querySelector(".item_hiden")){ // Se tiver um item do menu hiden
    document.querySelector(".item_hiden").remove()
    item_hiden = true
  }
  if (btn_modulos_ativos) { // Se tiver um modulo ativo
    btn_modulos_ativos.forEach(btn_modulo_ativo => {
      if (
        !btn_modulo_ativo.classList.contains("btn") && // Se nao for um botão
        !btn_modulo_ativo.classList.contains("mini") && // Se nao estiver minimizado
        !item_hiden // Se nao tiver um item hiden
      ) {
        displayMenu(btn_modulo_ativo.nextElementSibling, true) // Fecha o menu Dropdown
      }
      btn_modulo_ativo.classList.remove("modulo_selecionado")
      btn_modulo_ativo.classList.remove("modulo_pre-selecionado")
      btn_modulo_ativo.classList.remove("btn_menu_selecionado")
      let setaCimaBaixo = btn_modulo_ativo.querySelector(".seta_cima_baixo");
      if (setaCimaBaixo) { // Se for um módulo que tiver uma seta
        setaCimaBaixo.style.transform = "rotate(0deg)"; // Gira a seta para a posição padrão
      }
    })
  }
})

// Fechar o menu quando clicar fora do menu:
document.addEventListener("click",(e)=>{
    if(!btnUsuario.contains(e.target) && !menu_usuario.contains(e.target)){
      menu_usuario.style.display = "none"
      usuario_seta.style.transform = "rotate(0deg)"
      usuario_seta.style.transition = ".1s"
    }
})


export {carregarConteudo, btnMenuLateral, click_btn_menu,fecharMenu,mudarLogo}