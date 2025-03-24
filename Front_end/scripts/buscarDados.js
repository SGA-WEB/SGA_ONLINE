import {carregarDadosNaTabela, pesquisar} from './carregarDadosNaTabela.js';
import configuracao_usuario from '../modulos/configuracao_usuario/configuracao_usuario.js';
export default function buscarDados (query, tabela = true) {
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
            const response = await fetch('http://localhost:3000/api/dados?tabela=' + query);
            const result = await response.json(); // Converte a resposta para JSON
            if (result) {
                // Exibe os dados na página
                if (tabela){
                    carregarDadosNaTabela(result)
                    pesquisar(result)
                } else {
                    configuracao_usuario(result)
                }
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
}