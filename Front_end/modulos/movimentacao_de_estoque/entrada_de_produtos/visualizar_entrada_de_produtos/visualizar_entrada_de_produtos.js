import select2 from "../../../../scripts/select.js";
import { formatarData } from "../../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../../scripts/javaScript.js";
import entrada_de_produtos from "../entrada_de_produtos.js";
import buscarDados from "../../../../scripts/buscarDados.js";
import { carregarDadosNaTabela } from "../../../../scripts/carregarDadosNaTabela.js";
import editar_entrada_de_produtos from "../editar_entrada_de_produtos/editar_entrada_de_produtos.js";
import excluir_entrada_de_produtos from "../excluir_entrada_de_produtos.js";

export default async function visualizar_entrada_de_produtos(entrada) {
    select2("100%")
    document.querySelector(".codigo_id").textContent = entrada.id_entrada_produto
    document.querySelector(".data_cadastro").textContent = formatarData(entrada.data_criacao)
    document.querySelector("#chave_nfe").value = entrada.chave_nfe
    document.querySelector("#numero_nf").value = entrada.numero_nf
    document.querySelector("#modelo").value = entrada.modelo_documento_fiscal
    document.querySelector("#tipo_entrada").value = entrada.tipo_entrada
    document.querySelector("#serie").value = entrada.serie
    document.querySelector("#sub_serie").value = entrada.subserie
    document.querySelector("#data_recebimento").value = formatarData(entrada.data_recebimento, true)
    document.querySelector("#status").value = entrada.status
    document.querySelector("#fornecedor").value = entrada.fornecedor_razao_social

    let produtosRelacionados = await buscarDados(`entrada_produto/${entrada.id_entrada_produto}/itens`)
    if (!Array.isArray(produtosRelacionados)) {
        produtosRelacionados = produtosRelacionados?.itens || [];
    }
    carregarDadosNaTabela(produtosRelacionados, ["id_item", "nome_produto", "quantidade", "valor_unitario", "desconto_item", "valor_total_item"], document.querySelector(".tbody"), false, false)

    document.querySelector(".btn_editar").addEventListener("click", () => {
        carregarConteudo(
            "movimentacao_de_estoque/entrada_de_produtos/editar_entrada_de_produtos/editar_entrada_de_produtos.html",
            document.querySelector(".principal"),
            false,
            editar_entrada_de_produtos,
            entrada,
            true
        )
    })

    document.querySelector(".btn_excluir").addEventListener("click", () => {
        excluir_entrada_de_produtos(entrada, entrada_de_produtos, entrada)
    })

    document.querySelector("#btn_voltar_entrada_produtos").addEventListener("click", () => {
        carregarConteudo(
            "movimentacao_de_estoque/entrada_de_produtos/entrada_de_produtos.html",
            document.querySelector(".principal"),
            false,
            entrada_de_produtos
        )
    })
}
