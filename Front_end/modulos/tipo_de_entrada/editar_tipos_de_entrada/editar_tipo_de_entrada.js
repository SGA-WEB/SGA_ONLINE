import { dataAtual, aguardarRenderizacao, formatarData } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js"
import { popup, popup_aviso, popup_carregando } from "../../../scripts/popup.js";
import tipos_de_entrada from "../tipos_de_entrada.js";

export default function editar_tipo_de_entrada(dado, telaAnteriorVisualizar) {
    select2("100%")
   
    document.querySelector("#btn_voltar_tipos_de_entrada").addEventListener("click", () => {
        carregarConteudo("tipo_de_entrada/tipos_de_entrada.html", document.querySelector(".principal"),false, tipos_de_entrada)
    })
    document.querySelector(".data_cadastro").innerHTML = formatarData(dado.data_criacao)
    document.querySelector(".codigo_id").innerHTML = dado.id_tipo_de_entrada
    document.querySelector("#descricao").value = dado.descricao
    document.querySelector("#cfop_dentro").value = dado.cfop_dentro
    document.querySelector("#cfop_fora").value = dado.cfop_fora
    document.querySelector("#ativo").value = dado.ativo
    document.querySelector("#hab_agrupamento").checked = dado.hab_agrupamento
    document.querySelector("#movimenta_estoque").checked = dado.movimenta_estoque
    document.querySelector("#hab_movimento").checked = dado.hab_movimenta
    document.querySelector("#hab_nf").checked = dado.habilita_nf
    document.querySelector("#atualiza_produto").checked = dado.atualiza_produto
    document.querySelector("#padrao").checked = dado.padrao
    
    document.querySelector(".btn_salvar").addEventListener("click", async () => {
        salvarEdicao(dado.id_tipo_de_entrada)
        async function salvarEdicao(id_tipo_de_entrada) {
            // const data_cadastro = document.querySelector(".data_cadastro").textContent 
            // const id_tipo_de_cadastro = document.querySelector(".id_tipo_de_entrada").textContent
            const descricao = document.querySelector("#descricao").value
            const cfop_dentro = document.querySelector("#cfop_dentro").value
            const cfop_fora = document.querySelector("#cfop_fora").value
            const ativo = document.querySelector("#ativo").value
            const hab_agrupamento = document.querySelector("#hab_agrupamento").checked
            const movimenta_estoque = document.querySelector("#movimenta_estoque").checked
            const hab_movimento = document.querySelector("#hab_movimento").checked
            const habilita_nf = document.querySelector("#hab_nf").checked
            const atualiza_produto = document.querySelector("#atualiza_produto").checked
            const padrao = document.querySelector("#padrao").checked
            
            console.log(hab_nf, movimenta_estoque)
            popup_carregando()
            try {
                const response = await fetch(`http://localhost:3000/tipos_entrada/${id_tipo_de_entrada}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ descricao, cfop_dentro, cfop_fora, ativo, hab_agrupamento, movimenta_estoque, hab_movimento, habilita_nf, atualiza_produto, padrao  })
                });

                const data = await response.json();

                if (response.ok) {
                    const novoDado = { 
                        // objeto para atualizar a tela de visualizar comforme os novos dados
                        descricao: descricao,
                        cfop_fora: cfop_fora,
                        cfop_dentro: cfop_dentro,
                        ativo: ativo,
                        hab_agrupamento: hab_agrupamento,
                        movimenta_estoque: movimenta_estoque,
                        hab_movimento: hab_movimento,
                        habilita_nf: habilita_nf,
                        atualiza_produto: atualiza_produto,
                        padrao: padrao,
                    }
                    console.log(novoDado)
                    popup_carregando(true)
                    carregarConteudo("tipo_de_entrada/tipos_de_entrada.html", document.querySelector(".principal"), false, tipos_de_entrada, novoDado)
                    popup_aviso("Tipo de entrada alterado com sucesso!")
                } else {
                    alert(`Erro: ${data.error}`);
                }
            } catch (error) {
                console.error('Falha ao conectar com o servidor:', error);
                alert('Erro ao salvar alterações. Tente novamente.');
            }
        }
    })
    document.querySelector(".btn_cancelar").addEventListener("click", () => {
        carregarConteudo("tipo_de_entrada/tipos_de_entrada.html", document.querySelector(".principal"), false, tipos_de_entrada, dado)
    })
    
}