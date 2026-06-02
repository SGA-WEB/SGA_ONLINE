// Objetivo: Função que carrega os dados na tabela e função que pesquisa os dados
// Cria os botões de editar, visualizar e excluir (CRUD) e os adiciona nas tabelas

import carregarDadosNosCards from "./carregarDadosNosCards.js"
import crudLayout from "./crudLayout.js" // Importa a função que cria os botões de editar, visualizar e excluir (CRUD)
import { formatarData } from "./funcionalidades.js"

let handlersPorTabela = new Map() // Variável que armazena o handler da tabela, para evitar múltiplos handlers na mesma tabela;

function carregarDadosNaTabela(
    dados,
    colunasExibir,
    tabela = document.querySelector(".tbody"),
    ativarCrud = true,
    addListener = true,
    removerLinhasTabela = true
) {
    if (!tabela) return;
    // ColunasExibir: Array com os nomes das colunas do banco de dados que serão exibidas na tabela
    let [...tr_tabela] = document.querySelectorAll(".table_tr")
    if (removerLinhasTabela) { // Se removerLinhasTabela for true, remove as linhas da tabela
        tr_tabela.map(e => e.remove(e)) // Remove todos os elementos da tabela
    }
    let td_info = document.querySelector(".td_nenhum_dado") // Pega o parágrafo de informação de que não há dados (Se existir)

    let exibirIdColuna = true;

    if (dados && dados.length !== 0) { // Se houver dados
        const firstDataKey = Object.keys(dados[0])[0]; // Pega a primeira chave do primeiro objeto do array de dados, que no caso é o id
        const hasIdField = Object.keys(dados[0]).some(key => key.startsWith("id_"));
        // Se não existir campo com prefixo "id_", desativa exibirIdColuna para evitar erros posteriores
        if (!hasIdField) exibirIdColuna = false;
        td_info ? td_info.remove() : null // Se houver o parágrafo de informação, ele é removido

        if (exibirIdColuna) {
            dados.sort((a, b) => a[firstDataKey] - b[firstDataKey]) // Ordena os dados pelo id
        }

        dados.map(objDado => { // Para cada objeto no array de dados
            let objDadoCompleto = objDado

            let sortedObjDado = {}; // Objeto com os dados ordenados comforme as colunas a serem exibidas
            colunasExibir.forEach(coluna => {
                sortedObjDado[coluna] = objDado[coluna];
            });
            objDado = sortedObjDado;

            objDado = Object.entries(objDado) // Converte o objeto em um array de pares chave-valor

            objDado = objDado.filter(([chave]) => colunasExibir.includes(chave)); // Filtra o array para incluir apenas as chaves que estão no array colunasExibir

            objDado = Object.fromEntries(objDado) // Converte o array em um objeto

            let tr = document.createElement('tr') // Cria uma linha
            tr.setAttribute('class', 'table_tr')
            if (exibirIdColuna) {
                tr.setAttribute('id', 'tr_' + objDado[firstDataKey]) // Define o id da linha como tr_id
            }


            let checkbox = document.createElement('input') // Cria um checkbox
            let td = document.createElement('td') // Cria uma célula
            if (addListener) {
                td.setAttribute("class", "selecionar_linha")
                checkbox.setAttribute('type', 'checkbox') // Define o tipo do input como checkbox
                checkbox.setAttribute('class', 'checkbox_selecionar_linha') // Define a classe do checkbox

                if (exibirIdColuna) {
                    checkbox.setAttribute('id', 'checkbox_' + objDado[firstDataKey]) // Define o id da célula como checkbox_id
                }

                td.appendChild(checkbox) // Adiciona o checkbox na célula
                tr.appendChild(td) // Adiciona a célula na linha
            }


            for (let e in objDado) { // Para cada campo no objeto
                if (e === "data_cadastro") {
                    continue
                }
                if (e.search("data") != -1) {
                    objDado[e] = formatarData(objDado[e])
                }
                let td = document.createElement('td')
                td.setAttribute('class', 'dado_tabela')
                td.classList.add('td_' + e) // Adiciona a classe da célula como td_nomeDoCampo
                td.setAttribute('id', e + "_" + objDado[e]) // nome do campo + valor do campo

                // --- INÍCIO DA REGRA DE PORCENTAGEM GLOBAL ---
                const camposDesconto = ["desconto", "desconto_item"];

                if (camposDesconto.includes(e)) {
                    let vDescontoReal = Number(objDado[e]) || 0;

                    // Pega a quantidade e o preço unitário do objeto completo
                    let qtde = Number(objDadoCompleto["quantidade"] || objDadoCompleto["tabela_quantidade"]) || 1;
                    let vUnitario = Number(objDadoCompleto["preco_varejo"] || objDadoCompleto["valor_unitario"] || objDadoCompleto["tabela_preco_varejo"]) || 0;

                    let vBaseTotalItem = vUnitario * qtde;

                    if (vBaseTotalItem > 0) {
                        td.textContent = ((vDescontoReal / vBaseTotalItem) * 100).toFixed(2) + "%";
                    } else {
                        td.textContent = "0.00%";
                    }
                }
                // Campos monetários com prefixo R$
                else if (["desconto_total", "subtotal", "valor_total", "preco_varejo", "tabela_preco_varejo", "tabela_preco_atacado"].includes(e)) {
                    td.textContent = "R$ " + (Number(objDado[e]) || 0).toFixed(2);
                }
                // --- FIM DA REGRA ---
                else if (typeof (objDado[e]) == 'boolean') {
                    if (objDado[e]) {
                        td.textContent = "S"
                    } else {
                        td.textContent = "N"
                    }
                } else {
                    td.textContent = objDado[e]
                }

                tr.appendChild(td) // Adiciona a célula na linha
            }

            // CRUD:
            if (ativarCrud) {
                crudLayout(objDadoCompleto, tr, addListener) 
            }

            if (addListener) {
                checkbox.addEventListener("change", (e) => {
                    let tr = e.target.parentElement.parentElement 
                    if (e.target.checked) { 
                        tr.classList.add("linha_selecionada") 
                    } else { 
                        tr.classList.remove("linha_selecionada") 
                    }
                })
            }
            tabela.appendChild(tr) 
        })
    } else { 
        if (!td_info) { 
            td_info = document.createElement('td')
            td_info.setAttribute('class', 'td_nenhum_dado')
            td_info.setAttribute('colspan', '5')
            td_info.textContent = "Nenhum dado encontrado"
            tabela.appendChild(td_info)
        }
    }

    if (handlersPorTabela.has(tabela)) {
        tabela.removeEventListener("click", handlersPorTabela.get(tabela));
    }

    const novoHandler = (e) => {
        selecionarChekboxAoClicarNaLinha(e, tabela)
    }

    if (addListener) {
        tabela.addEventListener("click", novoHandler);
        handlersPorTabela.set(tabela, novoHandler); 
    }

    let selecionar_todos = tabela.parentElement.querySelector("#selecionar_todos");
    if (selecionar_todos) {
        selecionar_todos.addEventListener("change", (e) => {
            const checkboxes = tabela.querySelectorAll(".checkbox_selecionar_linha");
            checkboxes.forEach(cb => {
                cb.checked = e.target.checked;
                cb.closest("tr").classList.toggle("linha_selecionada", cb.checked);
            });
        });
    }
}

function selecionarChekboxAoClicarNaLinha(e, tabela) {
    const tr = e.target.closest("tr");
    if (!tr || (e.target.type === "checkbox")) {
        return;
    }

    const tr_id = tr.id.replace("tr_", "");
    const checkbox = tabela.querySelector("#checkbox_" + tr_id);
    if (!checkbox) return;

    checkbox.checked = !checkbox.checked;
    tr.classList.toggle("linha_selecionada", checkbox.checked);
}

function pesquisar(dados, colunasExibir, tabela = document.querySelector(".tbody"), ativarCrud = true, colunasBancoDeDados) {
    const btn_pesquisar = document.querySelector('.btn_pesquisar') 
    const campo_select = document.querySelector('.select_coluna') 
    const btn_limpar = document.querySelector('.btn_limpar_pesquisa') 
    const input_pesquisar = document.querySelector('.input_pesquisa') 

    if (btn_pesquisar) btn_pesquisar.addEventListener('click', handlePesquisar) 
    if (input_pesquisar) input_pesquisar.addEventListener('keyup', handlePesquisar) 
    if (btn_limpar && input_pesquisar) {
        btn_limpar.addEventListener('click', () => { 
            input_pesquisar.value = "" 
            handlePesquisar() 
        })
    }
    
    if ($('#select_coluna').length > 0 && input_pesquisar) {
        $('#select_coluna').on('change', () => {
            input_pesquisar.value = "" 
            handlePesquisar()
        })
    }

    function handlePesquisar() {
        if (!input_pesquisar) return;
        let value_input_pesquisa = input_pesquisar.value 

        if (btn_limpar) {
            value_input_pesquisa == "" ? btn_limpar.classList.add('hide') : btn_limpar.classList.remove('hide')
        }

        dados = dados.map(e => {
            if (typeof (e.padrao_centro_estoque) === 'boolean') {
                e.padrao_centro_estoque = e.padrao_centro_estoque ? "s" : "n"
            }
            return e
        })

        let threshold 
        if (campo_select && campo_select.value == "padrao_centro_estoque") {
            threshold = 0.7
        } else if (campo_select && (campo_select.value == "localizacao_centro_estoque" || campo_select.value.includes("id"))) {
            threshold = 0
        } else {
            threshold = 0.3
        }

        const options = {
            keys: [campo_select ? campo_select.value : ""],
            threshold: threshold,
        }
        const fuse = new Fuse(dados, options) 

        let newData

        if (value_input_pesquisa.includes('*')) {
            let padrao = value_input_pesquisa.replace(/\*/g, '').toUpperCase();
            let buscaUpperCase = value_input_pesquisa.toUpperCase();
            const chave = campo_select.value;

            if (buscaUpperCase.startsWith('*') && buscaUpperCase.endsWith('*')) {
                newData = dados.filter(item => String(item[chave]).toUpperCase().includes(padrao));
            } else if (buscaUpperCase.startsWith('*')) {
                newData = dados.filter(item => String(item[chave]).toUpperCase().endsWith(padrao));
            } else if (buscaUpperCase.endsWith('*')) {
                newData = dados.filter(item => String(item[chave]).toUpperCase().startsWith(padrao));
            }
        } else { 
            newData = value_input_pesquisa == "" ? dados : fuse.search(value_input_pesquisa).map(e => e.item) 
        }

        if (document.querySelector(".tabela")) {
            carregarDadosNaTabela(newData, colunasExibir, tabela, ativarCrud) 
        } else {
            carregarDadosNosCards(newData, colunasBancoDeDados, colunasExibir)
        }
    }
}

export { carregarDadosNaTabela, pesquisar }
