import { mudarPesquisa } from "../../scripts/funcionalidades.js";
import select2 from "../../scripts/select.js";
export default function centro_de_estoque() {
    mudarPesquisa(document.querySelector(".input_pesquisa"));
    select2("120px");

    async function fetchDados() {
        // Busca os dados no servidor
        try {
            const response = await fetch('http://localhost:5000/api/dados');
            const result = await response.json(); // Converte a resposta para JSON
            if (result.success) {
                // Exibe os dados na página
                carregarDadosNaTabela(result.data)
                pesquisar(result.data)
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
    }

    function pesquisar(data) {
        // Função que pesquisa e manda os dados filtrados para a função carregarDadosNaTabela

        let btn_pesquisar = document.querySelector('.btn_pesquisar') // Botão de pesquisar
        let campo_select = document.querySelector('.campo_select') // Select que contém os campos da tabela

        btn_pesquisar.addEventListener('click',()=>{ // Quando o botão for clicado
            let value_input_pesquisa = document.querySelector('.input_pesquisa').value // Valor do input de pesquisa

            let newData = data.filter(e => {
                // Filtra os dados de acordo com o valor do input de pesquisa e o campo selecionado
                let campo_selecionado = e[campo_select.value].toString().toLowerCase().trim() // Valor do campo selecionado
                let pesquisa = value_input_pesquisa.toLowerCase().trim() // Valor do input de pesquisa
                return (
                    // se o campo selecionado for igual ao valor do input de pesquisa
                    campo_selecionado.includes(pesquisa)
                )
            })

            carregarDadosNaTabela(newData) // Manda os novos dados filtrados para a função carregarDadosNaTabela

        })
    }


}