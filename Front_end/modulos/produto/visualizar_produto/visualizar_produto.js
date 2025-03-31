import { carregarConteudo } from "../../../scripts/javaScript.js"
import { esperarCarregarConteudo } from "../../../scripts/funcionalidades.js"

export default function visualizar_produto (dados) {
    esperarCarregarConteudo(moduloCarregado)
    
    function moduloCarregado() {
        let codigo_produto = document.querySelector('.codigo_id')
        let valor_varejo = document.querySelector('#valor_varejo')
        let valor_atacado = document.querySelector('#valor_atacado')
        let nome_produto = document.querySelector('#nome_produto')
        let quantidade_em_estoque = document.querySelector('#quantidade_em_estoque')
        let centro_de_estoque = document.querySelector('#centro_de_estoque')
    
        codigo_produto.textContent = dados.id_produto
        valor_varejo.value = dados.preco_varejo
        valor_atacado.value = dados.preco_atacado
        nome_produto.value = dados.produto
        quantidade_em_estoque.value = dados.quantidade

        let btnVoltar = document.querySelector('.btn_voltar')
        btnVoltar.addEventListener('click', () => {
            carregarConteudo("produto/produto.html", document.querySelector('.principal'))
        })
    }
}