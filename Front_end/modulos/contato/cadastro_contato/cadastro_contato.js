import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { dataAtual, formatarData } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import { inserirDadoDoLocalStorageNaTela, salvarNovosDadosDaTelaNoLocalStorage } from "../localStorage.js";
import buscarDados from "../../../scripts/buscarDados.js";
import { popup_carregando } from "../../../scripts/popup.js";

export default async function cadastro_contato() {
    let cont = 0
    popup_carregando()


    let contatos = await buscarDados('contato');
    let contatosComMaiorId = contatos.reduce((prev, curr) => {
        return prev.id_contato > curr.id_contato ? prev : curr;
    })
    let nextIdContato = contatosComMaiorId.id_contato + 1;
    document.querySelector(".codigo_id").innerHTML = nextIdContato;

    // Mudar de tela ao clicar no menu superior da tela de contato:
    let links_nav = document.querySelectorAll(".link_nav") // seleciona todos os links do menu superior
    if (cont == 0) {
        links_nav[0].classList.add("link_nav_selecionado") // Adiciona a classe ao primeiro link assim que o modulo for carregado
    }

    document.querySelectorAll('.link_nav').forEach(link => { // Seleciona todos os links
        link.addEventListener("click", (e) => {
            estilo_nav(e.target);
        });
    });

    dataAtual()
    select2("100%")
    btnsProximoEVoltar()
    addListenerBtns()

    fecharMenu(document.querySelector(".modulo").offsetWidth, 584)
    window.addEventListener('resize', (e) => {
        if (document.querySelector(".modulo") != null) {
            fecharMenu(document.querySelector(".modulo").offsetWidth, 421)
        }
    })

    function addListenerBtns() {
        document.querySelector(".btn_cancelar").addEventListener("click", () => {
            carregarConteudo('contato/contato.html', document.querySelector('.principal'), false)
        })
        document.querySelector(".btn_salvar").addEventListener("click", () => {
            let data = new Date()
            salvarNovosDadosDaTelaNoLocalStorage({ data_cadastro: data.toISOString(), id_contato: nextIdContato }, "Cadastro de contato")
        });
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

    let dados = {}
    let arrCategorias = []

    function mudarDeAba(link) {
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

    function chamarFuncoes() {
        inserirDadosNaTela("Cadastro de contato")
        btnsProximoEVoltar()
        addListenerBtns()
        select2("100%")
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
        console.log(dados)
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
            console.log(categorias)
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
            document.querySelector(".codigo_id").textContent = nextIdContato
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
            document.querySelector("#caixa_postal_principal").value = dados.cep
            document.querySelector("#pais_principal").value = dados.pais
            document.querySelector("#estado_principal").value = dados.estado
            document.querySelector("#municipio_principal").value = dados.municipio
            document.querySelector("#endereco_principal").value = dados.endereco
            document.querySelector("#referencia_principal").value = dados.ponto_referencia
            document.querySelector("#setor_principal").value = dados.setor
        }
    }

    popup_carregando(true)
}
