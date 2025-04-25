import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { formatarData } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import contato from "../contato.js";
import visualizar_contato from "../visualizar_contato/visualizar_contato.js";
import { popup_aviso, popup_carregando, popup_erro } from "../../../scripts/popup.js";

export default async function editar_contato (dado, telaAnteriorVisualizar) {
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
        document.querySelector(".btn_salvar").addEventListener("click", salvarDadosDoLocalStorageNoBanco)
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

    async function estilo_nav (e) {
        let link = e
        let links_nav= document.querySelectorAll(".link_nav") // Seleciona todos os links do nav
        links_nav.forEach(e=>{
            e.classList.remove("link_nav_selecionado") // desmarca todos
        })
        if (e == "voltar_contatos") {
            localStorage.clear()
            carregarConteudo(caminho, elementoPai, false, funcao, dado)
            return
        }
        
        e.classList.add("link_nav_selecionado") // Adiciona a classe ao link clicado
        await mudarDeAba(link.id)
    }
    
    async function mudarDeAba (link) {
        salvarNovosDadosDaTelaNoLocalStorage()
        switch (link) {
            case "link_contato":
                await carregarConteudo("contato/editar_contato/criar_contato/editar_contato.html", document.querySelector(".modulo"), false, chamarFuncoes); // E passada a função chamarFuncoes para que os botões sejam ativados e os dados sejam inseridos novamente
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

    
    // Assim que o a tela de editar é carregada e não tiver os dados no localStorage, os dados do banco vão para a localStorage (salvarDadosDoBancoNoLocalStorage())
    // Depois os dados do localStorage vão para a tela (inserirDadoDoLocalStorageNaTela())
    // Se o usuário clicar em trocar de aba dados que foram editados na tela vão para o localStorage (salvarNovosDadosDaTelaNoLocalStorage())
    // Se o usuário clicar em salvar, os a função (salvarNovosDadosDaTelaNoLocalStorage()) é chamada novamente para salvar os novos dados digitados na tela e depois os dados do localStorage vão para o banco (salvarDadosDoLocalStorageNoBanco())
    // Se o usuário clicar em cancelar, os dados do localStorage são apagados e a tela de contatos é carregada novamente (carregarConteudo(caminho, elementoPai, false, funcao, dado)) 

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
            if (localStorage.getItem("tipo_pessoa") === "JURÍDICA") {
                document.querySelector("#contato_juridico").checked = true
            } else if (localStorage.getItem("tipo_pessoa") === "FÍSICA") {
                document.querySelector("#contato_fisico").checked = true
            }

            if (localStorage.getItem("situacao") === "ATIVO") {
                document.querySelector("#ativo").checked = true
            } else if (localStorage.getItem("situacao") === "INATIVO") {
                document.querySelector("#inativo").checked = true
            }

            // O array no localStorage vira um string tipo: "Cliente,Funcionário"
            let categorias = localStorage.getItem("categorias").split(",") // transoforma a string em um array
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

    async function salvarDadosDoLocalStorageNoBanco() { // PUT
        salvarNovosDadosDaTelaNoLocalStorage()

        let objDados = {};
        for (let d in dado) {
            objDados[d] = localStorage.getItem(d);
        }

        let dadosCompletos = {...objDados}
        let id_contato = objDados.id_contato;
        let categoriasSelecionadas = localStorage.getItem("categorias").split(",")
        delete objDados.id_contato;
        delete objDados.data_cadastro;
        delete objDados.fk_id_endereco;
        delete objDados.categorias;

        dadosCompletos.categorias = categoriasSelecionadas.map((e) => {return {nome: e}})

        // Corrige valores nulos e converte inativo para booleano
        for (let key in objDados) {
            const valor = objDados[key];
            if (valor === "undefined" || valor === "null" || valor === null) {
                delete objDados[key];
            } else if (key === "inativo") {
                objDados[key] = valor === "true";
            }
        }

        // Validação básica
        if (!objDados.razao_social || !objDados.fone1 || categoriasSelecionadas[0] == "") {
            // Se algum campo obrigatório estiver vazio, adiciona a classe de erro e foca no campo
            if (document.querySelector(".h2_titulo").textContent != "Editar contato") {
                await estilo_nav(document.querySelector("#link_contato"))
                let nome_razao_social = document.querySelector("#nome_razao_social")
                let fone1 = document.querySelector("#fone1")
                
                if (categoriasSelecionadas[0] == "") {
                    let container_checkbox = document.querySelector(".container_checkbox")
                    container_checkbox.classList.add("border_red")
                    container_checkbox.addEventListener("click", () => {
                        container_checkbox.classList.remove("border_red")
                    })
                }
    
                if (!objDados.fone1) {
                    fone1.focus()
                    fone1.classList.add("border_red")
                    fone1.addEventListener("input", () => {
                        fone1.classList.remove("border_red")
                    })
                }
                
                if (!objDados.razao_social) {
                    nome_razao_social.focus()
                    nome_razao_social.classList.add("border_red")
                    nome_razao_social.addEventListener("input", () => {
                        nome_razao_social.classList.remove("border_red")
                    })
                }
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
                body: JSON.stringify(objDados)
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
        categoriasSelecionadas = categoriasSelecionadas.map((categoria) => {
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
                    categorias: categoriasSelecionadas
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

            let links_nav= document.querySelectorAll(".link_nav") // Seleciona todos os links do nav
            links_nav.forEach(e=>{
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

    window.addEventListener("beforeunload", function(event) {
        // Limpa o storage ao recarregar a página
        localStorage.clear()
    });
    
}
