import { formatarData } from "./funcionalidades.js";

export default function carregarDadosNosCards(dados, colunas, container = document.querySelector(".container_tabela")) {
    container.innerHTML = ""
    dados.map(objDado => { // Para cada objeto no array de dados
        let objDadoCompleto = objDado

        let sortedObjDado = {}; // Objeto com os dados ordenados comforme as colunas a serem exibidas
        colunas.forEach(coluna => {
            sortedObjDado[coluna] = objDado[coluna];
        });
        objDado = sortedObjDado;

        objDado = Object.entries(objDado) // Converte o objeto em um array de pares chave-valor

        objDado = objDado.filter(([chave]) => colunas.includes(chave)); // Filtra o array para incluir apenas as chaves que está no array colunas

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

        for(let dado in objDado) {
            if (dado.includes("nome_")){
                let cardTitle = document.createElement('h2')
                cardTitle.setAttribute('class', 'card_title')
                cardTitle.textContent = objDado[dado]
                cardHeader.appendChild(cardTitle)
            } else if (dado.includes("id_")){
                let cardId = document.createElement('p')
                cardId.setAttribute('class', 'card_id')
                cardId.textContent = objDado[dado]
                cardHeader.appendChild(cardId)
            } else if (dado.includes("data_")){
                let cardData = document.createElement('p')
                cardData.setAttribute('class', 'card_data')
                cardData.textContent = formatarData(objDado[dado])
                cardBody.appendChild(cardData)
            }else {
                let cardInfo = document.createElement('p')
                cardInfo.setAttribute('class', 'card_info')
                cardInfo.textContent = objDado[dado]
                cardBody.appendChild(cardInfo)
            }

        }

        container.appendChild(card)
    })
}
