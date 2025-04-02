import { carregarConteudo } from '../../../scripts/javaScript.js'
import select2 from '../../../scripts/select.js'
import produto from '../produto.js'
import visualizar_produto from '../visualizar_produto/visualizar_produto.js'
import { dataAtual } from '../../../scripts/funcionalidades.js'

export default function editar_produto (dado, telaAnteriorVisualizar) {
    let caminho = "produto/produto.html"
    let funcao = produto
    
    select2("10rem")
    dataAtual()

    if (telaAnteriorVisualizar) {
        caminho = "produto/visualizar_produto/visualizar_produto.html"
        funcao = visualizar_produto
    }

    let codigo_produto = document.querySelector('.codigo_id')
    let valor_varejo = document.querySelector('#valor_varejo')
    let valor_atacado = document.querySelector('#valor_atacado')
    let nome_produto = document.querySelector('#nome_produto')
    let quantidade_em_estoque = document.querySelector('#quantidade_em_estoque')
    let centro_de_estoque = document.querySelector('#centro_de_estoque')

    codigo_produto.textContent = dado.id_produto
    valor_varejo.value = dado.preco_varejo
    valor_atacado.value = dado.preco_atacado
    nome_produto.value = dado.produto
    quantidade_em_estoque.value = dado.quantidade


    let btnVoltar = document.querySelector('.btn_voltar')
    btnVoltar.addEventListener('click', () => {
        carregarConteudo(caminho, document.querySelector('.principal'), false, funcao, dado)
    })

    let btnSalvar = document.querySelector('.btn_salvar')  
    btnSalvar.addEventListener("click", () => {
        alert("Alterações no produto salvas com sucesso")
        carregarConteudo(caminho, document.querySelector('.principal'), false, funcao, dado)
    })

    document.querySelector(".btn_cancelar").addEventListener("click",() => {
        carregarConteudo(caminho, document.querySelector('.principal'), false, funcao, dado)
    })
}