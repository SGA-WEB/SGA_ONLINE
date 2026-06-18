import select2 from "../../../../scripts/select.js";
import { formatarData } from "../../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../../scripts/javaScript.js";
import saida_de_produtos from "../saida_de_produtos.js";
import buscarDados from "../../../../scripts/buscarDados.js";
import { carregarDadosNaTabela, pesquisar } from "../../../../scripts/carregarDadosNaTabela.js";
import { popup, popup_carregando, popup_erro, popup_aviso, popup_confirmar } from "../../../../scripts/popup.js";
import visualizar_saida_de_produtos from "../visualizar_saida_de_produtos/visualizar_saida_de_produtos.js";
import { mudarPesquisa } from "../../../../scripts/funcionalidades.js";

export default async function editar_saida_de_produtos(saida, telaAnteriorVisualizar = false) {
    popup_carregando(false, 'Carregando dados da saida de produtos...');

    document.querySelector(".codigo_id").textContent = saida.id_saida_produto
    document.querySelector(".data_cadastro").textContent = formatarData(saida.data_criacao)
    document.querySelector("#chave_nfe").value = saida.chave_nfe
    document.querySelector("#numero_nf").value = saida.numero_nf
    document.querySelector("#modelo_documento_fiscal").value = saida.modelo_documento_fiscal
    document.querySelector("#tipo_saida").value = saida.tipo_saida
    document.querySelector("#serie").value = saida.serie
    document.querySelector("#subserie").value = saida.subserie
    document.querySelector("#data_saida").value = formatarData(saida.data_saida, true, '-')
    document.querySelector("#status").value = saida.status
    document.querySelector("#destinatario_id").value = saida.destinatario_razao_social
    document.querySelector("#valor_total").value = saida.valor_total
    select2("100%")

    let caminho = "movimentacao_de_estoque/saida_de_produtos/saida_de_produtos.html"
    let funcao = saida_de_produtos

    if (telaAnteriorVisualizar) {
        caminho = "movimentacao_de_estoque/saida_de_produtos/visualizar_saida_de_produtos/visualizar_saida_de_produtos.html"
        funcao = visualizar_saida_de_produtos
    }

    let valorTotalTodosProdutos = 0;
    let descontoTotal = 0
    let idProdutosSelecionados = []
    let produtosRelacionados = []
    let itemsRelacionados = await buscarDados(`saida_produto/${saida.id_saida_produto}/itens`)
    let produtos = await buscarDados("produto")
    let contatos = await buscarDados("contato");
    let tipos_de_saida = await buscarDados("tipos_de_saida/" + 1);

    itemsRelacionados = itemsRelacionados?.itens || itemsRelacionados || [];

    // Adiciona no array produtosRelacionados os produtos que estão relacionados com a saida de produtos
    produtos.forEach(produto => {
        itemsRelacionados.forEach(item => {
            if (produto.id_produto === item.id_produto) {
                // Se o produto já estiver na lista de produtos relacionados, não adiciona novamente
                if (!produtosRelacionados.some(p => p.id_item === item.id_item)) {
                    produtosRelacionados.push({
                        // adicionas as chaves que já são usadas na tabela de produtos
                        id_produto: item.id_produto,
                        produto: produto.produto,
                        quantidade: item.quantidade,
                        valor_unitario: item.valor_unitario,
                        desconto: item.desconto_item,
                        valor_total: item.valor_total_item
                    });
                    idProdutosSelecionados.push(item.id_produto.toString());
                }
            }
        })
    })

    carregarDadosNaTabela(
        produtosRelacionados,
        ["id_produto", "produto", "quantidade", "valor_unitario", "desconto", "valor_total"],
        document.querySelector(".tbody"),
        true,
        false
    )

    criarInputsQuantidadeDesconto();
    addListenerExcluirProdutos();

    let clientes = []

    contatos.forEach(contato => { // Para cada contato, verifica se ele é um cliente e, se sim, adiciona-o ao array clientes
        contato.categorias.forEach(categoria => {
            if (categoria.nome === "CLIENTE") {
                clientes.push(contato)
            }
        })
    })

    let selectCliente= document.querySelector("#destinatario_id");
    clientes.forEach((Cliente) => {
        let option = document.createElement("option");
        option.value = Cliente.id_contato;
        option.text = Cliente.razao_social;
        selectCliente.appendChild(option);
    })

    selectCliente.value = saida.destinatario_id

    produtos = produtos.sort((a, b) => a.id_produto - b.id_produto);

    // Adiciona o campo valor_total e o desconto em cada produto
    produtos.map(produto => {
        produto.valor_total = produto.preco_varejo * produto.quantidade;
        produto.desconto = 0; // Inicializa o desconto como 0
        produto.valor_unitario = produto.preco_varejo;
        delete produto.preco_varejo;
    })

    popup_carregando(true)

    let btn_adicionar_relacao = document.querySelector("#btn_adicionar_relacao");
    btn_adicionar_relacao.addEventListener("click", async () => {
        // Quando o botão de adicionar relação for clicado
        // Abre um popup para selecionar os produtos
        // Carrega os produtos na tabela de seleção

        let tabela = document.querySelector("#tabela_selecionar_produtos tbody");
        tabela.innerHTML = ""
        popup("abrir", 0, btn_adicionar_relacao)
        carregarDadosNaTabela(
            produtos,
            ["id_produto", "produto", "quantidade", "valor_unitario"],
            tabela,
            false,
            true,
            false
        )
        pesquisar(
            produtos,
            ["id_produto", "produto", "quantidade", "valor_unitario"],
            tabela,
            false
        )
        mudarPesquisa(document.querySelector(".input_pesquisa"), "#select_coluna")
        select2("200px")

        document.querySelectorAll("#tabela_selecionar_produtos .table_tr").forEach(tr => {
            // Seleciona os tr's da tabela de produtos selecionados anteriormente
            let tr_id = tr.id.replace("tr_", "");
            idProdutosSelecionados.forEach(produto => {
                if (tr_id === produto) {
                    tr.querySelector(".checkbox_selecionar_linha").checked = true;
                    tr.classList.add("linha_selecionada");
                }
            })
        })
    })

    let btn_selecionar_relacao = document.querySelector(".btn_selecionar_relacao");
    let btn_fechar_popup = document.querySelector(".btn_fechar_popup");
    btn_fechar_popup.addEventListener("click", selecionarProdutos)
    btn_selecionar_relacao.addEventListener("click", selecionarProdutos)

    function selecionarProdutos() {
        // Quando o botão de selecionar relação for clicado
        // Seleciona os produtos que foram marcados na tabela de seleção
        let checkboxProdutoSelecionados = document.querySelectorAll("#tabela_selecionar_produtos .checkbox_selecionar_linha:checked");
        let idCheckboxSelecionadosAtual = []

        checkboxProdutoSelecionados.forEach(() => { // Remove os produtos que já estão selecionados da lista
            checkboxProdutoSelecionados = Array.from(checkboxProdutoSelecionados).filter(cb => {
                const id = cb.id.replace("checkbox_", "");
                return !idProdutosSelecionados.includes(id);
            });
            return;
        })

        checkboxProdutoSelecionados.forEach(checkbox => {
            idCheckboxSelecionadosAtual.push(
                checkbox.id.replace("checkbox_", "")
            )
            idProdutosSelecionados.push(
                checkbox.id.replace("checkbox_", "")
            )
        })

        let novosDados = produtos.filter(produto => {
            // Filtra os produtos que foram selecionados
            return idCheckboxSelecionadosAtual.includes(produto.id_produto.toString())
        })

        novosDados.forEach(produto => {
            // Adiciona o produto selecionado na lista de produtos relacionados
            produtosRelacionados.push({
                id_produto: produto.id_produto,
                quantidade: 1,
                valor_unitario: produto.valor_unitario,
                desconto: 0,
            });
        })
        if (novosDados.length === 0) {
            popup("fechar", 0, btn_selecionar_relacao)
            return;
        }

        carregarDadosNaTabela(
            novosDados,
            ["id_produto", "produto", "quantidade", "valor_unitario", "desconto", "valor_total"],
            document.querySelector("#tabela_produtos tbody"),
            true,
            false,
            false
        )

        popup("fechar", 0, btn_selecionar_relacao)

        document.querySelectorAll(".btn_excluir").forEach(btn => {
            // Adiciona o evento de click para cada botão de excluir
            btn.addEventListener("click", (e) => {
                // Remove a linha da tabela e da lista de produtos selecionados
                let id_tr = e.currentTarget.parentElement.parentElement.id.replace("tr_", "");
                let tr = e.currentTarget.parentElement.parentElement;
                tr.remove(tr)

                idProdutosSelecionados = idProdutosSelecionados.filter(id => id !== id_tr);
                produtosRelacionados = produtosRelacionados.filter(produto => produto.id_produto !== parseInt(id_tr));
                calcularValorTotal();
            });
        });

        addListenerExcluirProdutos();
        criarInputsQuantidadeDesconto();
    }

    function calcularValorTotal() {
        let tabela = document.querySelector("#tabela_produtos")
        let inputsQuantidade = tabela.querySelectorAll(".input_quantidade");
        let inputsDesconto = tabela.querySelectorAll(".input_desconto");
        let inputsValorUnitario = tabela.querySelectorAll(".td_valor_unitario");
        let inputsValorTotal = tabela.querySelectorAll(".td_valor_total");
        valorTotalTodosProdutos = 0; // Reseta o valor total antes de calcular
        descontoTotal = 0; // Reseta o desconto total antes de calcular

        inputsQuantidade.forEach((input, index) => {
            // Para cada input de quantidade e desconto, calcula o valor total
            let precoVarejoText = inputsValorUnitario[index].textContent;
            let precoVarejo = Number(String(precoVarejoText).replace(',', '.')) || 0;
            let quantidade = Number(inputsQuantidade[index].value) || 0;
            // Desconto informado pelo usuário em porcentagem (ex: "12.5%" ou "12,5")
            let descontoInput = inputsDesconto[index].value || "";
            let descontoPercent = Number(String(descontoInput).replace('%', '').replace(',', '.')) || 0;

            let baseTotal = precoVarejo * quantidade;
            let descontoReal = (descontoPercent > 0) ? (baseTotal * (descontoPercent / 100)) : 0;
            let valorTotal = baseTotal - descontoReal;

            inputsValorUnitario[index].value = precoVarejo;
            inputsQuantidade[index].value = quantidade;

            let tdValor = inputsValorTotal[index];
            if (tdValor) {
                const inputChild = tdValor.querySelector && tdValor.querySelector('input');
                if (inputChild) {
                    tdValor.removeChild(inputChild);
                }
                tdValor.textContent = Number(valorTotal).toFixed(2);
            }

            valorTotalTodosProdutos += valorTotal;
            descontoTotal += descontoReal;

            produtosRelacionados[index].quantidade = quantidade;
            produtosRelacionados[index].desconto_item = Number(descontoReal.toFixed(2));
        });

        let spanTotal = document.querySelector("#valor_total_produtos");
        let campoValorTotal = document.querySelector("#valor_total");
        let containerTotal = document.querySelector(".container_totalizador");
        if (spanTotal) {
            spanTotal.textContent = "R$ " + valorTotalTodosProdutos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        if (campoValorTotal) {
            campoValorTotal.value = Number(valorTotalTodosProdutos.toFixed(2));
        }
        if (containerTotal) {
            containerTotal.style.display = document.querySelectorAll(".input_quantidade").length > 0 ? "flex" : "none";
        }
    }

    function criarInputsQuantidadeDesconto() {
        document.querySelectorAll(".td_quantidade:not(.td_container_input)").forEach(td => {
            // Adiciona um input de quantidade em cada célula de quantidade
            td.classList.add("td_container_input")
            let inputQuantidade = document.createElement("input");
            inputQuantidade.type = "number";
            inputQuantidade.value = td.firstChild.textContent; // valor inicial da quantidade salva no banco de dados
            inputQuantidade.max = td.textContent; // Define o valor máximo como a quantidade do produto
            inputQuantidade.min = 1; // Define o valor mínimo como 1
            inputQuantidade.classList.add("input_quantidade");
            inputQuantidade.classList.add("input_tabela");
            inputQuantidade.addEventListener("input", calcularValorTotal);

            td.textContent = ""
            td.appendChild(inputQuantidade);
        })

        document.querySelectorAll(".td_desconto:not(.td_container_input)").forEach((td, index) => {
            td.classList.add("td_container_input")
            let inputDesconto = document.createElement("input");
            // Usar texto com inputMode decimal para permitir porcentagens (ex: "12.5%")
            inputDesconto.type = "text";
            inputDesconto.inputMode = "decimal";
            inputDesconto.placeholder = "0%";
            inputDesconto.classList.add("input_desconto");
            inputDesconto.classList.add("input_tabela");
            
            // Evento input para apenas calcular, sem adicionar automaticamente %
            inputDesconto.addEventListener("input", calcularValorTotal);
            
            // Remove % ao entrar no campo (focus) para edição livre
            inputDesconto.addEventListener("focus", (e) => {
                e.target.value = e.target.value.replace(/%/g, '').trim();
            });
            
            // Adiciona % apenas ao sair do campo (blur) se houver valor
            inputDesconto.addEventListener("blur", (e) => {
                let valor = e.target.value.replace(/%/g, '').trim();
                if (valor !== '' && valor !== '0') {
                    e.target.value = valor + '%';
                } else if (valor === '0' || valor === '') {
                    e.target.value = '';
                }
            });

            // Inicializa o input com a porcentagem equivalente ao desconto monetário salvo
            let inicialPercent = "";
            try {
                let produto = produtosRelacionados[index];
                if (produto) {
                    let base = (produto.valor_unitario || 0) * (produto.quantidade || 1);
                    if (base > 0 && produto.desconto) {
                        inicialPercent = ((produto.desconto / base) * 100).toFixed(2) + "%";
                    }
                }
            } catch (err) {
                inicialPercent = "";
            }

            inputDesconto.value = (inicialPercent === "0.00%" ? "" : inicialPercent);

            td.textContent = ""
            td.appendChild(inputDesconto);
        })
        calcularValorTotal();
    }

    function addListenerExcluirProdutos() {
        document.querySelectorAll(".btn_excluir").forEach(btn => {
            // Adiciona o evento de click para cada botão de excluir
            btn.addEventListener("click", (e) => {
                // Remove a linha da tabela e da lista de produtos selecionados
                let id_tr = e.currentTarget.parentElement.parentElement.id.replace("tr_", "");
                let tr = e.currentTarget.parentElement.parentElement;
                tr.remove(tr)
                idProdutosSelecionados = idProdutosSelecionados.filter(id => id !== id_tr);
                produtosRelacionados = produtosRelacionados.filter(produto => {
                    return produto.id_produto !== parseInt(id_tr);
                })
                calcularValorTotal();
            });
        });
    }

    let formsaidaProduto = document.querySelector("#form_saida_produto");
    formsaidaProduto.addEventListener("submit", async (e) => {
        e.preventDefault();
        let formData = new FormData(formsaidaProduto);
        let data = Object.fromEntries(formData);

        data.desconto = descontoTotal;
        data.valor_total = valorTotalTodosProdutos;
        data.itens = produtosRelacionados;

        let id_saida = document.querySelector(".codigo_id").textContent;


        if (data.itens.length === 0) {
            popup_erro('É necessário selecionar pelo menos um produto para salvar a saida.');
            document.querySelector("#btn_adicionar_relacao").style.border = "1px solid red";
            setTimeout(() => {
                document.querySelector("#btn_adicionar_relacao").style.border = "none";
            }, 5000);
            return;
        }
        try {
            popup_carregando(false, 'Salvando saida de produto...');
            const response = await fetch('http://localhost:3000/saida_produto/' + id_saida, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            popup_carregando(true)
            if (response.ok) {
                popup_aviso('saida salva com sucesso!');
                carregarConteudo(caminho, document.querySelector(".principal"), false, funcao, saida);
            } else {
                popup_erro('Erro: ' + result.erro);
            }
        } catch (err) {
            popup_erro('Erro ao conectar com a API.');
            console.error(err);
        }
    })

    document.querySelector("#btn_voltar_saida_produtos").addEventListener("click", voltarTelaAnterior)
    document.querySelector(".btn_cancelar").addEventListener("click", (e) => {
        e.preventDefault();
        voltarTelaAnterior();
    })

    async function voltarTelaAnterior() {
        let formData = new FormData(formsaidaProduto);
        let data = Object.fromEntries(formData);
        let dadosPreenchidos = false
        // Se algum campo do formulário estiver preenchido, é necessário confirmar a saída
        for (let key in data) {
            if (data[key] === "") {
                data[key] = null;
            }
            if (data[key] !== null) {
                dadosPreenchidos = true;
            }
        }
        if (idProdutosSelecionados.length > 0 || dadosPreenchidos) {
            if (await popup_confirmar("Tem certeza que deseja voltar? Todas as edições feitas serão perdidas.")) {
                carregarConteudo(caminho, document.querySelector(".principal"), false, funcao, saida)
            } else {
                return;
            }
        } else {
            carregarConteudo(caminho, document.querySelector(".principal"), false, funcao, saida)
        }
    }
}
