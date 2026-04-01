import select2 from "../../../scripts/select.js"
import { carregarConteudo } from "../../../scripts/javaScript.js"
import { formatarData } from "../../../scripts/funcionalidades.js"
import buscarDados from "../../../scripts/buscarDados.js"
import { carregarDadosNaTabela } from "../../../scripts/carregarDadosNaTabela.js"
import excluir_orcamento from "../excluir_orcamento.js"

export default async function visualizar_orcamento (dado) {
    select2("100%")
    document.querySelector(".codigo_id").textContent = dado.id_orcamento
    document.querySelector("#cliente").value = dado.cliente_razao_social
    document.querySelector("#desconto_total").value = dado.desconto_total
    document.querySelector("#criado_por_nome").value = dado.criado_por_nome
    document.querySelector("#status").value = dado.status
    document.querySelector(".data_cadastro").textContent = formatarData(dado.data_criacao)

    const orcamento_itens = await buscarDados(`orcamentos/${dado.id_orcamento}/itens`)
    const orcamento_itens_data = await orcamento_itens.itens

    carregarDadosNaTabela(orcamento_itens_data, ["id_item", "nome_produto", "quantidade", "valor_unitario", "desconto_item", "valor_total_item"], document.querySelector(".tbody"), false, false)

    document.querySelector(".btn_editar").addEventListener("click", ()=>{
        carregarConteudo("orcamento/editar_orcamento/editar_orcamento.html", document.querySelector(".principal"))
    })

    document.querySelector(".btn_excluir").addEventListener("click", ()=>{
        excluir_orcamento(dado)
    })

    document.querySelector("#btn_voltar_orcamento").addEventListener("click", ()=>{
        carregarConteudo("orcamento/orcamento.html", document.querySelector(".principal"))
    })
}
