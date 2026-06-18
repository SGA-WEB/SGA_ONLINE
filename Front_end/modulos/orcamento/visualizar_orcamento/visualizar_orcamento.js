import select2 from "../../../scripts/select.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import { formatarData } from "../../../scripts/funcionalidades.js";
import buscarDados from "../../../scripts/buscarDados.js";
import { carregarDadosNaTabela } from "../../../scripts/carregarDadosNaTabela.js";
import excluir_orcamento from "../excluir_orcamento.js";
import editar_orcamento from "../editar_orcamento/editar_orcamento.js";

export default async function visualizar_orcamento (dado) {
    // 1. Inicialização da Interface
    select2("100%");
    
    // Preenchimento dos campos de cabeçalho
    document.querySelector(".codigo_id").textContent = dado.id_orcamento;
    document.querySelector("#cliente").value = dado.cliente_razao_social || "";
    const descontoInput = document.querySelector("#desconto_total");
    if (descontoInput) descontoInput.value = Number(dado.desconto_total || 0).toFixed(2);
    document.querySelector("#criado_por_nome").value = dado.criado_por_nome || "";
    document.querySelector("#status").value = dado.status || "";
    document.querySelector(".data_cadastro").textContent = formatarData(dado.data_criacao);

    // 2. Busca e Tratamento dos Itens
    // Ajustado para garantir que busque da rota correta e trate o retorno
    const orcamento_itens = await buscarDados(`orcamentos/${dado.id_orcamento}/itens`);
    
    // Força a extração da lista de itens independente do formato da API
    const itensBrutos = orcamento_itens?.itens || orcamento_itens || [];

    // Mapeamento para bater com os IDs das colunas no seu HTML (tabela_codigo, tabela_produto, etc)
    const orcamento_itens_data = itensBrutos.map(item => ({
        tabela_codigo: item.id_item || item.produto_id,
        tabela_produto: item.nome_produto || item.produto,
        tabela_quantidade: item.quantidade,
        tabela_preco_varejo: item.valor_unitario,
        tabela_preco_atacado: item.desconto_item || 0, // No seu HTML ambos os IDs de desconto/total são 'tabela_preco_atacado'
        valor_total_exibicao: item.valor_total_item || 0
    }));

    // 3. Renderização da Tabela
    const tbody = document.querySelector(".tbody");
    if (orcamento_itens_data.length > 0) {
        // Passamos as chaves mapeadas para carregarDadosNaTabela
        carregarDadosNaTabela(
            orcamento_itens_data, 
            ["tabela_codigo", "tabela_produto", "tabela_quantidade", "tabela_preco_varejo", "tabela_preco_atacado", "valor_total_exibicao"], 
            tbody, 
            false, 
            false
        );
    } else {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Nenhum item encontrado</td></tr>';
    }

    // 4. Eventos dos Botões
    document.querySelector(".btn_editar").onclick = () => {
        carregarConteudo("orcamento/editar_orcamento/editar_orcamento.html", document.querySelector(".principal"), false, editar_orcamento, dado, true);
    };

    document.querySelector(".btn_excluir").onclick = () => {
        excluir_orcamento(dado);
    };

    document.querySelector("#btn_voltar_orcamento").onclick = () => {
        carregarConteudo("orcamento/orcamento.html", document.querySelector(".principal"));
    };
}
