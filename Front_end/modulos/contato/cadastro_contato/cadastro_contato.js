import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { dataAtual, formatarData } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import { inserirDadoDoLocalStorageNaTela, salvarNovosDadosDaTelaNoLocalStorage } from "../localStorage.js";
import buscarDados from "../../../scripts/buscarDados.js";
import { popup_carregando } from "../../../scripts/popup.js";

export default async function cadastro_contato() {
    let dados = {}
    let arrCategorias = []

    popup_carregando()

    async function chamarFuncoes() {
        await criarDados()
        dataAtual()
        btnsProximoEVoltar()
        addListenerBtns()
        select2("100%")
        inserirDadosNaTela("Cadastro de contato")
    }

    carregarConteudo("contato/cadastro_contato/criar_contato/criar_contato.html", document.querySelector(".modulo"), false, chamarFuncoes); // É passada a função chamarFuncoes para que os botões sejam ativados e os dados sejam inseridos novamente

    // Mudar de tela ao clicar no menu superior da tela de contato:
    let links_nav = document.querySelectorAll(".link_nav") // seleciona todos os links do menu superior
    links_nav[0].classList.add("link_nav_selecionado") // Adiciona a classe ao primeiro link assim que o modulo for carregado

    document.querySelectorAll('.link_nav').forEach(link => { // Seleciona todos os links
        link.addEventListener("click", (e) => {
            estilo_nav(e.target);
        });
    });

    fecharMenu(document.querySelector(".modulo").offsetWidth, 584)
    window.addEventListener('resize', (e) => {
        if (document.querySelector(".modulo") != null) {
            fecharMenu(document.querySelector(".modulo").offsetWidth, 421)
        }
    })

    function addListenerBtns() {
        document.querySelector(".btn_cancelar").addEventListener("click", (e) => {
            e.preventDefault()
            carregarConteudo('contato/contato.html', document.querySelector('.principal'), false)
        })
        document.querySelector("form").addEventListener("submit", salvarDadosNoBanco)
    }

    function estilo_nav(e) {
        let link = e
        if (e == "voltar_contatos") {
            carregarConteudo('contato/contato.html', document.querySelector('.principal'), false)
            return
        }
        let links_nav = document.querySelectorAll(".link_nav") // Seleciona todos os links do nav
        links_nav.forEach(e => {
            e.classList.remove("link_nav_selecionado") // desmarca todos
        })

        e.classList.add("link_nav_selecionado") // Adiciona a classe ao link clicado
        mudarDeAba(link.id)
    }

    function mudarDeAba(link) {
        inserirDadosNaTela("Cadastro de contato")
        switch (link) {
            case "link_contato":
                arrCategorias = [] // Zera o array para que não haja duplicidade de categorias
                carregarConteudo("contato/cadastro_contato/criar_contato/criar_contato.html", document.querySelector(".modulo"), false, chamarFuncoes); // É passada a função chamarFuncoes para que os botões sejam ativados e os dados sejam inseridos novamente
                break;
            case "link_endereco":
                carregarConteudo("contato/cadastro_contato/endereco_contato/endereco_contato.html", document.querySelector(".modulo"), false, chamarFuncoes);
                break;
        }
    }

    async function criarDados() {
        console.log(dados)
        let contatos = await buscarDados('contato');
        let contatosComMaiorId = contatos.reduce((prev, curr) => {
            return prev.id_contato > curr.id_contato ? prev : curr;
        })
        dados.id_contato = contatosComMaiorId.id_contato + 1;

        let form = document.querySelector("form")
        let dadosFomr = Object.fromEntries(new FormData(form))
        let elementCategorias = document.getElementsByName("categorias")
        for (let categoria in elementCategorias) {
            if (elementCategorias[categoria].checked) {
                arrCategorias.push(elementCategorias[categoria].value)
            }
        }
        dados = { ...dados, ...dadosFomr }
        dados.categorias = arrCategorias
    }

    function btnsProximoEVoltar() {
        let btn_nav = document.querySelectorAll(".btn_nav")
        btn_nav.forEach(e => {
            e.addEventListener("click", (e) => {
                let btn = e.target.closest(".btn_nav").id.slice(4) // Pega o id do botão que foi clicado e retira o "btn_"
                let link_nav = document.getElementById(btn)
                if (link_nav == null) {
                    link_nav = "voltar_contatos"
                }
                estilo_nav(link_nav)
            })
        })
    }

    function inserirDadosNaTela(tituloTela) {
        if (document.querySelector(".h2_titulo").textContent == tituloTela) { // Verifica se a tela é de visualização
            if (dados.tipo_pessoa === "JURÍDICA") {
                document.querySelector("#contato_juridico").checked = true
            } else if (dados.tipo_pessoa === "FÍSICA") {
                document.querySelector("#contato_fisico").checked = true
            }

            if (dados.situacao === "ATIVO") {
                document.querySelector("#ativo").checked = true
            } else if (dados.situacao === "INATIVO") {
                document.querySelector("#inativo").checked = true
            }

            let categorias = dados.categorias
            for (let i = 0; i < categorias.length; i++) {
                if (categorias[i] === "CLIENTE") {
                    document.querySelector("#cliente").checked = true
                }
                if (categorias[i] === "FORNECEDOR") {
                    document.querySelector("#fornecedor").checked = true
                }
                if (categorias[i] === "FUNCIONÁRIO") {
                    document.querySelector("#funcionario").checked = true
                }
            }
            let data = new Date()
            document.querySelector(".codigo_id").textContent = dados.id_contato
            document.querySelector(".data_cadastro").textContent = formatarData(data.toISOString())
            document.querySelector("#nome_razao_social").value = dados.nome_razao_social
            document.querySelector("#nome_fantasia").value = dados.nome_fantasia
            document.querySelector("#fone1").value = dados.fone1
            document.querySelector("#fone2").value = dados.fone2
            document.getElementsByName("tipo_pessoa").value = dados.tipo_pessoa
            document.querySelector("#insc_municipal").value = dados.insc_municipal
            document.querySelector("#insc_estadual").value = dados.insc_estadual
            document.querySelector("#cnpj").value = dados.cnpj
            document.querySelector("#cpf").value = dados.cpf
            document.querySelector("#email_padrao").value = dados.email_padrao
            document.querySelector("#perfil_tributario").value = dados.perfil_tributario
            document.querySelector("#tipo_consumidor").value = dados.tipo_consumidor
            document.querySelector("#observacao").value = dados.observacao
        }
        else if (document.querySelector(".h2_titulo").textContent.includes("Endereço")) {
            document.querySelector("#caixa_postal").value = dados.caixa_postal || ""
            document.querySelector("#pais").value = dados.pais || ""
            document.querySelector("#estado").value = dados.estado || ""
            document.querySelector("#municipio").value = dados.municipio || ""
            document.querySelector("#endereco").value = dados.endereco || ""
            document.querySelector("#referencia").value = dados.referencia || ""
            document.querySelector("#setor").value = dados.setor || ""
        }
    }

    async function salvarDadosNoBanco(e) {
        e.preventDefault() // Evita o envio padrão do formulário
        // Validação básica
        console.log(dados)
        if (!dados.razao_social || !dados.fone1 || dados.categorias[0] == "") {
            // Se algum campo obrigatório estiver vazio, adiciona a classe de erro e foca no campo
            if (document.querySelector(".h2_titulo").textContent != "Editar contato") {
                estilo_nav(document.querySelector("#link_contato"))
            }
            let nome_razao_social = document.querySelector("#nome_razao_social")
            let fone1 = document.querySelector("#fone1")
            setTimeout(() => {
                console.log(document.querySelector("form"))
            }, 200);
            if (dados.categorias[0] == "") {
                let container_checkbox = document.querySelector(".container_checkbox")
                container_checkbox.classList.add("border_red")
                container_checkbox.addEventListener("click", () => {
                    container_checkbox.classList.remove("border_red")
                })
            }

            if (!dados.fone1) {
                fone1.focus()
                fone1.classList.add("border_red")
                fone1.addEventListener("input", () => {
                    fone1.classList.remove("border_red")
                })
            }

            if (!dados.razao_social) {
                nome_razao_social.focus()
                nome_razao_social.classList.add("border_red")
                nome_razao_social.addEventListener("input", () => {
                    nome_razao_social.classList.remove("border_red")
                })
            }

            popup_erro("Campos obrigatórios faltando.");
            return;
        }

        // Inserir os dados no banco de dados:
        try {
            popup_carregando()
            const response = await fetch(`http://localhost:3000/api/contato/${id_contato}`, {
                method: 'PUT',
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
