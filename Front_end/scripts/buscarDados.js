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
        const response = await fetch(`http://localhost:3000/api/${query}`);

        // Se a rota não existir ou der erro no servidor
        if (!response.ok) {
            console.warn(`Atenção: Rota /api/${query} retornou erro ${response.status}`);
            return [];
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error(`O servidor não retornou JSON para /api/${query}. Verifique o endpoint.`);
            return [];
        }

        const result = await response.json();

        // Padronização do retorno: Garante que sempre seja um Array
        if (Array.isArray(result)) return result;
        return result.itens || result.dados || result.clientes || result.usuarios || result;

    } catch (err) {
        console.error('Erro ao buscar dados:', err);
    }
}