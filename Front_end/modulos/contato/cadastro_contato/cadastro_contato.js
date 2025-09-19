import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js";
import { dataAtual, formatarData } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import buscarDados from "../../../scripts/buscarDados.js";
import { popup_carregando, popup_aviso, popup_erro, popup_confirmar } from "../../../scripts/popup.js";

export default async function cadastro_contato() {
    // =================================================================
    // PASSO 1: INICIALIZAÇÃO GERAL (SETUP INICIAL)
    // =================================================================
    popup_carregando();

    // Busca os dados necessários ANTES de adicionar listeners
    const contatos = await buscarDados('contato');
    const idProximoContato = contatos.length > 0 ? Math.max(...contatos.map(c => c.id_contato)) + 1 : 1;
    document.querySelector(".codigo_id").textContent = idProximoContato;

    // Inicializa plugins e configurações visuais
    select2("100%");
    dataAtual();
    fecharMenu(document.querySelector(".modulo").offsetWidth, 584);

    // =================================================================
    // PASSO 2: PEGAR REFERÊNCIAS DOS ELEMENTOS PRINCIPAIS
    // =================================================================
    // Pegamos a referência do formulário UMA ÚNICA VEZ e guardamos
    const form = document.getElementById('form_cadastro_contato'); // Usar ID é mais seguro!

    // Verificação de segurança: se o formulário não existir, pare a execução.
    if (!form) {
        console.error("Formulário principal não encontrado! O script não pode continuar.");
        popup_carregando(true);
        return;
    }

    const botoesAba = document.querySelectorAll('.aba_botao');
    const conteudosAba = document.querySelectorAll('.aba_conteudo');

    // =================================================================
    // PASSO 3: DEFINIÇÃO DAS FUNÇÕES
    // =================================================================

    async function confirmarSaida() {
        // Esta função agora usa a variável 'form' definida no escopo principal.
        const dados = Object.fromEntries(new FormData(form));
        let dadosPreenchidos = 0;
        for (let chave in dados) {
            if (dados[chave] !== "" && dados[chave] !== null) {
                dadosPreenchidos++;
            }
        }
        if (dadosPreenchidos <= 4) return true;

        const confirmado = await popup_confirmar(
            "Existem dados preenchidos. Tem certeza que deseja sair sem salvar?", "Sim"
        );
        return confirmado;
    }

    function destaqueCategorias() {
        let container_checkbox = document.querySelector(".container_checkbox")
        container_checkbox.classList.add("border_red")
        document.querySelector("#link_contato").click()
        setInterval(()=>{
            container_checkbox.classList.remove("border_red")
        },5000)
    }

    async function salvarDadosNoBanco(e) {
        e.preventDefault();

        if (form.checkValidity()) {
            try {
                const formData = new FormData(form);
                const todasCategorias = formData.getAll('categorias').map(Number);

                if (todasCategorias.length === 0) {
                    destaqueCategorias()
                    throw new Error("Defina pelo menos uma categoria para o contato");
                }

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

                popup_carregando();
                const response = await fetch('http://localhost:3000/api/contatos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const resultado = await response.json();
                if (!response.ok) {
                    throw new Error(resultado.error || `HTTP error! status: ${response.status}`);
                }
                popup_carregando(true);
                popup_aviso("Contato criado com sucesso!");
                carregarConteudo('contato/contato.html', document.querySelector('.principal'), false);
                form.reset();
            } catch (error) {
                popup_carregando(true);
                popup_erro(error.message);
                console.error("Falha ao salvar contato:", error);
            }
        } else {
            const primeiroCampoInvalido = form.querySelector(':invalid');
            if (primeiroCampoInvalido) {
                const painelDaAba = primeiroCampoInvalido.closest('.aba_conteudo');
                if (painelDaAba && !painelDaAba.classList.contains('ativa')) {
                    const idDaAba = painelDaAba.id;
                    const botaoDaAba = document.querySelector(`.aba_botao[data-aba="${idDaAba}"]`);
                    if (botaoDaAba) botaoDaAba.click();
                }
            }
            form.reportValidity();
        }
    }

    // =================================================================
    // PASSO 4: ADICIONAR OS EVENT LISTENERS
    // =================================================================

    // Listener do formulário principal
    document.querySelector(".btn_salvar").addEventListener("click", salvarDadosNoBanco);

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

    document.querySelector(".btn_cancelar").addEventListener("click", (e) => {
        e.preventDefault();
        carregarConteudo('contato/contato.html', document.querySelector('.principal'), false);
    });

    // Os botões abaixo são opcionais dependendo da sua tela
    const btnVoltar = document.querySelector("#btn_voltar");
    if (btnVoltar) {
        btnVoltar.addEventListener("click", async (e) => {
            let abaAtiva = document.querySelector('.aba_conteudo.ativa').id;
            if (abaAtiva === 'aba_contato') {
                if (await confirmarSaida()) {
                    carregarConteudo('contato/contato.html', document.querySelector('.principal'), false);
                }
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

    window.addEventListener('resize', (e) => {
        if (document.querySelector(".modulo") != null) {
            fecharMenu(document.querySelector(".modulo").offsetWidth, 421);
        }
    });

    let tipoPessoa = document.querySelectorAll('input[name="tipo_pessoa"]');
    tipoPessoa.forEach(radio => {
        radio.addEventListener('change', alterarCampoObrigatorioTipoPessoa);
    });

    function alterarCampoObrigatorioTipoPessoa() {
        let tipoPessoaSelecionado = document.querySelector('input[name="tipo_pessoa"]:checked').value;
        let cnpjLabel = document.getElementById('label_cnpj');
        let cpfLabel = document.getElementById('label_cpf');
        let cpf = document.getElementById('cpf');
        let cnpj = document.getElementById('cnpj');

        document.querySelector("#container_tipo_pessoa").querySelectorAll('span.campo_obrigatorio').forEach(span => span.style.display = "none");

        if (tipoPessoaSelecionado === 'JURÍDICA') {
            cpf.disabled = "disabled";
            cnpj.disabled = "";
            cpf.required = false;
            cnpj.required = true;
            cnpjLabel.querySelector('span.campo_obrigatorio').style.display = "inline";
        } else {
            cnpj.disabled = "disabled";
            cpf.disabled = "";
            cpf.required = true;
            cnpj.required = false;
            cpfLabel.querySelector('span.campo_obrigatorio').style.display = "inline";
        }
    }
    alterarCampoObrigatorioTipoPessoa();
    // Esconde o popup de carregando inicial
    popup_carregando(true);
}
