import select2 from "../../../scripts/select.js"
import { carregarConteudo } from "../../../scripts/javaScript.js"
import { formatarData, mudarPesquisa } from "../../../scripts/funcionalidades.js"
import buscarDados from "../../../scripts/buscarDados.js"
import { carregarDadosNaTabela, pesquisar } from "../../../scripts/carregarDadosNaTabela.js"
import { popup, popup_carregando, popup_aviso, popup_erro, popup_confirmar } from "../../../scripts/popup.js"
import orcamento from "../orcamento.js"
import visualizar_orcamento from "../visualizar_orcamento/visualizar_orcamento.js"

export default async function editar_orcamento(dado, telaAnteriorVisualizar = false) {
    popup_carregando(false, 'Carregando dados do orçamento...')

    const caminhoRetorno = telaAnteriorVisualizar ? "orcamento/visualizar_orcamento/visualizar_orcamento.html" : "orcamento/orcamento.html"
    const funcaoRetorno = telaAnteriorVisualizar ? visualizar_orcamento : orcamento

    // 1. Busca de dados inicial com tratamento de erro
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

    // 2. Preenchimento de campos estáticos
    document.querySelector(".codigo_id").textContent = dado.id_orcamento;
    document.querySelector(".data_cadastro").textContent = formatarData(dado.data_criacao);
    document.querySelector("#status").value = dado.status;
    document.querySelector("#desconto_total").value = Number(dado.desconto_total || 0).toFixed(2);

    // 3. Popula Selects
    const selectCliente = document.querySelector("#cliente");
    selectCliente.innerHTML = '<option value=""></option>';
    contatos.filter(c => c.categorias?.some(cat => cat.nome === "CLIENTE"))
            .forEach(c => selectCliente.add(new Option(c.razao_social, c.id_contato)));
    selectCliente.value = dado.cliente_id;

    const selectCriadoPor = document.querySelector("#criado_por");
    selectCriadoPor.innerHTML = '<option value=""></option>';
    usuarios.forEach(u => selectCriadoPor.add(new Option(u.nome, u.id_usuario)));
    selectCriadoPor.value = usuarios.find(u => u.nome === dado.criado_por_nome)?.id_usuario ?? "";

    select2("100%");

    // 4. Estado dos Itens (Garante que valores sejam números)
    let produtosRelacionados = (itensOrcamento?.itens ?? []).map(item => ({
        id_produto: item.produto_id,
        produto: item.nome_produto,
        quantidade: Number(item.quantidade) || 1,
        preco_varejo: Number(item.valor_unitario) || 0,
        desconto: Number(item.desconto_item) || 0,
        valor_total: Number(item.valor_total_item) || 0
    }));

    let idProdutosSelecionados = produtosRelacionados.map(p => String(p.id_produto));

    function renderizarTabelaPrincipal() {
        const tbody = document.querySelector("#tabela_produtos .tbody");
        carregarDadosNaTabela(
            produtosRelacionados,
            ["id_produto", "produto", "quantidade", "preco_varejo", "desconto", "valor_total"],
            tbody,
            true, false
        );
        vincularInputsTabela();
        vincularBotoesExcluir();
        atualizarCalculos();
    }

    function vincularInputsTabela() {
        const linhas = document.querySelectorAll("#tabela_produtos .table_tr");
        linhas.forEach((tr, index) => {
            const tdQtde = tr.querySelector(".td_quantidade");
            const tdDesc = tr.querySelector(".td_desconto");

            const inputQtde = document.createElement("input");
            inputQtde.type = "number"; inputQtde.min = "1"; inputQtde.className = "input_tabela";
            inputQtde.value = produtosRelacionados[index].quantidade;
            inputQtde.oninput = () => {
                produtosRelacionados[index].quantidade = Number(inputQtde.value) || 0;
                atualizarCalculos();
            };
            tdQtde.replaceChildren(inputQtde);

            const inputDesc = document.createElement("input");
            inputDesc.type = "number"; inputDesc.className = "input_tabela";
            inputDesc.value = produtosRelacionados[index].desconto;
            inputDesc.oninput = () => {
                produtosRelacionados[index].desconto = Number(inputDesc.value) || 0;
                atualizarCalculos();
            };
            tdDesc.replaceChildren(inputDesc);
        });
    }

    function vincularBotoesExcluir() {
        document.querySelectorAll("#tabela_produtos .btn_excluir").forEach(btn => {
            btn.onclick = (e) => {
                const id = e.currentTarget.closest("tr").id.replace("tr_", "");
                produtosRelacionados = produtosRelacionados.filter(p => String(p.id_produto) !== id);
                idProdutosSelecionados = idProdutosSelecionados.filter(i => i !== id);
                renderizarTabelaPrincipal();
            }
        });
    }

    function atualizarCalculos() {
        let totalGeral = 0;
        let descontoGeral = 0; 
        const linhas = document.querySelectorAll("#tabela_produtos .table_tr");

        produtosRelacionados.forEach((p, i) => {
            // Garante que o cálculo use apenas números
            const unitario = Number(p.preco_varejo) || 0;
            const qtde = Number(p.quantidade) || 0;
            const descItem = Number(p.desconto) || 0;

            p.valor_total = (unitario * qtde) - descItem;
            totalGeral += p.valor_total;
            descontoGeral += descItem;

            if (linhas[i]) {
                const tdValorTotal = linhas[i].querySelector(".td_valor_total");
                if(tdValorTotal) tdValorTotal.textContent = p.valor_total.toFixed(2);
            }
        });
        
        const inputDescontoTotal = document.querySelector("#desconto_total");
        if(inputDescontoTotal) inputDescontoTotal.value = descontoGeral.toFixed(2);
    }

    // 5. Popup de Seleção
    document.querySelector("#btn_adicionar_relacao").onclick = () => {
        popup("abrir", 0);
        const tbodyPopup = document.querySelector("#tabela_selecionar_produtos .tbody");
        carregarDadosNaTabela(produtos, ["id_produto", "produto", "quantidade", "preco_varejo"], tbodyPopup, false, true);
        
        document.querySelectorAll("#tabela_selecionar_produtos .checkbox_selecionar_linha").forEach(check => {
            if (idProdutosSelecionados.includes(check.id.replace("checkbox_", ""))) {
                check.checked = true;
                check.closest("tr").classList.add("linha_selecionada");
            }
        });
    };

    document.querySelector(".btn_selecionar_relacao").onclick = () => {
        const checks = document.querySelectorAll("#tabela_selecionar_produtos .checkbox_selecionar_linha:checked");
        idProdutosSelecionados = Array.from(checks).map(c => c.id.replace("checkbox_", ""));

        produtosRelacionados = idProdutosSelecionados.map(id => {
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

    // 6. Lógica de Salvamento (PUT) - URL Corrigida para Plural
    document.querySelector(".btn_salvar").onclick = async (e) => {
        e.preventDefault();
        if (produtosRelacionados.length === 0) {
            popup_erro("Selecione ao menos um produto.");
            return;
        }

        const payload = {
            cliente_id: document.querySelector("#cliente").value,
            usuario_id: document.querySelector("#criado_por").value,
            status: document.querySelector("#status").value,
            desconto_total: Number(document.querySelector("#desconto_total").value),
            total_orcamento: produtosRelacionados.reduce((acc, p) => acc + p.valor_total, 0),
            itens: produtosRelacionados.map(p => ({
                id_produto: p.id_produto,
                quantidade: p.quantidade,
                valor_unitario: p.preco_varejo,
                desconto: p.desconto
            }))
        };

        try {
            popup_carregando(false, "Salvando alterações...");
            // Rota corrigida para plural 'orcamentos' conforme console
            const res = await fetch(`http://localhost:3000/orcamento/${dado.id_orcamento}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                popup_aviso("Orçamento atualizado!");
                // Atualiza objeto 'dado' para visualização
                dado.cliente_razao_social = selectCliente.options[selectCliente.selectedIndex].text;
                dado.criado_por_nome = selectCriadoPor.options[selectCriadoPor.selectedIndex].text;
                dado.status = payload.status;
                dado.desconto_total = payload.desconto_total;
                
                carregarConteudo(caminhoRetorno, document.querySelector(".principal"), false, funcaoRetorno, dado);
            } else {
                const erroServidor = await res.text();
                console.error("Erro servidor:", erroServidor);
                popup_erro("Erro ao salvar. Verifique se a rota PUT existe no backend.");
            }
        } catch (err) {
            popup_erro("Erro crítico de conexão.");
        } finally {
            popup_carregando(true);
        }
    };

    // Botões de Voltar
    const fechar = async () => {
        if (await popup_confirmar("Sair sem salvar?")) {
            carregarConteudo(caminhoRetorno, document.querySelector(".principal"), false, funcaoRetorno, dado);
        }
    };
    document.querySelector("#btn_voltar_orcamento").onclick = fechar;
    document.querySelector(".btn_cancelar").onclick = (e) => { e.preventDefault(); fechar(); };

    renderizarTabelaPrincipal();
    popup_carregando(true);
}
