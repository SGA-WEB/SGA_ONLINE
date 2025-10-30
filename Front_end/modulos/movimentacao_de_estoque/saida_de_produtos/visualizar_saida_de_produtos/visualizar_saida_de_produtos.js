import select2 from "../../../../scripts/select.js";
import { formatarData } from "../../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../../scripts/javaScript.js";
import saida_de_produtos from "../saida_de_produtos.js";
import buscarDados from "../../../../scripts/buscarDados.js";
import { carregarDadosNaTabela } from "../../../../scripts/carregarDadosNaTabela.js";
import editar_saida_de_produtos from "../editar_saida_de_produtos/editar_saida_de_produtos.js";
import excluir_saida_de_produtos from "../excluir_saida_de_produtos.js";

export default async function visualizar_saida_de_produtos(saida) {
    select2("100%")
    document.querySelector(".codigo_id").textContent = saida.id_saida_produto
    document.querySelector(".data_cadastro").textContent = formatarData(saida.data_criacao)
    document.querySelector("#chave_nfe").value = saida.chave_nfe
    document.querySelector("#numero_nf").value = saida.numero_nf
    document.querySelector("#modelo").value = saida.modelo_documento_fiscal
    document.querySelector("#tipo_de_saida").value = saida.tipo_saida
    document.querySelector("#serie").value = saida.serie
    document.querySelector("#sub_serie").value = saida.subserie
    document.querySelector("#data_saida").value = formatarData(saida.data_saida, true)
    document.querySelector("#status_da_saida").value = saida.status
    document.querySelector("#destinatario").value = saida.destinatario_razao_social
    document.querySelector("#valor_total").value = saida.valor_total
    document.querySelector("#modelo").value = saida.modelo_documento_fiscal

    let produtosRelacionados = await buscarDados(`saida_produto/${saida.id_saida_produto}/itens`)
    carregarDadosNaTabela(produtosRelacionados.itens, ["id_produto", "nome_produto", "quantidade", "valor_unitario", "desconto_item", "valor_total_item"], document.querySelector(".tbody"), false, false)

    document.querySelector(".btn_editar").addEventListener("click", () => {
        carregarConteudo(
            "movimentacao_de_estoque/saida_de_produtos/editar_saida_de_produtos/editar_saida_de_produtos.html",
            document.querySelector(".principal"),
            false,
            editar_saida_de_produtos,
            saida,
            true
        )
    })

    document.querySelector(".btn_excluir").addEventListener("click", () => {
        excluir_saida_de_produtos(saida, saida_de_produtos, saida)
    })

    document.querySelector("#btn_voltar_saida_produtos").addEventListener("click", () => {
        carregarConteudo(
            "movimentacao_de_estoque/saida_de_produtos/saida_de_produtos.html",
            document.querySelector(".principal"),
            false,
            saida_de_produtos
        )
    })
}
