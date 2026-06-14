import select2 from "../../../../scripts/select.js";
import { formatarData } from "../../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../../scripts/javaScript.js";
import entrada_de_produtos from "../entrada_de_produtos.js";
import buscarDados from "../../../../scripts/buscarDados.js";
import { carregarDadosNaTabela, pesquisar } from "../../../../scripts/carregarDadosNaTabela.js";
import { popup, popup_carregando, popup_erro, popup_aviso, popup_confirmar } from "../../../../scripts/popup.js";
import visualizar_entrada_de_produtos from "../visualizar_entrada_de_produtos/visualizar_entrada_de_produtos.js";
import { mudarPesquisa } from "../../../../scripts/funcionalidades.js";

export default async function editar_entrada_de_produtos(entrada, telaAnteriorVisualizar = false) {
    popup_carregando(false, 'Carregando dados da entrada de produtos...');

    document.querySelector(".codigo_id").textContent = entrada.id_entrada_produto
    document.querySelector(".data_cadastro").textContent = formatarData(entrada.data_criacao)
    document.querySelector("#chave_nfe").value = entrada.chave_nfe
    document.querySelector("#numero_nf").value = entrada.numero_nf
    document.querySelector("#modelo").value = entrada.modelo_documento_fiscal
    document.querySelector("#tipo_entrada").value = entrada.tipo_entrada
    document.querySelector("#serie").value = entrada.serie
    document.querySelector("#sub_serie").value = entrada.subserie
    document.querySelector("#data_recebimento").value = formatarData(entrada.data_recebimento, true)
    document.querySelector("#status").value = entrada.status

    select2("100%")

    let caminho = "movimentacao_de_estoque/entrada_de_produtos/entrada_de_produtos.html"
    let funcao = entrada_de_produtos

    if (telaAnteriorVisualizar) {
        caminho = "movimentacao_de_estoque/entrada_de_produtos/visualizar_entrada_de_produtos/visualizar_entrada_de_produtos.html"
        funcao = visualizar_entrada_de_produtos
    }

    let valorTotalTodosProdutos = 0;
    let descontoTotal = 0
    let idProdutosSelecionados = []
    let produtosRelacionados = []
    let itemsRelacionados = await buscarDados(`entrada_produto/${entrada.id_entrada_produto}/itens`)
    let produtos = await buscarDados("produto")
    let contatos = await buscarDados("contato");
    if (!Array.isArray(itemsRelacionados)) {
        itemsRelacionados = itemsRelacionados?.itens || [];
    }

    // Adiciona no array produtosRelacionados os produtos que estão relacionados com a entrada de produtos
    produtos.forEach(produto => {
        itemsRelacionados.forEach(item => {
            if (produto.id_produto === item.produto_id) {
                // Se o produto já estiver na lista de produtos relacionados, não adiciona novamente
                if (!produtosRelacionados.some(p => p.id_item === item.id_item)) {
                    produtosRelacionados.push({
                        // adicionas as chaves que já são usadas na tabela de produtos
                        id_produto: item.produto_id,
                        produto: produto.produto,
                        quantidade: item.quantidade,
                        preco_varejo: item.valor_unitario,
                        desconto: item.desconto_item,
                        valor_total: item.valor_total_item,
                        id_item: item.id_item
                    });
                }
            }
        })
    })

    carregarDadosNaTabela(
        produtosRelacionados,
        ["id_produto", "produto", "quantidade","preco_varejo", "desconto", "valor_total"],
        document.querySelector(".tbody"),
        true,
        false
    )
    // produtosRelacionados.forEach(produto => {
    //     // Adiciona o produto selecionado na lista de produtos relacionados
    //     produtosRelacionados.push({
    //         id_item: produto.id_item, // id_item é o id do item na tabela de entrada_produto_itens
    //         id_produto: produto.produto_id,
    //         quantidade: 1,
    //         valor_unitario: produto.valor_unitario,
    //         desconto: 0,
    //     });
    // })
    criarInputsQuantidadeDesconto();
    addListenerExcluirProdutos();

    let fornecedores = []

    contatos.forEach(contato => { // Para cada contato, verifica se ele é um fornecedor e, se sim, adiciona-o ao array fornecedores
        contato.categorias.forEach(categoria => {
            if (categoria.nome === "FORNECEDOR") {
                fornecedores.push(contato)
            }
        })
    })

    let selectfornecedor = document.querySelector("#fornecedor");
    fornecedores.forEach((fornecedor) => {
        let option = document.createElement("option");
        option.value = fornecedor.id_contato;
        option.text = fornecedor.razao_social;
        selectfornecedor.appendChild(option);
    })

    selectfornecedor.value = entrada.fornecedor_id

    // Ordena os fornecedores pelo id
    produtos = produtos.sort((a, b) => a.id_produto - b.id_produto);

    // Adiciona o campo valor_total e o desconto em cada produto
    produtos.map(produto => {
        produto.valor_total = produto.preco_varejo * produto.quantidade;
        produto.desconto = 0; // Inicializa o desconto como 0
    })

    popup_carregando(true)

    let btn_adicionar_relacao = document.querySelector("#btn_adicionar_relacao");
    btn_adicionar_relacao.addEventListener("click", async () => {
        // Quando o botão de adicionar relação for clicado
        // Abre um popup para selecionar os produtos
        // Carrega os produtos na tabela de seleção
        popup("abrir", 0, btn_adicionar_relacao)
        carregarDadosNaTabela(
            produtos,
            ["id_produto", "produto", "quantidade","preco_varejo"],
            document.querySelector("#tabela_selecionar_produtos"),
            false,
            true,
            false
        )
        pesquisar(
            produtos,
            ["id_produto", "produto", "quantidade","preco_varejo"],
            document.querySelector("#tabela_selecionar_produtos"),
            false
        )
        mudarPesquisa(document.querySelector(".input_pesquisa"),"#select_coluna")
        select2("200px")

        document.querySelectorAll(".table_tr").forEach(tr => {
            // Seleciona os tr's da tabela de produtos selecionados anteriormente
            let tr_id = tr.id.replace("tr_", "");
            idProdutosSelecionados.forEach(idProduto => {
                if (tr_id === idProduto) {
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

    function selecionarProdutos () {
        // Quando o botão de selecionar relação for clicado
        // Seleciona os produtos que foram marcados na tabela de seleção
        let checkboxProdutoSelecionados = document.querySelectorAll("#tabela_selecionar_produtos .checkbox_selecionar_linha:checked");
        idProdutosSelecionados = []
        checkboxProdutoSelecionados.forEach(checkbox => {
            idProdutosSelecionados.push(
                checkbox.id.replace("checkbox_", "")
            )
        })

        let novosDados = produtos.filter(produto => {
            // Filtra os produtos que foram selecionados
            return idProdutosSelecionados.includes(produto.id_produto.toString())
        })

        novosDados.forEach(produto => {
            // Adiciona o produto selecionado na lista de produtos relacionados
            produtosRelacionados.push({
                id_produto: produto.id_produto,
                quantidade: 1,
                valor_unitario: produto.preco_varejo,
                desconto: 0,
            });
        })

        carregarDadosNaTabela(novosDados, ["id_produto", "produto", "quantidade","preco_varejo", "desconto", "valor_total"], document.querySelector("#tabela_produtos"), true, false, false)

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
        let inputsPrecoVarejo = tabela.querySelectorAll(".td_preco_varejo");
        let inputsValorTotal = tabela.querySelectorAll(".td_valor_total");
        valorTotalTodosProdutos = 0; // Reseta o valor total antes de calcular
        descontoTotal = 0; // Reseta o desconto total antes de calcular

        inputsQuantidade.forEach((input, index) => {
            // Para cada input de quantidade e desconto, calcula o valor total com desconto em porcentagem
            let precoVarejo = parseFloat(inputsPrecoVarejo[index].textContent.replace(",", ".")) || 0;
            let quantidade = Number(input.value) || 0;
            let descontoInput = inputsDesconto[index];
            let descontoRaw = descontoInput.value;
            let porcentagem = descontoRaw.trim() === "" ? 0 : parseFloat(descontoRaw.replace(",", ".")) || 0;
            let bruto = precoVarejo * quantidade;
            let descontoReal = (bruto * porcentagem) / 100;
            let valorTotal = bruto - descontoReal;

            inputsQuantidade[index].value = quantidade;
            inputsValorTotal[index].textContent = valorTotal.toFixed(2)

            valorTotalTodosProdutos += valorTotal;
            descontoTotal += descontoReal;

            // Atualiza o objeto produtosRelacionados com os valores atualizados
            const tr = input.closest("tr");
            const idProduto = tr ? parseInt(tr.id.replace("tr_", "")) : null;
            const item = idProduto ? produtosRelacionados.find(p => p.id_produto === idProduto) : produtosRelacionados[index];
            if (item) {
                item.quantidade = Number(quantidade);
                item.desconto = Number(descontoReal.toFixed(2)) || 0;
            }
        });
    }

    function criarInputsQuantidadeDesconto() {
        document.querySelectorAll(".td_quantidade").forEach(td => {
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

        document.querySelectorAll(".td_desconto").forEach(td => {
            td.classList.add("td_container_input")
            let inputDesconto = document.createElement("input");
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

            let descontoTexto = td.firstChild ? td.firstChild.textContent.replace("%", "").trim() : "";
            let descontoNumero = Number(descontoTexto.replace(",", "."));
            inputDesconto.value = descontoTexto === "" || descontoNumero === 0 ? "" : descontoTexto;

            td.textContent = ""
            td.appendChild(inputDesconto);
        })
        calcularValorTotal();
    }

    function addListenerExcluirProdutos () {
        document.querySelectorAll(".btn_excluir").forEach(btn => {
            // Adiciona o evento de click para cada botão de excluir
            btn.addEventListener("click", (e) => {
                // Remove a linha da tabela e da lista de produtos selecionados
                let id_tr = e.currentTarget.parentElement.parentElement.id.replace("tr_", "");
                let tr = e.currentTarget.parentElement.parentElement;
                tr.remove(tr)
                idProdutosSelecionados = idProdutosSelecionados.filter(id => id !== id_tr);
                produtosRelacionados = produtosRelacionados.filter(produto => {
                    return produto.id_item !== parseInt(id_tr);
                })
                calcularValorTotal();
            });
        });
    }

    let formEntradaProduto = document.querySelector("#form_entrada_produto");
    formEntradaProduto.addEventListener("submit", async (e) => {
        e.preventDefault();
        let formData = new FormData(formEntradaProduto);
        let data = Object.fromEntries(formData);

        data.desconto = descontoTotal;
        data.total = valorTotalTodosProdutos;
        data.itens = produtosRelacionados;
        data.itens.forEach(item => {
            item.valor_unitario = item.preco_varejo;
            delete item.preco_varejo;
        });

        let id_entrada = document.querySelector(".codigo_id").textContent;

        if (data.itens.length === 0) {
            popup_erro('É necessário selecionar pelo menos um produto para salvar a entrada.');
            document.querySelector("#btn_adicionar_relacao").style.border = "1px solid red";
            setTimeout(() => {
                document.querySelector("#btn_adicionar_relacao").style.border = "none";
            }, 5000);
            return;
        }
        try {
            popup_carregando(false,'Salvando entrada de produto...');
            const response = await fetch('http://localhost:3000/entrada_produto/'+id_entrada, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            popup_carregando(true)
            if (response.ok) {
                popup_aviso('Entrada salva com sucesso!');
                carregarConteudo("movimentacao_de_estoque/entrada_de_produtos/entrada_de_produtos.html", document.querySelector(".principal"), false, entrada_de_produtos);
            } else {
                popup_erro('Erro: ' + result.erro);
            }
        } catch (err) {
            popup_erro('Erro ao conectar com a API.');
            console.error(err);
        }
    })

    document.querySelector("#btn_voltar_entrada_produtos").addEventListener("click", voltarTelaAnterior)
    document.querySelector(".btn_cancelar").addEventListener("click", (e) => {
        e.preventDefault();
        voltarTelaAnterior();
    })

    async function voltarTelaAnterior () {
        let formData = new FormData(formEntradaProduto);
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
                carregarConteudo(caminho, document.querySelector(".principal"), false, funcao, entrada)
            } else {
                return;
            }
        }else {
            carregarConteudo(caminho, document.querySelector(".principal"), false, funcao, entrada)
        }
    }
}
