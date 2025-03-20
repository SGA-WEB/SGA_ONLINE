export default function crudLayout (obj, tr) {
    let acoes = document.createElement('div') // Cria um div para as ações do CRUD
    acoes.setAttribute('class','acoes_tabela')

    let tituloBtnCRUD;
    for (let key in obj) {
        if (key.startsWith('id_')) {
            key = key.replace('id_', '')
            tituloBtnCRUD = key.replace('_', ' de ');
        }
    }

    let btn_visualizar = document.createElement('button') // Cria o botão de visualizar
    btn_visualizar.setAttribute('class','btn_visualizar')
    btn_visualizar.setAttribute('title',`Visualizar ${tituloBtnCRUD}`)
    let img_visualizar = document.createElement('img') // Cria a imagem do botão de visualizar
    img_visualizar.setAttribute('src','../imagens/visibility_on.png')
    btn_visualizar.appendChild(img_visualizar) // Adiciona a imagem no botão

    let btn_editar = document.createElement('button') // Cria o botão de editar
    btn_editar.setAttribute('class','btn_editar')
    btn_editar.setAttribute('title',`Editar ${tituloBtnCRUD}`)
    let img_editar = document.createElement('img') // Cria a imagem do botão de editar
    img_editar.setAttribute('src','../imagens/icone_editar.svg')
    btn_editar.appendChild(img_editar) // Adiciona a imagem no botão

    let btn_excluir = document.createElement('button') // Cria o botão de excluir
    btn_excluir.setAttribute('class','btn_excluir')
    btn_excluir.setAttribute('title',`Excluir ${tituloBtnCRUD}`)
    let img_excluir = document.createElement('img') // Cria a imagem do botão de excluir
    img_excluir.setAttribute('src','../imagens/icone_excluir.svg')
    btn_excluir.appendChild(img_excluir) // Adiciona a imagem no botão

    acoes.appendChild(btn_visualizar) // Adiciona o botão de visualizar nas ações
    acoes.appendChild(btn_editar) // Adiciona o botão de editar nas ações
    acoes.appendChild(btn_excluir) // Adiciona o botão de excluir nas ações

    btn_visualizar.addEventListener('click',() => {
        // Ao clicar no botão de visualizar
        console.log(tituloBtnCRUD)
    })

    tr.appendChild(acoes) // Adiciona as ações na linha
}