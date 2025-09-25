import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { formatarData } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import editar_contato from "../editar_contato/editar_contato.js";
import excluir_contato from "../excluir_contato.js";
import { popup } from "../../../scripts/popup.js";

export default async function visualizar_contato(dado) {
    select2("100%")

    const botoesAba = document.querySelectorAll('.aba_botao');
    const conteudosAba = document.querySelectorAll('.aba_conteudo');

    // Listeners dos botões de navegação e abas
    botoesAba.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesAba.forEach(b => b.classList.remove('ativo'));
            conteudosAba.forEach(c => c.classList.remove('ativa'));
            const idAlvo = botao.dataset.aba;
            botao.classList.add('ativo');
            document.getElementById(idAlvo).classList.add('ativa');

            let btnProximo = document.querySelector('.btn_proximo');
            if (btnProximo) { // Adiciona verificação para evitar erro se o botão não existir
                btnProximo.style.display = (idAlvo === 'aba_endereco') ? 'none' : 'block';
            }
        });
    });

    // Os botões abaixo são opcionais dependendo da sua tela
    const btnVoltar = document.querySelector("#btn_voltar");
    if (btnVoltar) {
        btnVoltar.addEventListener("click", async (e) => {
            let abaAtiva = document.querySelector('.aba_conteudo.ativa').id;
            if (abaAtiva === 'aba_contato') {
                carregarConteudo('contato/contato.html', document.querySelector('.principal'), false);
            } else {
                const linkContato = document.querySelector('[data-aba="aba_contato"]');
                if (linkContato) linkContato.click();
            }
        });
    }

    const btnProximo = document.querySelector(".btn_proximo");
    if (btnProximo) {
        btnProximo.addEventListener("click", (e) => {
            const linkEndereco = document.querySelector('[data-aba="aba_endereco"]');
            if (linkEndereco) linkEndereco.click();
        });
    }

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
    btn_excluir.addEventListener("click", () => {
        excluir_contato(dado, carregarConteudo, "contato/contato.html", document.querySelector(".principal"))
    })

    fecharMenu(document.querySelector(".modulo").offsetWidth, 584)
    window.addEventListener('resize', (e) => {
        if (document.querySelector(".modulo") != null) {
            fecharMenu(document.querySelector(".modulo").offsetWidth, 421)
        }
    })

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
