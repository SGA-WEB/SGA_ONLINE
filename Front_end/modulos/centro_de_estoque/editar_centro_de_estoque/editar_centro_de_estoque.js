import { dataAtual, aguardarRenderizacao } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js"
import visualizar_centro_de_estoque from "../visualizar_centro_de_estoque/visualizar_centro_de_estoque.js";
import centro_de_estoque from "../centro_de_estoque.js";

export default function editar_centro_de_estoque(dado, telaAnteriorVisualizar) {
    let caminho = "centro_de_estoque/centro_de_estoque.html"
    let funcao = centro_de_estoque

    if (telaAnteriorVisualizar) {
        // se a tela anterior for a de visualizar deve voltar
        // o caminho e a função é mudada para ir para tela de visualizar
        caminho = "centro_de_estoque/visualizar_centro_de_estoque/visualizar_centro_de_estoque.html"
        funcao = visualizar_centro_de_estoque
    }

    select2("100%")
    dataAtual()
    document.querySelector(".codigo_id").textContent = dado.id_centro_estoque
    document.querySelector("#nome_centro_de_estoque").value = dado.nome_centro_estoque
    document.querySelector("#localizacao").value = dado.localizacao_centro_estoque
    document.querySelector("#padrao_centro_de_estoque").value = dado.padrao_centro_estoque ? "true" : "false"
    document.querySelector("#descricao").value = dado.descricao_centro_estoque

    document.querySelector("#btn_voltar_produtos").addEventListener("click", () => {
        carregarConteudo(caminho, document.querySelector(".principal"), false, funcao, dado)
    })

    document.querySelector(".btn_cancelar").addEventListener("click", () => {
        carregarConteudo(caminho, document.querySelector(".principal"), false, funcao, dado)
    })

    document.querySelector(".btn_salvar").addEventListener("click", () => { 
        salvarEdicao(dado.id_centro_estoque)
    })
    
    async function salvarEdicao(id_centro_estoque) {
        const nome = document.querySelector("#nome_centro_de_estoque").value
        const localizacao = document.querySelector("#localizacao").value 
        const padrao = document.querySelector("#padrao_centro_de_estoque").value
        const descricao = document.querySelector("#descricao").value
        console.log(id_centro_estoque)
        try {
            const response = await fetch(`http://localhost:3000/centro_estoque/${id_centro_estoque}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, localizacao, padrao, descricao })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Dados atualizados com sucesso!');
                console.log('Usuário atualizado:', data);
                const novoDado = { 
                    // objeto para atualizar a tela de visualizar comforme os novos dados
                    id_centro_estoque: id_centro_estoque,
                    nome_centro_estoque: nome,
                    localizacao_centro_estoque: localizacao,
                    padrao_centro_estoque: padrao,
                    descricao_centro_estoque: descricao, 
                    data_cadastro: dado.data_cadastro
                }
                carregarConteudo(caminho, document.querySelector(".principal"), false, funcao, novoDado)
            } else {
                alert(`Erro: ${data.error}`);
            }
        } catch (error) {
            console.error('Falha ao conectar com o servidor:', error);
            alert('Erro ao salvar alterações. Tente novamente.');
        }
    }
}