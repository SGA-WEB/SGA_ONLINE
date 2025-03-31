import { carregarConteudo } from "./javaScript.js";

import visualizar_centro_de_estoque from "../modulos/centro_de_estoque/visualizar_centro_de_estoque/visualizar_centro_de_estoque.js";
import editar_centro_de_estoque from "../modulos/centro_de_estoque/editar_centro_de_estoque/editar_centro_de_estoque.js";
import excluir_centro_de_estoque from "../modulos/centro_de_estoque/excluir_centro_de_estoque.js";

import visualizar_produto from "../modulos/produto/visualizar_produto/visualizar_produto.js";
import editar_produto from "../modulos/produto/editar_produto/editar_produto.js";
import excluir_produto from "../modulos/produto/excluir_produto.js";

import visualizar_contato from "../modulos/contato/visualizar_contato/visualizar_contato.js"
import editar_contato from "../modulos/contato/editar_contato/editar_contato.js";
import excluir_contato from "../modulos/contato/excluir_contato.js";

import popup from "./popup.js"
import { esperarCarregarConteudo } from "./funcionalidades.js";

export default function crudLayout (obj, tr) {
    let acoes = document.createElement('div') // Cria um div para as ações do CRUD
    acoes.setAttribute('class','acoes_tabela')

    let nomeTabelaAtual;
    for (let key in obj) {
        if (key.startsWith('id_')) {
            key = key.replace('id_', '')
            nomeTabelaAtual = key.replace('_', ' de ');
        }
    }

    let btn_visualizar = document.createElement('button') // Cria o botão de visualizar
    btn_visualizar.setAttribute('class','btn_visualizar')
    btn_visualizar.setAttribute('title',`Visualizar ${nomeTabelaAtual}`)
    let img_visualizar = document.createElement('img') // Cria a imagem do botão de visualizar
    img_visualizar.setAttribute('src','../imagens/visibility_on.png')
    btn_visualizar.appendChild(img_visualizar) // Adiciona a imagem no botão

    let btn_editar = document.createElement('button') // Cria o botão de editar
    btn_editar.setAttribute('class','btn_editar')
    btn_editar.setAttribute('title',`Editar ${nomeTabelaAtual}`)
    let img_editar = document.createElement('img') // Cria a imagem do botão de editar
    img_editar.setAttribute('src','../imagens/icone_editar.svg')
    btn_editar.appendChild(img_editar) // Adiciona a imagem no botão

    let btn_excluir = document.createElement('button') // Cria o botão de excluir
    btn_excluir.setAttribute('class','btn_excluir')
    btn_excluir.setAttribute('title',`Excluir ${nomeTabelaAtual}`)
    let img_excluir = document.createElement('img') // Cria a imagem do botão de excluir
    img_excluir.setAttribute('src','../imagens/icone_excluir.svg')
    btn_excluir.appendChild(img_excluir) // Adiciona a imagem no botão

    acoes.appendChild(btn_visualizar) // Adiciona o botão de visualizar nas ações
    acoes.appendChild(btn_editar) // Adiciona o botão de editar nas ações
    acoes.appendChild(btn_excluir) // Adiciona o botão de excluir nas ações

    btn_visualizar.addEventListener('click',() => {
        executarAcao('visualizar')
    })

    btn_editar.addEventListener('click',() => {
       executarAcao('editar')
    })

    btn_excluir.addEventListener('click',() => {
        executarAcao('excluir')
    })

    function executarAcao(acao) {
        // Carrega na tela a página da ação de acordo com a tabela atual

        let funcoes = { // Funções de acordo com a ação
            visualizar_centro_de_estoque: visualizar_centro_de_estoque,
            editar_centro_de_estoque: editar_centro_de_estoque,
            excluir_centro_de_estoque: excluir_centro_de_estoque,
            visualizar_produto: visualizar_produto,
            editar_produto: editar_produto,
            excluir_produto: excluir_produto,
            visualizar_contato: visualizar_contato,
            editar_contato: editar_contato,
            excluir_contato: excluir_contato
        }

        switch (nomeTabelaAtual) { // Carrega a página do CRUD de acordo com a tabela atual
            case "centro de estoque":
                if (acao == 'excluir') {
                    popup('abrir',0,btn_excluir)
                    funcoes[`excluir_centro_de_estoque`](obj)
                } else {
                    carregarConteudo(
                        `centro_de_estoque/${acao}_centro_de_estoque/${acao}_centro_de_estoque.html`,
                        document.querySelector('.principal'),
                        funcoes[`${acao}_centro_de_estoque`], // Chama a função de acordo com a ação
                        obj
                    );
                }
            break;
            case "produto":
                if (acao == 'excluir') {
                    popup('abrir',0,btn_excluir)
                    funcoes[`excluir_produto`](obj)
                } else {
                    carregarConteudo(
                        `produto/${acao}_produto/${acao}_produto.html`,
                        document.querySelector('.principal'),
                        false,
                        funcoes[`${acao}_produto`](obj) // Chama a função de acordo com a ação
                    );
                }
            break;
            case "contato":
                if (acao == 'excluir') {
                    popup('abrir',0,btn_excluir)
                    funcoes[`excluir_contato`](obj)
                } else {
                    carregarConteudo(
                        `contato/${acao}_contato/nav_contato.html`,
                        document.querySelector('.principal')
                      );
                      
                      // Observa o .principal (onde o .modulo será inserido)
                      esperarCarregarConteudo(
                        () => {
                          carregarConteudo(
                            `contato/${acao}_contato/criar_contato/${acao}_contato.html`,
                            document.querySelector('.modulo'),
                            funcoes[`${acao}_contato`],
                            obj,
                            true
                          );
                        },
                        '.modulo',
                        document.querySelector('.principal') // Container onde .modulo será inserido
                      );             
                }
            break;
            default:
                console.warn(`Nenhuma ação definida para ${nomeTabelaAtual}`);
            break;
        }
    }

    tr.appendChild(acoes) // Adiciona as ações na linha
}