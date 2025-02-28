export default function buscarDados (query) {
    /*
        Autor: matheushnunes
        Data: 23/02/2025
        
        Parâmetros:
        query: String que contém o nome da tabela que será buscada no servidor

        Função:
        Buscar os dados no servidor e exibir na página;
        Possui uma função de pesquisa que filtra os dados exibidos na tabela;
        A pesquisa é feita com base no campo selecionado no select e no valor digitado no input de pesquisa;
    */

    async function fetchDados() {
        // Busca os dados no servidor
        try {
            const response = await fetch('https://sga-online.onrender.com/dados?tabela=' + query);
            const result = await response.json(); // Converte a resposta para JSON
            if (result) {
                // Exibe os dados na página
                carregarDadosNaTabela(result)
                pesquisar(result)
            } else {
                // Exibe a mensagem de erro
                console.error('Erro no servidor:', result.message);
            }
        } catch (err) {
            console.error('Erro ao buscar dados:', err);
        }
    }
    // Carrega os dados ao abrir a página
    fetchDados();
    
    let tabela = document.querySelector(".tbody") // Tabela onde os dados serão exibidos
    function carregarDadosNaTabela (data) {
        let [...tr_tabela] = document.querySelectorAll(".table_tr")
        tr_tabela.map(e => e.remove(e)) // Remove todos os elementos da tabela
        let td_info = document.querySelector(".td_nenhum_dado") // Pega o parágrafo de informação de que não há dados (Se existir)
    
        if (data.length !== 0 ) { // Se houver dados
            td_info ? td_info.remove() : null // Se houver o parágrafo de informação, ele é removido

            const firstDataKey = Object.keys(data[0])[0]; // Pega a primeira chave do primeiro objeto do array de dados, que no caso é o id
            data.sort((a, b) => a[firstDataKey] - b[firstDataKey]) // Ordena os dados pelo id

            data.map(obj => { // Para cada objeto no array de dados
                let tr = document.createElement('tr') // Cria uma linha
                tr.setAttribute('class','table_tr')
        
                for (let e in obj) { // Para cada campo no objeto
                    let td = document.createElement('td')
                    td.setAttribute('class','dado_tabela')
                    td.setAttribute('id', e + "_" + obj[e]) // nome do campo + valor do campo
                    if (typeof(obj[e]) == 'boolean') { 
                        // Se o campo for booleano, exibe "S" ou "N"
                        if (obj[e]) {
                            td.textContent = "S"
                        } else {
                            td.textContent = "N"
                        }
                    } else {
                        // Se não, exibe o valor do campo
                        td.textContent = obj[e]
                    }
                    tr.appendChild(td) // Adiciona a célula na linha
                }
    
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
    }
  
    function pesquisar(data) {
        // Função que pesquisa e manda os dados filtrados para a função carregarDadosNaTabela

        const btn_pesquisar = document.querySelector('.btn_pesquisar') // Botão de pesquisar
        const campo_select = document.querySelector('.campo_select') // Select que contém os campos da tabela
        const btn_limpar = document.querySelector('.btn_limpar_pesquisa') // Botão de fechar
        const input_pesquisar = document.querySelector('.input_pesquisa') // Input de pesquisa

        btn_pesquisar.addEventListener('click', handlePesquisar) // Quando o botão de pesquisar for clicado
        input_pesquisar.addEventListener('keyup', handlePesquisar) // Quando uma tecla for pressionada
        btn_limpar.addEventListener('click', () => { // Quando o botão de limpar for clicado
            input_pesquisar.value = "" // Limpa o input
            handlePesquisar() // Chama a função de pesquisa
        })

        function handlePesquisar () {
            let value_input_pesquisa = document.querySelector('.input_pesquisa').value // Valor do input de pesquisa

            if (value_input_pesquisa == "") { // Se o input estiver vazio
                btn_limpar.classList.add('hide') // Esconde o botão de fechar
            } else { // Se tiver algum valor
                btn_limpar.classList.remove('hide') // Mostra o botão de fechar
            }

            data = data.map(e => {
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

            const fuse = new Fuse(data, options) // Inicializa o fuse com os dados e as configurações
            
            let newData = fuse.search(value_input_pesquisa) // Faz a pesquisa
            newData = newData.map(e => e.item) // Pega apenas os itens do resultado da pesquisa

            if (value_input_pesquisa == "") { // Se o input estiver vazio
                newData = data // Exibe todos os dados
            }
            
            carregarDadosNaTabela(newData) // Manda os novos dados filtrados para a função carregarDadosNaTabela
        }  
    }
}