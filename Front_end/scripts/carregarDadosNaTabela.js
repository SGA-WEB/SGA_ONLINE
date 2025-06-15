// Objetivo: Função que carrega os dados na tabela e função que pesquisa os dados
// Cria os botões de editar, visualizar e excluir (CRUD) e os adiciona nas tabelas

import crudLayout from "./crudLayout.js" // Importa a função que cria os botões de editar, visualizar e excluir (CRUD)
import { formatarData } from "./funcionalidades.js"

function carregarDadosNaTabela (dados, colunasExibir, tabela = document.querySelector(".tbody"), ativarCrud = true, addListener = true) {
    // ColunasExibir: Array com os nomes das colunas do banco de dados que serão exibidas na tabela
    let [...tr_tabela] = document.querySelectorAll(".table_tr")
    tr_tabela.map(e => e.remove(e)) // Remove todos os elementos da tabela
    let td_info = document.querySelector(".td_nenhum_dado") // Pega o parágrafo de informação de que não há dados (Se existir)

    if (dados.length !== 0 ) { // Se houver dados
        td_info ? td_info.remove() : null // Se houver o parágrafo de informação, ele é removido

        const firstDataKey = Object.keys(dados[0])[0]; // Pega a primeira chave do primeiro objeto do array de dados, que no caso é o id
        dados.sort((a, b) => a[firstDataKey] - b[firstDataKey]) // Ordena os dados pelo id


        dados.map(objDado => { // Para cada objeto no array de dados
            let objDadoCompleto = objDado
            objDado = Object.entries(objDado) // Pega os campos até o limite de dados
            objDado = objDado.filter(e => {
                for (let coluna of colunasExibir) {
                    if (e[0] === coluna) {
                        return e // Se o campo estiver no array de colunas a serem exibidas, retorna true
                    }
                }
            })
            objDado = Object.fromEntries(objDado) // Converte o array em um objeto
            let tr = document.createElement('tr') // Cria uma linha
            tr.setAttribute('class','table_tr')
            tr.setAttribute('id', 'tr_' + objDado[firstDataKey]) // Define o id da linha como tr_id

            let td = document.createElement('td') // Cria uma célula
            td.setAttribute("class", "selecionar_linha")
            let checkbox = document.createElement('input') // Cria um checkbox
            checkbox.setAttribute('type', 'checkbox') // Define o tipo do input como checkbox
            checkbox.setAttribute('id', 'checkbox_' + objDado[firstDataKey]) // Define o id da célula como checkbox_id
            checkbox.setAttribute('class', 'checkbox_selecionar_linha') // Define a classe do checkbox
            td.appendChild(checkbox) // Adiciona o checkbox na célula
            tr.appendChild(td) // Adiciona a célula na linha
            for (let e in objDado) { // Para cada campo no objeto
                if (e === "data_cadastro") {
                    continue
                }
                if (e.search("data") != -1) {
                    objDado[e] = formatarData(objDado[e])
                }
                let td = document.createElement('td')
                td.setAttribute('class','dado_tabela')
                td.setAttribute('id', e + "_" + objDado[e]) // nome do campo + valor do campo
                if (typeof(objDado[e]) == 'boolean') {
                    // Se o campo for booleano, exibe "S" ou "N"
                    if (objDado[e]) {
                        td.textContent = "S"
                    } else {
                        td.textContent = "N"
                    }
                } else {
                    // Se não, exibe o valor do campo
                    td.textContent = objDado[e]
                }

                tr.appendChild(td) // Adiciona a célula na linha
            }

            // CRUD:
            if (ativarCrud) {
                crudLayout(objDadoCompleto, tr, addListener) // Adiciona os botões de editar, visualizar e excluir na linha
            }

            checkbox.addEventListener("change", (e) => {
                // Adiciona o evento de mudança no checkbox
                let tr = e.target.parentElement.parentElement // Pega a linha da célula do checkbox
                console.log(e.target)
                if (e.target.checked) { // Se o checkbox estiver marcado
                    tr.classList.add("linha_selecionada") // Adiciona a classe "selecionado" na linha
                } else { // Se o checkbox estiver desmarcado
                    tr.classList.remove("linha_selecionada") // Remove a classe "selecionado" da linha
                }
            })

            tabela.appendChild(tr) // Adiciona a linha na tabela
        })
    } else { // Se não houver dados
        if (!td_info) { // Se o parágrafo de informação não existir
            // Cria o parágrafo com a informação de que não há dados
            td_info = document.createElement('td')
            td_info.setAttribute('class','td_nenhum_dado')
            td_info.setAttribute('colspan','5')
            td_info.textContent = "Nenhum dado encontrado"
            tabela.appendChild(td_info)
        }
    }
    tabela.addEventListener("click", (e) => {
        let tr_id = e.target.parentElement.id.replace("tr_", "") // Pega número do id do elemento clicado
        let checkbox = document.querySelector("#checkbox_" + tr_id) // Pega o checkbox da linha clicada
        if (checkbox) { // Se o checkbox existir
            checkbox.checked = !checkbox.checked // Inverte o estado do checkbox
            if (checkbox.checked) {
                e.target.parentElement.classList.add("linha_selecionada")
            } else {
                e.target.parentElement.classList.remove("linha_selecionada")
            }
        }
    })

    let selecionar_todos = tabela.parentElement.querySelector("#selecionar_todos")
    selecionar_todos.addEventListener("change", (e) => {
        let checkboxes = document.querySelectorAll(".checkbox_selecionar_linha")
        for (let checkbox of checkboxes) {
            if (selecionar_todos.checked) {
                checkbox.checked = true // Marca todos os checkboxes
            } else {
                checkbox.checked = false // Desmarca todos os checkboxes
            }
        }
    })
}

function pesquisar(dados, colunasExibir, tabela = document.querySelector("#tabela"), ativarCrud = true) {
    // Função que pesquisa e manda os dados filtrados para a função carregarDadosNaTabela

    const btn_pesquisar = document.querySelector('.btn_pesquisar') // Botão de pesquisar
    const campo_select = document.querySelector('#select_coluna') // Select que contém os campos da tabela
    const btn_limpar = document.querySelector('.btn_limpar_pesquisa') // Botão de fechar
    const input_pesquisar = document.querySelector('.input_pesquisa') // Input de pesquisa

    btn_pesquisar.addEventListener('click', handlePesquisar) // Quando o botão de pesquisar for clicado
    input_pesquisar.addEventListener('keyup', handlePesquisar) // Quando uma tecla for pressionada
    btn_limpar.addEventListener('click', () => { // Quando o botão de limpar for clicado
        input_pesquisar.value = "" // Limpa o input
        handlePesquisar() // Chama a função de pesquisa
    })
    $('#select_coluna').on('change', () => {
        input_pesquisar.value = "" // Limpa o input
        handlePesquisar()
    }) // Quando o select for alterado

    function handlePesquisar () {
        let value_input_pesquisa = document.querySelector('.input_pesquisa').value // Valor do input de pesquisa

        if (value_input_pesquisa == "") { // Se o input estiver vazio
            btn_limpar.classList.add('hide') // Esconde o botão de fechar
        } else { // Se tiver algum valor
            btn_limpar.classList.remove('hide') // Mostra o botão de fechar
        }

        dados = dados.map(e => {
            // Converte os campos booleanos para "s" ou "n"
            if (typeof(e.padrao_centro_estoque) === 'boolean') {
                e.padrao_centro_estoque = e.padrao_centro_estoque ? "s" : "n"
            }
            return e
        })

        let threshold // Define a tolerância da pesquisa
        if (campo_select.value == "padrao_centro_estoque"){
            // Se o campo selecionado for o "padrão", a pesquisa será feita com mais tolerância a variação de valores
            threshold = 0.7
        } else if (campo_select.value == "localizacao_centro_estoque") {
            // Se o campo selecionado for "localização", a pesquisa será feita com tolerancia 0
            threshold = 0
        } else if (campo_select.value.includes("id")) {
            // Se o campo selecionado contiver "id" em alguma parte do valor, a pesquisa será feita com tolerancia 0
            threshold = 0
        } else {
            threshold = 0.3
        }
        const options = {
            keys: [campo_select.value],
            threshold: threshold,
        }
        const fuse = new Fuse(dados, options) // Inicializa o fuse com os dados e as configurações

        let newData

        if (value_input_pesquisa.includes('*')) {
            // Remove o curinga e ajusta a lógica de pesquisa
            let padrao = value_input_pesquisa.replace(/\*/g, ''); // Remove todos os "*"

            value_input_pesquisa = value_input_pesquisa.toUpperCase() // Converte o valor da pesquisa para maiúsculo
            padrao = padrao.toUpperCase() // Converte o padrão para maiúsculo

            // Se tiver algum caractere coringa "*" na pesquisa:
            if (value_input_pesquisa.startsWith('*') && value_input_pesquisa.endsWith('*')) {
                // *a*: Contém "a" em qualquer lugar
                newData = dados.filter(item => {
                    let itemUpperCase = item[campo_select.value].toUpperCase()
                    return itemUpperCase.includes(padrao)
                });

            } else if (value_input_pesquisa.startsWith('*')) {
                // *a: Termina com "a"
                newData = dados.filter(item => {
                    let itemUpperCase = item[campo_select.value].toUpperCase()
                    return itemUpperCase.endsWith(padrao)
                });

            } else if (value_input_pesquisa.endsWith('*')) {
                // a*: Começa com "a"
                newData = dados.filter(item => {
                    let itemUpperCase = item[campo_select.value].toUpperCase()
                    return itemUpperCase.startsWith(padrao)
                });
            }
        } else { // Se não tiver o caractere coringa "*" na pesquisa o fuse é utilizado
            newData = fuse.search(value_input_pesquisa) // Faz a pesquisa
            newData = newData.map(e => e.item) // Pega apenas os itens do resultado da pesquisa
        }

        if (value_input_pesquisa == "") { // Se o input estiver vazio
            newData = dados // Exibe todos os dados
        }
        carregarDadosNaTabela(newData, colunasExibir, tabela, ativarCrud) // Manda os novos dados filtrados para a função carregarDadosNaTabela
    }
}

export { carregarDadosNaTabela, pesquisar } // Exporta as funções para serem usadas em outros arquivos
