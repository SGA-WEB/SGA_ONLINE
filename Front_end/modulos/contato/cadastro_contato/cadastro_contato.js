import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { dataAtual, formatarData } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import buscarDados from "../../../scripts/buscarDados.js";
import { popup_carregando, popup_aviso, popup_erro } from "../../../scripts/popup.js";

export default async function cadastro_contato() {
    console.log("Cadastro de contato carregado")
    select2("100%")
    dataAtual()

    fecharMenu(document.querySelector(".modulo").offsetWidth, 584)
    window.addEventListener('resize', (e) => {
        if (document.querySelector(".modulo") != null) {
            fecharMenu(document.querySelector(".modulo").offsetWidth, 421)
        }
    })

    document.querySelector(".btn_cancelar").addEventListener("click", (e) => {
        e.preventDefault()
        carregarConteudo('contato/contato.html', document.querySelector('.principal'), false)
    })
    document.querySelector("form").addEventListener("submit", salvarDadosNoBanco)

    // --- LÓGICA PARA CONTROLAR A NAVEGAÇÃO DAS ABAS ---
    const botoesAba = document.querySelectorAll('.aba_botao');
    const conteudosAba = document.querySelectorAll('.aba_conteudo');

    botoesAba.forEach(botao => {
        botao.addEventListener('click', () => {
            // Remove a classe 'ativo' de todos
            botoesAba.forEach(b => b.classList.remove('ativo'));
            conteudosAba.forEach(c => c.classList.remove('ativa'));

            // Adiciona a classe 'ativo' apenas ao clicado e seu conteúdo
            const idAlvo = botao.dataset.aba;
            botao.classList.add('ativo');
            document.getElementById(idAlvo).classList.add('ativa');
        });
    });

    async function salvarDadosNoBanco(e) {
        e.preventDefault() // Evita o envio padrão do formulário
        // Validação básica

        if (!dados.nome_razao_social || !dados.fone1 || dados.categorias[0] == "") {
            // Se algum campo obrigatório estiver vazio, adiciona a classe de erro e foca no campo
            if (document.querySelector(".h2_titulo").textContent != "Editar contato") {
                estilo_nav(document.querySelector("#link_contato"))
            }

            popup_erro("Campos obrigatórios faltando.");
            return;
        }

        // Inserir os dados no banco de dados:
        try {
            popup_carregando()
            const response = await fetch(`http://localhost:3000/api/contatos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const resultado = await response.json();

            if (!response.ok) {
                popup_erro(`Erro: ${resultado.error}`);
                return;
            }

        } catch (error) {
            console.error('Erro:', error);
            popup_erro('Erro ao atualizar contato.');
        }

        // Atualizar as categorias do contato:
        dados.categorias = dados.categorias.map((categoria) => {
            // A API espera receber somente o ID da categoria
            // Então, convertemos o nome da categoria para o ID correspondente no banco de dados
            if (categoria === "CLIENTE") {
                return 1
            } else if (categoria === "FORNECEDOR") {
                return 2
            } else if (categoria === "FUNCIONÁRIO") {
                return 3
            }
        })

        try {
            const response = await fetch(`http://localhost:3000/api/contato/${id_contato}/categorias`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    categorias: dados.categorias
                })
            });
            if (!response.ok) {
                popup_erro('Erro ao salvar categorias.');
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao salvar categorias');
            }

            const result = await response.json();
        } catch (error) {
            popup_erro('Erro ao salvar contato.');
            console.error('Erro ao salvar:', error);
        }

        // Atualizar o endereço do contato:
        const idEndereco = dado.fk_id_endereco; // ID do endereço a ser atualizado

        const dadosEndereco = {
            cep: localStorage.getItem("cep"),
            endereco: localStorage.getItem("endereco"),
            municipio: localStorage.getItem("municipio"),
            estado: localStorage.getItem("estado"),
            pais: localStorage.getItem("pais"),
            ponto_referencia: localStorage.getItem("ponto_referencia"),
            setor: localStorage.getItem("setor")
        };

        try {
            const response = await fetch(`http://localhost:3000/api/endereco/${idEndereco}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosEndereco)
            });
            const data = await response.json();

            if (!response.ok) {
                popup_erro('Erro ao atualizar endereço.');
            }

            let links_nav = document.querySelectorAll(".link_nav") // Seleciona todos os links do nav
            links_nav.forEach(e => {
                e.classList.remove("link_nav_selecionado") // desmarca todos
            })
            popup_carregando(true)
            popup_aviso("Contato atualizado com sucesso!")
            carregarConteudo(caminho, elementoPai, false, funcao, dadosCompletos)
            localStorage.clear()
            return data.endereco;
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    }

    popup_carregando(true)
}
