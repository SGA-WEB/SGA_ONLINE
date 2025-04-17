import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { formatarData } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import contato from "../contato.js";
import visualizar_contato from "../visualizar_contato/visualizar_contato.js";

export default async function editar_contato (dado, telaAnteriorVisualizar) {
    console.log(dado)
    let caminho = "contato/contato.html"
    let funcao = contato
    let elementoPai = document.querySelector(".principal")

    const response = await fetch(`http://localhost:3000/api/endereco/${dado.fk_id_endereco}`);
    const endereco = await response.json();

    if (telaAnteriorVisualizar) {
        caminho = "contato/visualizar_contato/criar_contato/visualizar_contato.html"
        funcao = visualizar_contato
        elementoPai = document.querySelector(".modulo")
    }

    let cont = 0        

    let links_nav = document.querySelectorAll(".link_nav") // seleciona todos os links do menu superior
    if (cont == 0) {
        links_nav[0].classList.add("link_nav_selecionado") // Adiciona a classe ao primeiro link assim que o modulo for carregado
    }

    document.querySelectorAll('.link_nav').forEach(link => { // Seleciona todos os links
        link.addEventListener("click", (e) => { 
            estilo_nav(e.target);
        });
    });
    localStorage.clear()
    if (localStorage.length == 0) {
        salvarDadosDoBancoNoLocalStorage()
    }
    btnsProximoEVoltar()
    inserirDadoDoLocalStorageNaTela()
    addListenerBtns()
    select2("100%")
    
    fecharMenu(document.querySelector(".modulo").offsetWidth, 584)
    window.addEventListener('resize', (e) => { 
        if(document.querySelector(".modulo") != null){
            fecharMenu(document.querySelector(".modulo").offsetWidth, 421)
        } 
    })

    function addListenerBtns () {
        document.querySelector(".btn_cancelar").addEventListener("click", () => {
            carregarConteudo(caminho, elementoPai, false, funcao, dado)
            localStorage.clear()
        })
        document.querySelector(".btn_salvar").addEventListener("click", salvarNovosDadosDaTelaNoLocalStorage)
    }

    function estilo_nav (e) {
        let link = e
        if (e == "voltar_contatos") {
            localStorage.clear()
            carregarConteudo(caminho, elementoPai, false, funcao, dado)
            return
        }
        let links_nav= document.querySelectorAll(".link_nav") // Seleciona todos os links do nav
        links_nav.forEach(e=>{
            e.classList.remove("link_nav_selecionado") // desmarca todos
        })
        
        e.classList.add("link_nav_selecionado") // Adiciona a classe ao link clicado
        mudarDeAba(link.id)
    }
    
    function mudarDeAba (link) {
        salvarNovosDadosDaTelaNoLocalStorage()
        switch (link) {
            case "link_contato":
                carregarConteudo("contato/editar_contato/criar_contato/editar_contato.html", document.querySelector(".modulo"), false, chamarFuncoes); // E passada a função chamarFuncoes para que os botões sejam ativados e os dados sejam inseridos novamente
            break;
            case "link_endereco":
                carregarConteudo("contato/editar_contato/endereco_contato/editar_endereco_contato.html", document.querySelector(".modulo"), false, chamarFuncoes);
            break;
        }
    }

    function chamarFuncoes () {
        btnsProximoEVoltar()
        inserirDadoDoLocalStorageNaTela()
        addListenerBtns()
        select2("100%")
    }

    function btnsProximoEVoltar() {
        let btn_nav = document.querySelectorAll(".btn_nav")
        btn_nav.forEach(e=>{
            e.addEventListener("click", (e)=>{
                let btn = e.target.closest(".btn_nav").id.slice(4) // Pega o id do botão que foi clicado e retira o "btn_"
                let link_nav = document.getElementById(btn)
                if (link_nav == null) {
                    link_nav = "voltar_contatos"
                }
                estilo_nav(link_nav)
            })
        })
    }

    function salvarDadosDoBancoNoLocalStorage() {
        // Quando a página carregar os dados do banco vão para a localStorage
        for (const key in dado) {
            // Armazena os dados gerais do contato
            if (dado.hasOwnProperty(key)) {
                localStorage.setItem(key, dado[key]);
            }
            if(typeof(dado[key]) === "object") {
                let categorias = []
                for(let c in dado[key]) {
                    categorias.push(dado[key][c].nome)
                }
                localStorage.setItem("categorias", categorias)
            }
        }
        for (const key in endereco) {
            // Armazena o endereço do contato
            if (endereco.hasOwnProperty(key)) {
                localStorage.setItem(key, endereco[key])
            }
        }
    }

    function inserirDadoDoLocalStorageNaTela () { // GET
        if (document.querySelector(".h2_titulo").textContent == "Editar contato"){ // Verifica se a tela é de visualização
            if (localStorage.getItem("tipo_pessoa") === "Jurídica") {
                document.querySelector("#contato_juridico").checked = true
            } else if (localStorage.getItem("tipo_pessoa") === "Física") {
                document.querySelector("#contato_fisico").checked = true
            }

            if (localStorage.getItem("situacao") === "Ativo") {
                document.querySelector("#ativo").checked = true
            } else if (localStorage.getItem("situacao") === "Inativo") {
                document.querySelector("#inativo").checked = true
            }

            // O array no localStorage vira um string tipo: "Cliente,Funcionário"
            let categorias = localStorage.getItem("categorias").split(",") // transoforma a string em um array
            for (let i = 0; i < categorias.length; i++) {
                if (categorias[i] === "Cliente") {
                    document.querySelector("#cliente").checked = true
                }
                if (categorias[i] === "Fornecedor") {
                    document.querySelector("#fornecedor").checked = true
                }
                if (categorias[i] === "Funcionário") {
                    document.querySelector("#funcionario").checked = true
                }
            }

            document.querySelector(".codigo_id").textContent = localStorage.getItem("id_contato")
            document.querySelector(".data_cadastro").textContent = formatarData(localStorage.getItem("data_cadastro"))
            document.querySelector("#nome_razao_social").value = localStorage.getItem("razao_social")
            document.querySelector("#nome_fantasia").value = localStorage.getItem("nome_fantasia")
            document.querySelector("#fone1").value = localStorage.getItem("fone1")
            document.querySelector("#fone2").value = localStorage.getItem("fone2")
            document.getElementsByName("tipo_pessoa").value = localStorage.getItem("tipo_pessoa")
            document.querySelector("#insc_municipal").value = localStorage.getItem("insc_municipal")
            document.querySelector("#insc_estadual").value = localStorage.getItem("insc_estadual")
            document.querySelector("#cnpj").value = localStorage.getItem("cnpj")
            document.querySelector("#cpf").value = localStorage.getItem("cpf")
            document.querySelector("#email_padrao").value = localStorage.getItem("email_padrao")
            document.querySelector("#perfil_tributario").value = localStorage.getItem("perfil_tributario")
            document.querySelector("#tipo_consumidor").value = localStorage.getItem("tipo_consumidor")
            document.querySelector("#observacao").value = localStorage.getItem("observacao")
        } 
        else if (document.querySelector(".h2_titulo").textContent.includes("Endereço")) { 
            document.querySelector("#caixa_postal_principal").value = localStorage.getItem("cep")
            document.querySelector("#pais_principal").value = localStorage.getItem("pais")
            document.querySelector("#estado_principal").value = localStorage.getItem("estado")
            document.querySelector("#municipio_principal").value = localStorage.getItem("municipio")
            document.querySelector("#endereco_principal").value = localStorage.getItem("endereco")
            document.querySelector("#referencia_principal").value = localStorage.getItem("ponto_referencia")
            document.querySelector("#setor_principal").value = localStorage.getItem("setor")
        }
    }

    function salvarNovosDadosDaTelaNoLocalStorage() { // SET
        if (document.querySelector(".h2_titulo").textContent == "Editar contato"){ // Verifica se a tela é de visualização
            let elementCategorias = document.getElementsByName("categoria")
           
            let arrCategorias = []
            for (let categoria in elementCategorias) {
                if(elementCategorias[categoria].checked) {
                    arrCategorias.push(elementCategorias[categoria].value)
                }
            }

            localStorage.setItem("categorias", arrCategorias)
            localStorage.setItem("data_cadastro", dado.data_cadastro)
            localStorage.setItem("id_contato", dado.id_contato)
            localStorage.setItem("tipo_pessoa", document.querySelector('input[name="tipo_pessoa"]:checked').value)
            localStorage.setItem("situacao", document.querySelector('input[name="situacao"]:checked').value)
            localStorage.setItem("razao_social", document.querySelector("#nome_razao_social").value)
            localStorage.setItem("nome_fantasia", document.querySelector("#nome_fantasia").value)
            localStorage.setItem("fone1", document.querySelector("#fone1").value)
            localStorage.setItem("fone2", document.querySelector("#fone2").value)
            localStorage.setItem("insc_municipal", document.querySelector("#insc_municipal").value)
            localStorage.setItem("insc_estadual", document.querySelector("#insc_estadual").value)
            localStorage.setItem("cnpj", document.querySelector("#cnpj").value)
            localStorage.setItem("cpf", document.querySelector("#cpf").value)
            localStorage.setItem("email_padrao", document.querySelector("#email_padrao").value)
            localStorage.setItem("perfil_tributario", document.querySelector("#perfil_tributario").value)
            localStorage.setItem("tipo_consumidor", document.querySelector("#tipo_consumidor").value)
            localStorage.setItem("observacao", document.querySelector("#observacao").value)
        } else if (document.querySelector(".h2_titulo").textContent.includes("Endereço")) {
            localStorage.setItem("cep", document.querySelector("#caixa_postal_principal").value)
            localStorage.setItem("pais", document.querySelector("#pais_principal").value)
            localStorage.setItem("estado", document.querySelector("#estado_principal").value)
            localStorage.setItem("municipio", document.querySelector("#municipio_principal").value)
            localStorage.setItem("endereco", document.querySelector("#endereco_principal").value)
            localStorage.setItem("ponto_referencia", document.querySelector("#referencia_principal").value)
            localStorage.setItem("setor", document.querySelector("#setor_principal").value)
        }
    }

    window.addEventListener("beforeunload", function(event) {
        console.log(event)
        localStorage.clear()
    });
    
}
