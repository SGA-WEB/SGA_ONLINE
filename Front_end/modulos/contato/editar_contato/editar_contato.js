import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { formatarData } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import contato from "../contato.js";
import visualizar_contato from "../visualizar_contato/visualizar_contato.js";
import { popup_aviso, popup_carregando, popup_erro } from "../../../scripts/popup.js";

export default async function editar_contato(dado, telaAnteriorVisualizar) {
    select2("100%")

    const botoesAba = document.querySelectorAll('.aba_botao');
    const conteudosAba = document.querySelectorAll('.aba_conteudo');
    const btnProximo = document.querySelector('.btn_proximo');

    // Listeners dos botões de navegação e abas
    botoesAba.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesAba.forEach(b => b.classList.remove('ativo'));
            conteudosAba.forEach(c => c.classList.remove('ativa'));
            const idAlvo = botao.dataset.aba;
            botao.classList.add('ativo');
            document.getElementById(idAlvo).classList.add('ativa');
            if (btnProximo) { // Adiciona verificação para evitar erro se o botão não existir
                btnProximo.style.display = (idAlvo === 'aba_endereco') ? 'none' : 'block';
            }
        });
    });

    if (btnProximo) {
        btnProximo.addEventListener("click", (e) => {
            const linkEndereco = document.querySelector('[data-aba="aba_endereco"]');
            if (linkEndereco) linkEndereco.click();
        });
    }

    // Os botões abaixo são opcionais dependendo da sua tela
    const btnVoltar = document.querySelector("#btn_voltar");
    if (btnVoltar) {
        btnVoltar.addEventListener("click", async (e) => {
            let abaAtiva = document.querySelector('.aba_conteudo.ativa').id;
            if (abaAtiva === 'aba_contato') {
                if (telaAnteriorVisualizar) {
                    carregarConteudo(
                        "contato/visualizar_contato/visualizar_contato.html",
                        document.querySelector(".modulo"),
                        false,
                        visualizar_contato,
                        dado
                    );
                } else {
                    carregarConteudo('contato/contato.html', document.querySelector('.principal'), false);
                }
            } else {
                const linkContato = document.querySelector('[data-aba="aba_contato"]');
                if (linkContato) linkContato.click();
            }
        });
    }

    const btn_cancelar = document.querySelector(".btn_cancelar")
    if (btn_cancelar) {
        btn_cancelar.addEventListener("click", async (e) => {
            if (telaAnteriorVisualizar) {
                carregarConteudo(
                    "contato/visualizar_contato/visualizar_contato.html",
                    document.querySelector(".modulo"),
                    false,
                    visualizar_contato,
                    dado
                );
            } else {
                carregarConteudo('contato/contato.html', document.querySelector('.principal'), false);
            }
        });
    }


    fecharMenu(document.querySelector(".modulo").offsetWidth, 584)
    window.addEventListener('resize', (e) => {
        if (document.querySelector(".modulo") != null) {
            fecharMenu(document.querySelector(".modulo").offsetWidth, 421)
        }
    })

    function destaqueCategorias() {
        let container_checkbox = document.querySelector(".container_checkbox")
        container_checkbox.classList.add("border_red")
        document.querySelector("#link_contato").click()
        setInterval(() => {
            container_checkbox.classList.remove("border_red")
        }, 5000)
    }

    // Preenchendo os dados do contato
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

    dado.categorias.forEach((categoria) => {
        if (categoria.nome === "CLIENTE") {
            document.querySelector("#cliente").checked = true
        }
        if (categoria.nome === "FORNECEDOR") {
            document.querySelector("#fornecedor").checked = true
        }
        if (categoria.nome === "FUNCIONÁRIO") {
            document.querySelector("#funcionario").checked = true
        }
    })

    if (dado.tipo_pessoa === "FÍSICA") {
        document.querySelector("#contato_fisico").checked = true
    }
    if (dado.tipo_pessoa === "JURÍDICA") {
        document.querySelector("#contato_juridico").checked = true
    }

    if (dado.situacao === "ATIVO") {
        document.querySelector("#ativo").checked = true
    }
    if (dado.situacao === "INATIVO") {
        document.querySelector("#inativo").checked = true
    }


    const response = await fetch(`http://localhost:3000/api/endereco/${dado.fk_id_endereco}`);
    const endereco = await response.json();
    document.querySelector("#cep").value = endereco.cep
    document.querySelector("#pais").value = endereco.pais
    document.querySelector("#estado").value = endereco.estado
    document.querySelector("#municipio").value = endereco.municipio
    document.querySelector("#endereco").value = endereco.endereco
    document.querySelector("#ponto_referencia").value = endereco.ponto_referencia
    document.querySelector("#setor").value = endereco.setor


    document.querySelector("#form_editar_contato").addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = document.querySelector("#form_editar_contato");
        const formData = new FormData(form);
        const todasCategorias = formData.getAll('categorias').map(Number);

        const payload = {
            razao_social: formData.get('razao_social'),
            nome_fantasia: formData.get('nome_fantasia') || null,
            fone1: formData.get('fone1'),
            fone2: formData.get('fone2') || null,
            insc_municipal: formData.get('insc_municipal') || null,
            insc_estadual: formData.get('insc_estadual') || null,
            cnpj: formData.get('cnpj') || null,
            cpf: formData.get('cpf') || null,
            email_padrao: formData.get('email_padrao') || null,
            perfil_tributario: formData.get('perfil_tributario'),
            tipo_consumidor: formData.get('tipo_consumidor'),
            observacao: formData.get('observacao') || null,
            tipo_pessoa: formData.get('tipo_pessoa'),
            situacao: formData.get('situacao') || 'Ativo',
            inativo: formData.get('inativo') === 'true',
            fk_id_endereco: dado.fk_id_endereco,
            endereco: {
                cep: formData.get('cep'),
                pais: formData.get('pais') || 'Brasil',
                estado: formData.get('estado'),
                municipio: formData.get('municipio'),
                endereco: formData.get('endereco'),
                ponto_referencia: formData.get('ponto_referencia') || null,
                setor: formData.get('setor') || null
            },
            categorias: todasCategorias
        };

        // Inserir os dados no banco de dados:
        try {
            popup_carregando()
            if (todasCategorias.length === 0) {
                destaqueCategorias()
                throw new Error("Defina pelo menos uma categoria para o contato");
            }
            const response = await fetch(`http://localhost:3000/api/contato/${dado.id_contato}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const resultado = await response.json();

            if (!response.ok) {
                popup_erro(`Erro: ${resultado.error}`);
                return;
            }

        } catch (error) {
            console.error('Erro:', error);
            popup_carregando(true)
            popup_erro('Erro ao atualizar contato. ' + error.message);
        }

        try {
            const response = await fetch(`http://localhost:3000/api/contato/${dado.id_contato}/categorias`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    categorias: todasCategorias
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

        try {
            const response = await fetch(`http://localhost:3000/api/endereco/${idEndereco}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload.endereco),
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

            if (telaAnteriorVisualizar) {
                carregarConteudo(
                    "contato/visualizar_contato/visualizar_contato.html",
                    document.querySelector(".modulo"),
                    false,
                    visualizar_contato,
                    payload
                );
            } else {
                carregarConteudo('contato/contato.html', document.querySelector('.principal'), false)
            }
            return data.endereco;
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    })
}
