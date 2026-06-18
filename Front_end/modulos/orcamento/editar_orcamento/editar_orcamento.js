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

    let produtos, contatos, usuarios, itensDaAPI;
    try {
        [produtos, contatos, usuarios, itensDaAPI] = await Promise.all([
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

    // 2. Mapeamento dos produtos (Converte o Valor Real do Banco para % na Tela de Edição)
    let produtosRelacionados = (itensDaAPI?.itens || itensDaAPI || []).map(item => {
        let vUnit = Number(item.valor_unitario) || 0;
        let qtde = Number(item.quantidade) || 0;
        let vDescReal = Number(item.desconto_item) || 0;
        let brutoItem = vUnit * qtde;
        
        // Calcula a porcentagem baseada no valor que veio do banco para preencher o input
        let porcentagemParaInput = brutoItem > 0 ? (vDescReal / brutoItem) * 100 : 0;

        return {
            codigo: item.produto_id,         
            produto: item.nome_produto,      
            quantidade: qtde, 
            preco_varejo: vUnit, 
            desconto: porcentagemParaInput, // Guardamos a % para o input
            valor_total: Number(item.valor_total_item) || 0 
        };
    });

    // 3. Preenchimento de campos fixos
    document.querySelector(".codigo_id").textContent = dado.id_orcamento;
    document.querySelector(".data_cadastro").textContent = formatarData(dado.data_criacao);
    document.querySelector("#status").value = dado.status || "PENDENTE";

    // Correção dos Selects (Usando os IDs exatos do seu HTML de Edição)
    const selectCliente = document.querySelector("#cliente");
    if (selectCliente) {
        selectCliente.innerHTML = '<option value=""></option>';
        contatos.filter(c => c.categorias?.some(cat => cat.nome === "CLIENTE"))
                .forEach(c => selectCliente.add(new Option(c.razao_social || c.nome, c.id_contato)));
        selectCliente.value = dado.cliente_id;
    }

    const selectCriadoPor = document.querySelector("#criado_por");
    if (selectCriadoPor) {
        selectCriadoPor.innerHTML = '<option value=""></option>';
        usuarios.forEach(u => selectCriadoPor.add(new Option(u.nome || u.nome_usuario, u.id_usuario)));
        selectCriadoPor.value = dado.criado_por_id || "";
    }

    select2("100%");

    // 4. Funções de Renderização e Lógica
    function renderizarTabelaPrincipal() {
        const tbody = document.querySelector("#tabela_produtos .tbody");
        // A função global carregarDadosNaTabela já cuidará da exibição da %
        carregarDadosNaTabela(
            produtosRelacionados,
            ["codigo", "produto", "quantidade", "preco_varejo", "desconto", "valor_total"],
            tbody,
            true, false
        );
        vincularAcoesTabela();
        atualizarTotaisEmTela();
    }

    function vincularAcoesTabela() {
        const linhas = document.querySelectorAll("#tabela_produtos .table_tr");
        linhas.forEach((tr, index) => {
            const tdQtde = tr.querySelector(".td_quantidade");
            const tdDesc = tr.querySelector(".td_desconto");

            const inputQtde = document.createElement("input");
            inputQtde.type = "number"; inputQtde.className = "input_tabela";
            inputQtde.value = produtosRelacionados[index].quantidade;
            inputQtde.oninput = () => {
                produtosRelacionados[index].quantidade = Number(inputQtde.value);
                atualizarTotaisEmTela();
            };
            if(tdQtde) tdQtde.replaceChildren(inputQtde);

            const inputDesc = document.createElement("input");
            inputDesc.type = "text"; inputDesc.className = "input_tabela";
            inputDesc.placeholder = "0%";
            const descVal = Number(produtosRelacionados[index].desconto) || 0;
            inputDesc.value = descVal > 0 ? descVal.toFixed(2) + '%' : '';

            inputDesc.addEventListener('focus', () => {
                inputDesc.value = inputDesc.value.toString().replace('%', '');
                inputDesc.select();
            });

            inputDesc.addEventListener('input', () => {
                const numeric = inputDesc.value.toString().replace(',', '.').replace(/[^0-9.-]/g, '');
                produtosRelacionados[index].desconto = Number(numeric) || 0;
                atualizarTotaisEmTela();
            });

            inputDesc.addEventListener('blur', () => {
                const v = Number(produtosRelacionados[index].desconto) || 0;
                inputDesc.value = v.toFixed(2) + '%';
            });

            if(tdDesc) tdDesc.replaceChildren(inputDesc);

            const btnExcluir = tr.querySelector(".btn_excluir");
            if(btnExcluir) {
                btnExcluir.onclick = () => {
                    produtosRelacionados.splice(index, 1);
                    renderizarTabelaPrincipal();
                };
            }
        });
    }

    let descontoTotalAcumuladoReal = 0;
    let subtotalGeralCalculado = 0;

    function atualizarTotaisEmTela() {
        descontoTotalAcumuladoReal = 0;
        subtotalGeralCalculado = 0;

        produtosRelacionados.forEach(p => {
            let brutoItem = p.preco_varejo * p.quantidade;
            // Cálculo da porcentagem convertida para valor real
            let descontoRealItem = (brutoItem * p.desconto) / 100;
            p.valor_total = brutoItem - descontoRealItem;

            subtotalGeralCalculado += brutoItem;
            descontoTotalAcumuladoReal += descontoRealItem;

            const tr = document.getElementById(`tr_${p.codigo}`);
            if(tr) {
                const tdTotal = tr.querySelector(".td_valor_total");
                if(tdTotal) tdTotal.textContent = p.valor_total.toFixed(2);
            }
        });
        const descontoTotalInput = document.querySelector("#desconto_total");
        if (descontoTotalInput) descontoTotalInput.value = descontoTotalAcumuladoReal.toFixed(2);
    }

    // 5. Popup de Seleção
    document.querySelector("#btn_adicionar_relacao").onclick = () => {
        popup("abrir", 0);
        const tbodyPopup = document.querySelector("#tabela_selecionar_produtos .tbody");
        carregarDadosNaTabela(produtos, ["id_produto", "produto", "quantidade", "preco_varejo"], tbodyPopup, false, true);
    };

    document.querySelector(".btn_selecionar_relacao").onclick = () => {
        const checks = document.querySelectorAll("#tabela_selecionar_produtos .checkbox_selecionar_linha:checked");
        produtosRelacionados = Array.from(checks).map(check => {
            const id = check.id.replace("checkbox_", "");
            const ext = produtosRelacionados.find(p => String(p.codigo) === id);
            if (ext) return ext;
            const b = produtos.find(p => String(p.id_produto) === id);
            return { codigo: b.id_produto, produto: b.produto, quantidade: 1, preco_varejo: Number(b.preco_varejo), desconto: 0, valor_total: Number(b.preco_varejo) };
        });
        renderizarTabelaPrincipal();
        popup("fechar", 0);
    };

    document.querySelectorAll(".btn_fechar_popup").forEach(btn => btn.onclick = () => popup("fechar", 0));

    // 6. Salvamento Final (Envia R$ para o Banco)
    document.querySelector(".btn_salvar").onclick = async (e) => {
        e.preventDefault();
        
        const payload = {
            cliente_id: selectCliente.value,
            criado_por_id: selectCriadoPor.value,
            status: document.querySelector("#status").value,
            desconto_total: descontoTotalAcumuladoReal,
            subtotal: subtotalGeralCalculado,
            itens: produtosRelacionados.map(p => ({
                id_produto: p.codigo,
                quantidade: p.quantidade,
                preco_varejo: p.preco_varejo,
                desconto: ((p.preco_varejo * p.quantidade) * p.desconto) / 100 // Salva em R$
            }))
        };

        try {
            popup_carregando(false, "Salvando alterações...");
            const res = await fetch(`http://localhost:3000/orcamento/${dado.id_orcamento}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            popup_carregando(true);
            if (res.ok) {
                popup_aviso("Orçamento atualizado!");
                Object.assign(dado, payload);
                carregarConteudo(caminhoRetorno, principal, false, funcaoRetorno, dado);
            } else { 
                popup_erro("Erro ao salvar alterações.");
            }
        } catch (err) {
            popup_carregando(true);
            popup_erro("Erro de conexão.");
        }
    };

    document.querySelector("#btn_voltar_orcamento").onclick = () => carregarConteudo(caminhoRetorno, principal, false, funcaoRetorno, dado);

    renderizarTabelaPrincipal();
    popup_carregando(true);
}
