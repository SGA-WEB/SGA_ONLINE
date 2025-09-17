import select2 from "../../../scripts/select.js";
import { dataAtual, alterarOptionsSelect } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import buscarDados from "../../../scripts/buscarDados.js";
import { popup, popup_aviso, popup_carregando, popup_erro } from "../../../scripts/popup.js";
import produto from "../produto.js";

export default async function cadastro_produto() {
    dataAtual() // Pega a data atual e adiciona ao input
    select2("100%") // Inicializa o select2

    // Busca os centros de estoque e adiciona ao select
    let centros_de_estoque = await buscarDados("centro_estoque")
    console.log(centros_de_estoque)
    alterarOptionsSelect(
        document.querySelector("#id_centro_estoque"),
        centros_de_estoque,
        3
    )

    // Busca o maior id de produto e adiciona +1 para o próximo produto
    let produtos = await buscarDados('produto');
    let produtoComMaiorId = produtos.reduce((prev, curr) => {
        return prev.id_produto > curr.id_produto ? prev : curr;
    })
    document.querySelector(".codigo_id").innerHTML = produtoComMaiorId.id_produto + 1;

    document.querySelector("#btn_voltar_produtos").addEventListener("click", () => {
        // Botão que volta para a tela de produtos
        carregarConteudo("produto/produto.html", document.querySelector(".principal"))
    })
    let form = document.querySelector("form")
    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        popup_carregando()

        let dados = Object.fromEntries(new FormData(form))
        let sucesso = await enviarFormulario(dados)

        if (sucesso) {
            popup_aviso("Produto cadastrado com sucesso!")
            form.reset()
            carregarConteudo("produto/produto.html", document.querySelector(".principal"), false, produto)
        } else {
            popup_erro("Erro ao cadastrar produto. Tente novamente.")
        }
        popup_carregando(true)
    })

    async function enviarFormulario(dados) {
        // Converte de strin para number usando o operador unário '+'
        dados.preco_varejo = +dados.preco_varejo;
        dados.preco_atacado = +dados.preco_atacado;
        dados.quantidade = +dados.quantidade;
        dados.id_centro_estoque = +dados.id_centro_estoque;
        try {
            const response = await fetch('http://localhost:3000/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return true
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            return false
        }
    }
}
