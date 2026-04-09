import select2 from "../../../scripts/select.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import { formatarData } from "../../../scripts/funcionalidades.js";
import buscarDados from "../../../scripts/buscarDados.js";
import { carregarDadosNaTabela } from "../../../scripts/carregarDadosNaTabela.js";
import { popup, popup_carregando, popup_aviso, popup_erro, popup_confirmar } from "../../../scripts/popup.js";
import orcamento from "../orcamento.js";
import visualizar_orcamento from "../visualizar_orcamento/visualizar_orcamento.js";
import excluir_orcamento from "../excluir_orcamento.js";

export default async function editar_orcamento(dado, telaAnteriorVisualizar = true) {
    popup_carregando(false, 'Carregando dados do orçamento...');

    const principal = document.querySelector(".principal");
    const caminhoRetorno = telaAnteriorVisualizar ? "orcamento/visualizar_orcamento/visualizar_orcamento.html" : "orcamento/orcamento.html";
    const funcaoRetorno = telaAnteriorVisualizar ? visualizar_orcamento : orcamento;

    // 1. BUSCA DE DADOS INICIAIS (GET)
    let produtos, contatos, usuarios, itensOrcamento;
    try {
        [produtos, contatos, usuarios, itensOrcamento] = await Promise.all([
            buscarDados("produto"),
            buscarDados("contato"),
            buscarDados("usuarios"),
            buscarDados(`orcamentos/${dado.id_orcamento}/itens`)
        ]);
    } catch (err) {
        popup_carregando(true);
        popup_erro("Erro ao conectar com o servidor.");
        return;
    }

    // 2. PREENCHIMENTO DOS CAMPOS DE CABEÇALHO
    document.querySelector(".codigo_id").textContent = dado.id_orcamento;
    document.querySelector(".data_cadastro").textContent = formatarData(dado.data_criacao);
    document.querySelector("#status").value = dado.status || "PENDENTE";
    document.querySelector("#desconto_total").value = Number(dado.desconto_total || 0).toFixed(2);

    // População do Select de Cliente (Sincronizado com cliente_id)
    const selectCliente = document.querySelector("#cliente");
    selectCliente.innerHTML = '<option value=""></option>';
    contatos.filter(c => c.categorias?.some(cat => cat.nome === "CLIENTE"))
            .forEach(c => selectCliente.add(new Option(c.razao_social || c.nome, c.id_contato)));
    selectCliente.value = dado.cliente_id;

    // População do Select de Usuário (Sincronizado com criado_por_id)
    const selectCriadoPor = document.querySelector("#criado_por");
    selectCriadoPor.innerHTML = '<option value=""></option>';
    usuarios.forEach(u => selectCriadoPor.add(new Option(u.nome || u.nome_usuario, u.id_usuario)));
    selectCriadoPor.value = dado.criado_por_id || usuarios.find(u => u.nome === dado.criado_por_nome)?.id_usuario || "";

    select2("100%");

    // 3. ESTADO DOS ITENS (PRODUTOS RELACIONADOS)
    let produtosRelacionados = (itensOrcamento?.itens || []).map(item => ({
        id_produto: item.produto_id,
        produto: item.nome_produto,
        quantidade: Number(item.quantidade) || 1,
        preco_varejo: Number(item.valor_unitario) || 0,
        desconto: Number(item.desconto_item) || 0,
        valor_total: Number(item.valor_total_item) || 0 // Usado apenas para exibição em tela
    }));

    function renderizarTabelaPrincipal() {
        const tbody = document.querySelector("#tabela_produtos .tbody");
        carregarDadosNaTabela(
            produtosRelacionados,
            ["id_produto", "produto", "quantidade", "preco_varejo", "desconto", "valor_total"],
            tbody,
            true, false
        );
        vincularAcoesTabela();
        atualizarTotaisEmTela();
    }

    function vincularAcoesTabela() {
        const linhas = document.querySelectorAll("#tabela_produtos .table_tr");
        linhas.forEach((tr, index) => {
            const inputQtde = document.createElement("input");
            inputQtde.type = "number"; inputQtde.className = "input_tabela";
            inputQtde.value = produtosRelacionados[index].quantidade;
            inputQtde.oninput = () => {
                produtosRelacionados[index].quantidade = Number(inputQtde.value);
                atualizarTotaisEmTela();
            };
            tr.querySelector(".td_quantidade").replaceChildren(inputQtde);

            const inputDesc = document.createElement("input");
            inputDesc.type = "number"; inputDesc.className = "input_tabela";
            inputDesc.value = produtosRelacionados[index].desconto;
            inputDesc.oninput = () => {
                produtosRelacionados[index].desconto = Number(inputDesc.value);
                atualizarTotaisEmTela();
            };
            tr.querySelector(".td_desconto").replaceChildren(inputDesc);

            const btnLixeira = tr.querySelector(".btn_excluir");
            if(btnLixeira) {
                btnLixeira.onclick = () => {
                    produtosRelacionados.splice(index, 1);
                    renderizarTabelaPrincipal();
                };
            }
        });
    }

    function atualizarTotaisEmTela() {
        let somaDescontos = 0;
        produtosRelacionados.forEach(p => {
            p.valor_total = (p.preco_varejo * p.quantidade) - p.desconto;
            somaDescontos += p.desconto;
            const tr = document.getElementById(`tr_${p.id_produto}`);
            if(tr) {
                const tdTotal = tr.querySelector(".td_valor_total");
                if(tdTotal) tdTotal.textContent = p.valor_total.toFixed(2);
            }
        });
        document.querySelector("#desconto_total").value = somaDescontos.toFixed(2);
    }

    // 4. POPUP DE ADICIONAR RELAÇÃO (PRODUTOS)
    document.querySelector("#btn_adicionar_relacao").onclick = () => {
        popup("abrir", 0);
        const tbodyPopup = document.querySelector("#tabela_selecionar_produtos .tbody");
        carregarDadosNaTabela(produtos, ["id_produto", "produto", "quantidade", "preco_varejo"], tbodyPopup, false, true);
    };

    document.querySelector(".btn_selecionar_relacao").onclick = () => {
        const checks = document.querySelectorAll("#tabela_selecionar_produtos .checkbox_selecionar_linha:checked");
        produtosRelacionados = Array.from(checks).map(check => {
            const id = check.id.replace("checkbox_", "");
            const existente = produtosRelacionados.find(p => String(p.id_produto) === id);
            if (existente) return existente;

            const base = produtos.find(p => String(p.id_produto) === id);
            return {
                id_produto: base.id_produto,
                produto: base.produto,
                quantidade: 1,
                preco_varejo: Number(base.preco_varejo) || 0,
                desconto: 0,
                valor_total: Number(base.preco_varejo) || 0
            };
        });
        renderizarTabelaPrincipal();
        popup("fechar", 0);
    };

    document.querySelectorAll(".btn_fechar_popup").forEach(btn => btn.onclick = () => popup("fechar", 0));

    // 5. SALVAR ALTERAÇÕES (PUT)
    document.querySelector(".btn_salvar").onclick = async (e) => {
        e.preventDefault();
        
        const payload = {
            cliente_id: selectCliente.value,
            criado_por_id: selectCriadoPor.value,
            status: document.querySelector("#status").value,
            desconto_total: Number(document.querySelector("#desconto_total").value),
            // O campo 'valor_total' NÃO é enviado pois o banco calcula como DEFAULT
            itens: produtosRelacionados 
        };

        try {
            popup_carregando(false, "Salvando alterações...");
            // URL sem /api conforme sua configuração final
            const res = await fetch(`http://localhost:3000/orcamento/${dado.id_orcamento}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                popup_aviso("Orçamento atualizado!");
                Object.assign(dado, payload); 
                carregarConteudo(caminhoRetorno, principal, false, funcaoRetorno, dado);
            } else {
                const erroServidor = await res.json();
                popup_erro("Erro ao salvar: " + (erroServidor.detalhes || "Verifique o servidor."));
            }
        } catch (err) {
            popup_erro("Erro de conexão com o servidor.");
        } finally {
            popup_carregando(true);
        }
    };

    // 6. NAVEGAÇÃO E VOLTAR
    const fechar = () => carregarConteudo(caminhoRetorno, principal, false, funcaoRetorno, dado);
    document.querySelector("#btn_voltar_orcamento").onclick = fechar;
    document.querySelector(".btn_cancelar").onclick = (e) => { e.preventDefault(); fechar(); };

    document.querySelector(".btn_excluir")?.addEventListener("click", () => excluir_orcamento(dado));

    renderizarTabelaPrincipal();
    popup_carregando(true);
}
