import { dataAtual } from "../../../scripts/funcionalidades.js"
import { carregarConteudo } from "../../../scripts/javaScript.js"
export default function visualizar_produto (dados) {

    // Observa a adição do elemento .data_cadastro e chama a função dataAtual:
    // Função de callback do MutationObserver
    function callback(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Verifica se o elemento .data_cadastro foi adicionado
                const elemento = document.querySelector('.data_cadastro');
                const modulo = document.querySelector('.modulo');
                if (elemento) {
                    observer.disconnect(); // Para de observar
                    dataAtual();  // Chama a função dataAtual
                }
                if (modulo) {
                    moduloCarregado()
                }
            }
        }
    }

    // Configuração do observer
    const config = {
        childList: true, // Observa adição/remoção de nós filhos
        subtree: true   // Observa todos os descendentes
    };

    // Cria o observer
    const observer = new MutationObserver(callback);

    // Inicia a observação no body (ou em outro nó específico)
    observer.observe(document.body, config);

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