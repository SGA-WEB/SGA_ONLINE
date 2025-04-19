import { carregarDadosNaTabela, pesquisar } from './carregarDadosNaTabela.js';

export default async function buscarDados(query) {
    /*
        Autor: matheushnunes
        Data: 23/02/2025
        
        Parâmetros:
        query: String que contém o nome da tabela que será buscada no servidor
        limiteDados: number que contém o limite de dados que serão exibidos na tabela

        Função:
        Buscar os dados no servidor e exibir na página;
        Possui uma função de pesquisa que filtra os dados exibidos na tabela;
        A pesquisa é feita com base no campo selecionado no select e no valor digitado no input de pesquisa;
    */

    try {
        const response = await fetch(`http://localhost:3000/api/${query}`); // Faz a requisição para o servidor
        const result = await response.json(); // Converte a resposta para JSON
        if (result) {
            return result
        } else {
            // Exibe a mensagem de erro
            console.error('Erro no servidor:', result.message);
        }
    } catch (err) {
        console.error('Erro ao buscar dados:', err);
    }
}