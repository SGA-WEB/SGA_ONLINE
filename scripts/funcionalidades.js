function getBasePath() {
  const hostname = window.location.hostname;

    if (hostname.includes("github.io")) {
        // Ambiente GitHub Pages
        return "/SGA_ONLINE/imagens/";
    } else {
        // Ambiente local
        return "/imagens/";
    }
}

function visibilidadeSenha(senha, img) {
  // Obter o caminho base correto para as imagens
  let path = getBasePath();

  if (senha.type === 'password') {
    senha.type = 'text';
    img.src = path + "visibility_off.png"; // Caminho atualizado para ambiente
    img.id = "view_on";
  } else {
    senha.type = 'password';
    img.src = path + "visibility_on.png"; // Caminho atualizado para ambiente
    img.id = "view_off";
  }
}


  function dataAtual() {
    let p_data_cadastro = document.querySelector(".data_cadastro")
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
  }

  // Função que muda o placeholder do input de pesquisa de acordo com a opção do select
  function mudarPesquisa (input_pesquisa) { 
    input_pesquisa.placeholder = "Pesquisar por " +  $('.campo_select').find(':selected').text() // Adiciona o texto do select no placeholder 

    // Adiciona evento de mudança de seleção no select2
    $('.campo_select').on('select2:select', function (e) {
      // Sempre que o select for alterado muda o placeholder
      input_pesquisa.placeholder = "Pesquisar por " + e.params.data.text
      mudarPlaceholder() // Chama a funcao de mudar o placeholder sempre que o select for alterado
    })
    function mudarPlaceholder (){ 
      if (input_pesquisa.placeholder == "Pesquisar por Código" || input_pesquisa.placeholder == "Pesquisar por Quantidade") {
        input_pesquisa.type = "number"
      } else {
        input_pesquisa.type = "text"
      }
      input_pesquisa.value = "" 
    } 
    mudarPlaceholder() // Função é chamada assim que a pagina for carregada
  }

  export { visibilidadeSenha, dataAtual, mudarPesquisa}