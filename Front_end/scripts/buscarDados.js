import { carregarDadosNaTabela, pesquisar } from './carregarDadosNaTabela.js';

export default async function buscarDados(query) {
    /*
        Autor: matheushnunes
        Data: 23/02/2025
        
        Parâmetros:
        query: String que contém o nome da tabela que será buscada no servidor

        Função:
        Buscar os dados no servidor e exibir na página;
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