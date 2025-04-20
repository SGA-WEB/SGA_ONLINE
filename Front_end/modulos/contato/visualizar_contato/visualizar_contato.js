import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { formatarData } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import editar_contato from "../editar_contato/editar_contato.js";
import excluir_contato from "../excluir_contato.js";
import { popup } from "../../../scripts/popup.js";
import buscarDados from "../../../scripts/buscarDados.js";

export default function visualizar_contato (dado) {
    let cont = 0        
    // Mudar de tela ao clicar no menu superior da tela de contato:
    let links_nav = document.querySelectorAll(".link_nav") // seleciona todos os links do menu superior
    if (cont == 0) {
        links_nav[0].classList.add("link_nav_selecionado") // Adiciona a classe ao primeiro link assim que o modulo for carregado
    }

    document.querySelectorAll('.link_nav').forEach(link => { // Seleciona todos os links que não possuem a classe link_nav_selecionado
        link.addEventListener("click", (e) => { 
            estilo_nav(e.target);
        });
    });

    select2("100%")
    btnsProximoEVoltar()
    inserirDadoDoBanco()
    addListenerBtnsAcoes()
    
    function addListenerBtnsAcoes () {
        document.querySelector(".btn_editar").addEventListener("click", async () => {
            await carregarConteudo(
                `contato/editar_contato/nav_contato.html`,
                document.querySelector('.principal')
            )
            carregarConteudo(
                `contato/editar_contato/criar_contato/editar_contato.html`,
                document.querySelector('.modulo'),
                false,
                editar_contato,
                dado,
                true
            );
        })
    
        let btn_excluir = document.querySelector(".btn_excluir")
        btn_excluir.addEventListener("click",() => {
            popup("abrir", 0, btn_excluir)
            excluir_contato(dado, carregarConteudo, "contato/contato.html", document.querySelector(".principal"))
        })
    }

    
    fecharMenu(document.querySelector(".modulo").offsetWidth, 584)
    window.addEventListener('resize', (e) => { 
        if(document.querySelector(".modulo") != null){
            fecharMenu(document.querySelector(".modulo").offsetWidth, 421)
        } 
    })

    function estilo_nav (e) {
        let link = e
        if (e == "voltar_contatos") {
            carregarConteudo("contato/contato.html", document.querySelector(".principal"))
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
        switch (link) {
            case "link_contato":
                carregarConteudo("contato/visualizar_contato/criar_contato/visualizar_contato.html", document.querySelector(".modulo"), false, chamarFuncoesNovamente); // E passada a função chamarFuncoesNovamente para que os dados sejam inseridos novamente na tela e os botões "proximo" e "voltar" sejam ativados
            break;
            case "link_endereco":
                carregarConteudo("contato/visualizar_contato/endereco_contato/visualizar_endereco_contato.html", document.querySelector(".modulo"), false, chamarFuncoesNovamente);
            break;
        }
    }

    function chamarFuncoesNovamente () {
        btnsProximoEVoltar()
        inserirDadoDoBanco()
        addListenerBtnsAcoes()
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

    async function inserirDadoDoBanco () {
        if (document.querySelector(".h2_titulo").textContent == "Visualizar contato"){ // Verifica se a tela é de visualização
            if (dado.tipo_pessoa === "JURÍDICA") {
                document.querySelector("#contato_juridico").checked = true
            } else if (dado.tipo_pessoa === "FÍSICA") {
                document.querySelector("#contato_fisico").checked = true
            }

            if (dado.situacao === "ATIVO") {
                document.querySelector("#ativo").checked = true
            } else if (dado.situacao === "INATIVO") {
                document.querySelector("#inativo").checked = true
            }

            dado.categorias.forEach(e => {
                if (e.nome === "CLIENTE") {
                    document.querySelector("#cliente").checked = true
                }
                if (e.nome === "FORNECEDOR") {
                    document.querySelector("#fornecedor").checked = true
                }
                if (e.nome === "FUNCIONÁRIO") {
                    document.querySelector("#funcionario").checked = true
                }
            })

            document.querySelector(".codigo_id").textContent = dado.id_contato
            document.querySelector(".data_cadastro").textContent = formatarData(dado.data_cadastro)
            document.querySelector("#nome_razao_social").value = dado.razao_social
            document.querySelector("#nome_fantasia").value = dado.nome_fantasia
            document.querySelector("#fone1").value = dado.fone1
            document.querySelector("#fone2").value = dado.fone2
            document.getElementsByName("tipo_contato").value = dado.tipo_contato
            document.querySelector("#insc_municipal").value = dado.insc_municipal
            document.querySelector("#insc_estadual").value = dado.insc_estadual
            document.querySelector("#cnpj").value = dado.cnpj
            document.querySelector("#cpf").value = dado.cpf
            document.querySelector("#email_padrao").value = dado.email_padrao
            document.querySelector("#perfil_tributario").value = dado.perfil_tributario
            document.querySelector("#tipo_consumidor").value = dado.tipo_consumidor
            document.querySelector("#observacao").value = dado.observacao
        } 
        else if (document.querySelector(".h2_titulo").textContent.includes("Endereço")) {
            const response = await fetch(`http://localhost:3000/api/endereco/${dado.fk_id_endereco}`);
            const endereco = await response.json();
            document.querySelector("#caixa_postal_principal").value = endereco.cep
            document.querySelector("#pais_principal").value = endereco.pais
            document.querySelector("#estado_principal").value = endereco.estado
            document.querySelector("#municipio_principal").value = endereco.municipio
            document.querySelector("#endereco_principal").value = endereco.endereco
            document.querySelector("#referencia_principal").value = endereco.ponto_referencia
            document.querySelector("#setor_principal").value = endereco.setor
        }
    }
    cont++
} 
