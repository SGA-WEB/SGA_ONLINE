import { carregarConteudo } from "../../../scripts/javaScript.js"
import select2 from "../../../scripts/select.js"
import editar_produto from "../editar_produto/editar_produto.js"
import excluir_produto from "../excluir_produto.js"
import { popup } from "../../../scripts/popup.js"
import { formatarData, alterarOptionsSelect } from "../../../scripts/funcionalidades.js"
import buscarDados from "../../../scripts/buscarDados.js"

export default async function visualizar_produto (dado) {
    select2("100%")

    let centros_de_estoque = await buscarDados("centro_estoque")
    alterarOptionsSelect(
        document.querySelector("#selecionar_centro_de_estoque"),
        centros_de_estoque,
        dado.fk_id_centro_estoque
    )

    let codigo_produto = document.querySelector('.codigo_id')
    let valor_varejo = document.querySelector('#valor_varejo')
    let valor_atacado = document.querySelector('#valor_atacado')
    let nome_produto = document.querySelector('#nome_produto')
    let quantidade_em_estoque = document.querySelector('#quantidade_em_estoque')
    let data_cadastro = document.querySelector('.data_cadastro')
    let descricao = document.querySelector('#descricao')
    let corredor = document.querySelector('#corredor')
    let prateleira = document.querySelector('#prateleira')

    data_cadastro.textContent = formatarData(dado.data_cadastro)
    codigo_produto.textContent = dado.id_produto
    valor_varejo.value = dado.preco_varejo
    valor_atacado.value = dado.preco_atacado
    nome_produto.value = dado.produto
    quantidade_em_estoque.value = dado.quantidade
    descricao.value = dado.descricao
    corredor.value = dado.corredor
    prateleira.value = dado.prateleira

    let btnVoltar = document.querySelector('.btn_voltar')
    btnVoltar.addEventListener('click', () => {
        carregarConteudo("produto/produto.html", document.querySelector('.principal'))
    })

    document.querySelector("#btn_voltar_produtos").addEventListener("click", () => {
        // Botão que volta para a tela de centro de estoque
        carregarConteudo("produto/produto.html", document.querySelector(".principal"))
    })

    document.querySelector(".btn_editar").addEventListener("click", () => {
        carregarConteudo("produto/editar_produto/editar_produto.html", document.querySelector(".principal"), false, editar_produto, dado, true)
    })

    let btn_excluir = document.querySelector(".btn_excluir")
    btn_excluir.addEventListener("click",() => {
        excluir_produto(dado, carregarConteudo, "produto/produto.html", document.querySelector(".principal"))
    })
}
