import crudLayout from "./crudLayout.js";
import { formatarData } from "./funcionalidades.js";

export default function carregarDadosNosCards(dados, colunasBancoDeDados, colunasExibir, container = document.querySelector(".container_tabela")) {
    container.innerHTML = ""
    console.log(dados)
    console.log(colunasBancoDeDados)
    dados.map(objDado => { // Para cada objeto no array de dados
        let objDadoCompleto = objDado

        let sortedObjDado = {}; // Objeto com os dados ordenados comforme as colunas a serem exibidas
        colunasBancoDeDados.forEach(coluna => {
            sortedObjDado[coluna] = objDado[coluna];
        });
        objDado = sortedObjDado;

        objDado = Object.entries(objDado) // Converte o objeto em um array de pares chave-valor

        objDado = objDado.filter(([chave]) => colunasBancoDeDados.includes(chave)); // Filtra o array para incluir apenas as chaves que está no array colunas

        objDado = Object.fromEntries(objDado) // Converte o array em um objeto

        let card = document.createElement('div') // Cria um card
        card.setAttribute('class', 'card')
        card.setAttribute('id', objDado.id) // Define o id do card como o id do objeto

        let cardHeader = document.createElement('div') // Cria um card-header
        cardHeader.setAttribute('class', 'card_header')

        let cardBody = document.createElement('div') // Cria um card-body
        cardBody.setAttribute('class', 'card_body')

        card.appendChild(cardHeader)
        card.appendChild(cardBody)

        let indice = 0
        for(let dado in objDado) {
            if (objDado[dado] === true || objDado[dado] == "s") {
                objDado[dado] = "Sim"
            } 
            if (objDado[dado] === false || objDado[dado] == "n") {
                objDado[dado] = "Não"
            }
            if (dado.includes("id_")){
                let cardId = document.createElement('p')
                cardId.setAttribute('class', 'card_id')
                cardId.textContent = "Código: " + objDado[dado]
                cardHeader.appendChild(cardId)
                indice++
            } else if (dado.includes("nome_")){
                let cardTitle = document.createElement('h2')
                cardTitle.setAttribute('class', 'card_title')
                cardTitle.textContent = objDado[dado]
                cardHeader.appendChild(cardTitle)
                indice++
            }else if (dado.includes("data_")){
                let cardData = document.createElement('div')
                cardData.setAttribute('class', 'card_data')

                let cardChave = document.createElement('p')
                cardChave.setAttribute('class', 'card_chave')
                cardChave.textContent = colunasExibir[indice]
                cardData.appendChild(cardChave)

                let cardValor = document.createElement('p')
                cardValor.setAttribute('class', 'card_valor')
                cardValor.textContent = formatarData(objDado[dado])
                cardData.appendChild(cardValor)

                cardBody.appendChild(cardData)
                indice++
            }else {
                let cardInfo = document.createElement('div')
                cardInfo.setAttribute('class', 'card_info')

                let cardChave = document.createElement('p')
                cardChave.setAttribute('class', 'card_chave')
                cardChave.textContent = colunasExibir[indice]
                cardInfo.appendChild(cardChave)

                let cardValor = document.createElement('p')
                cardValor.setAttribute('class', 'card_valor')
                cardValor.textContent = objDado[dado]
                cardInfo.appendChild(cardValor)

                cardBody.appendChild(cardInfo)
                indice++
            }
        }
        let conainerCRUD = document.createElement('div')
        conainerCRUD.setAttribute('class', 'container_CRUD')
        card.appendChild(conainerCRUD)
        crudLayout(objDado, conainerCRUD)

        container.appendChild(card)
    })
}
