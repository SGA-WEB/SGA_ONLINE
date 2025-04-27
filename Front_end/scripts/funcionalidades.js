/*
  Arquivo com funções que são utilizadas em mais de uma página;
  Funções:
    - getBasePath: Retorna o caminho base correto para as imagens.
    - visibilidadeSenha: Mostra ou esconde a senha do input de senha;
    - dataAtual: Mostra a data atual no formato dd/mm/aaaa;
    - mudarPesquisa: Muda o placeholder do input de pesquisa de acordo com a opção do select;
*/

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

  console.log(path)

  if (senha.type === 'password') {
    senha.type = 'text';
    img.src = `../${path}visibility_off.png`;
    img.id = "view_on";
  } else {
    senha.type = 'password';
    img.src = `../${path}visibility_off.png`;
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
  if (p_data_cadastro) {
    p_data_cadastro.innerHTML = `${dia}/${mes}/${data.getFullYear()}`
  }
}

function formatarData(data) {
  let data_cadastro =  data.split("T")[0] // Retira o horário
  const [ano, mes, dia] = data_cadastro.split('-'); // Separa o ano, mes e dia
  data_cadastro = `${dia}-${mes}-${ano}`; // Formata a data
  return data_cadastro
}

// Função que muda o placeholder do input de pesquisa de acordo com a opção do select
function mudarPesquisa(input_pesquisa) {
  input_pesquisa.placeholder = "Pesquisar por " + $('.campo_select')
    .find(':selected')
    .text() // Adiciona o texto do select no placeholder 

  // Adiciona evento de mudança de seleção no select2
  $('.campo_select').on('select2:select', function (e) {
    // Sempre que o select for alterado muda o placeholder
    input_pesquisa.placeholder = "Pesquisar por " + e.params.data.text
    mudarPlaceholder() // Chama a funcao de mudar o placeholder sempre que o select for alterado
  })

  function mudarPlaceholder() {
    if (input_pesquisa.placeholder == "Pesquisar por Código" || input_pesquisa.placeholder == "Pesquisar por Quantidade") {
      input_pesquisa.type = "number"
    } else {
      input_pesquisa.type = "text"
    }
    input_pesquisa.value = "" // Limpa o input de pesquisa
    document.querySelector('.btn_limpar_pesquisa').classList.add('hide') // Esconde o botão de limpar pesquisa
  }
  mudarPlaceholder() // Função é chamada assim que a pagina for carregada
}

function visibilidadeMenulateral(elementoWidth, minWidth) {
  let menu_lateral = document.querySelector("#menu_lateral")
  let principal = document.querySelector(".principal")

  if (elementoWidth <= minWidth) {
    menu_lateral.classList.add("opacidade")
    principal.classList.add("opacidade")
  } else {
    menu_lateral.classList.remove("opacidade")
    principal.classList.remove("opacidade")
  }
}

// Função para aguardar a renderização completa de um elemto
function aguardarRenderizacao(elemento) {
  return new Promise((resolve) => {
    // Verifica se há scripts ou imagens pendentes
    const scripts = elemento.querySelectorAll("script");
    const imagens = elemento.querySelectorAll("img");

    let carregamentosPendentes = 0;

    // Verifica scripts externos (se houver)
    scripts.forEach((script) => {
      if (script.src && !script.loaded) {
        carregamentosPendentes++;
        script.onload = () => {
          carregamentosPendentes--;
          verificarConclusao();
        };
      }
    });

    // Verifica imagens (se houver)
    imagens.forEach((img) => {
      if (!img.complete) {
        carregamentosPendentes++;
        img.onload = img.onerror = () => {
          carregamentosPendentes--;
          verificarConclusao();
        };
      }
    });

    // Se não houver recursos pendentes, resolve imediatamente
    if (carregamentosPendentes === 0) {
      resolve();
      return;
    }

    // Função para verificar se tudo foi carregado
    function verificarConclusao() {
      if (carregamentosPendentes === 0) {
        // Última verificação após um frame de renderização
        requestAnimationFrame(() => resolve());
      }
    }
  });
}

function alterarOptionsSelect(select, dados_centros, id_centro_estoque) {
  // Alterar o select de acordo com os dados da tabela
  for (let i = 0; i < dados_centros.length; i++) {
    let option = document.createElement("option")
    option.value = dados_centros[i].id_centro_estoque  
    option.text = dados_centros[i].nome_centro_estoque
    select.appendChild(option)
  }
  select.value = id_centro_estoque
}

export {
  visibilidadeSenha,
  dataAtual,
  formatarData,
  mudarPesquisa,
  visibilidadeMenulateral,
  aguardarRenderizacao,
  alterarOptionsSelect
}