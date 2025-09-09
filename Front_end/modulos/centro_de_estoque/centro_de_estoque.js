import { mudarPesquisa } from "../../scripts/funcionalidades.js";
import buscarDados from "../../scripts/buscarDados.js";
import select2 from "../../scripts/select.js";
import { carregarConteudo, fecharMenu } from "../../scripts/javaScript.js";
import { dataAtual } from "../../scripts/funcionalidades.js";
import { carregarDadosNaTabela, pesquisar } from "../../scripts/carregarDadosNaTabela.js";
import cadastro_centro_de_estoque from "./cadastro_centro_de_estoque/cadastro_centro_de_estoque.js";

export default async function centro_de_estoque() {
    mudarPesquisa(document.querySelector(".input_pesquisa"));
    select2("120px");
    let dados = await buscarDados('centro_estoque'); // Busca os dados da tabela, exibe na tela e permite pesquisar

    carregarDadosNaTabela(dados, ["id_centro_estoque", "nome_centro_estoque", "localizacao_centro_estoque", "padrao_centro_estoque"]) // Exibe na tela e permite pesquisar
    pesquisar(dados, ["id_centro_estoque", "nome_centro_estoque", "localizacao_centro_estoque", "padrao_centro_estoque"])


    let btnAdicionar = document.querySelector("#btn_adicionar_centro_de_estoque");
    btnAdicionar.addEventListener("click",() => {
        carregarConteudo("centro_de_estoque/cadastro_centro_de_estoque/cadastro_centro_de_estoque.html",  document.querySelector(".principal"), false, cadastro_centro_de_estoque) // Carrega o módulo de cadastro de produto
    })

    window.addEventListener("resize", () => {
        fecharMenu(document.querySelector(".tabela").offsetWidth, 510)
    })
}
