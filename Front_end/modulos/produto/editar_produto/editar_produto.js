import { carregarConteudo } from '../../../scripts/javaScript.js'
import select2 from '../../../scripts/select.js'
import produto from '../produto.js'
import visualizar_produto from '../visualizar_produto/visualizar_produto.js'
import { dataAtual } from '../../../scripts/funcionalidades.js'
import { popup_carregando, popup_aviso, popup_erro } from '../../../scripts/popup.js'

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

    document.querySelector(".btn_cancelar").addEventListener("click",() => {
        carregarConteudo(caminho, document.querySelector('.principal'), false, funcao, dado)
    })

    let btnSalvar = document.querySelector('.btn_salvar')  

    btnSalvar.addEventListener("click", () => {
        salvarEdicaoProduto(dado.id_produto)  
    })

    async function salvarEdicaoProduto(id_produto) {
        const produto = document.querySelector("#nome_produto").value;
        const quantidade = document.querySelector("#quantidade_em_estoque").value;
        const preco_varejo = document.querySelector("#valor_varejo").value;
        const preco_atacado = document.querySelector("#valor_atacado").value;
        
        popup_carregando();
        try {
            const response = await fetch(`http://localhost:3000/produto/${id_produto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ produto, quantidade, preco_varejo, preco_atacado })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                const novoDado = { 
                    id_produto: id_produto,
                    produto: produto,
                    quantidade: quantidade,
                    preco_varejo: preco_varejo,
                    preco_atacado: preco_atacado,
                };
                popup_carregando(true);
                carregarConteudo(caminho, document.querySelector(".principal"), false, funcao, novoDado);
                popup_aviso("Produto atualizado com sucesso!");
            } else {
                alert(`Erro: ${data.error}`);
            }
        } catch (error) {
            console.error('Falha ao conectar com o servidor:', error);
            alert('Erro ao salvar alterações. Tente novamente.');
        }
    }

}