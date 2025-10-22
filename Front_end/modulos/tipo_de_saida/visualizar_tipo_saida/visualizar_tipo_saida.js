import { carregarConteudo } from "../../scripts/javaScript.js";
// MODIFICADO: Importa o módulo de cadastro de 'saida'
import cadastro_tipo_saida from "./cadastro_tipo_saida/cadastro_tipo_saida.js";
import buscarDados from "../../scripts/buscarDados.js";
import { carregarDadosNaTabela } from "../../scripts/carregarDadosNaTabela.js";
import select2 from "../../scripts/select.js";
import { pesquisar } from "../../scripts/carregarDadosNaTabela.js";
import { mudarPesquisa } from "../../scripts/funcionalidades.js";
import { popup_carregando } from "../../scripts/popup.js";

// MODIFICADO: Nome da função
export default async function tipos_de_saida () {
    // MODIFICADO: Mensagem de carregamento
    popup_carregando(false, "Carregando tipos de saída...");
    
    // MODIFICADO: Endpoint da API para buscar dados
    let dados = await buscarDados('tipos_saida')
    
    // MODIFICADO: Coluna de ID
    const colunas = ["id_tipo_de_saida", "descricao", "cfop_dentro", "cfop_fora", "ativo"]

    select2("fit-content")
    carregarDadosNaTabela(dados, colunas)
    pesquisar(dados, colunas)
    mudarPesquisa(document.querySelector("#input_pesquisa_tabela"))

    // MODIFICADO: Seletor do botão "adicionar"
    document.querySelector("#btn_adicionar_tipos_de_saida").addEventListener("click",() => {
        // MODIFICADO: Caminho do HTML e módulo de cadastro
        carregarConteudo("tipo_de_saida/cadastro_tipo_saida/cadastro_tipo_saida.html", document.querySelector(".principal"), false, cadastro_tipo_saida, dados)
    })
    
    popup_carregando(true)
}