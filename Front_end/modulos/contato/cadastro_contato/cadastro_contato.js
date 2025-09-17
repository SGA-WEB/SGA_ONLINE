import { carregarConteudo, fecharMenu } from "../../../scripts/javaScript.js"
import { dataAtual, formatarData } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";
import buscarDados from "../../../scripts/buscarDados.js";
import { popup_carregando, popup_aviso, popup_erro, popup_confirmar } from "../../../scripts/popup.js";

export default async function cadastro_contato() {
    select2("100%")
    dataAtual()

    let contatos = await buscarDados('contato')
    let idProximoContato = contatos.length > 0 ? Math.max(...contatos.map(c => c.id_contato)) + 1 : 1;
    document.querySelector(".codigo_id").textContent = idProximoContato

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

    document.querySelector("#btn_voltar").addEventListener("click", async (e) => {
        let abaAtiva = document.querySelector('.aba_conteudo.ativa').id;
        if (abaAtiva === 'aba_contato') {
            let confirmar = await confirmarSaida();
            if (confirmar) {
                carregarConteudo('contato/contato.html', document.querySelector('.principal'), false)
            }
        } else {
            document.getElementById('link_contato').click();
        }
    })

    document.querySelector(".btn_proximo").addEventListener("click", (e) => {
        document.getElementById('link_endereco').click();
    })

    document.querySelector(".btn_salvar").addEventListener("click", (e) => {
        e.preventDefault()
        form.requestSubmit()
    })

    let form = document.querySelector("form")
    form.addEventListener("submit", salvarDadosNoBanco)

    async function confirmarSaida() {
        const form = document.querySelector("form");
        const dados = Object.fromEntries(new FormData(form));

        let dadosPreenchidos = 0;
        for (let chave in dados) {
            if (dados[chave] !== "" && dados[chave] !== null) {
                dadosPreenchidos++;
            }
        }

        // Se houver poucos dados preenchidos, não precisa confirmar.
        if (dadosPreenchidos <= 4) {
            return true;
        }

        // Se houver dados, AWAIT (espere) o resultado do popup.
        // A variável 'confirmado' receberá 'true' ou 'false' diretamente.
        const confirmado = await popup_confirmar(
            "Existem dados preenchidos. Tem certeza que deseja sair sem salvar?",
            "Sim"
        );

        // Agora, retorne o resultado obtido do await.
        return confirmado;
    }

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

            let btnProximo = document.querySelector('.btn_proximo');
            if (idAlvo === 'aba_endereco') {
                btnProximo.style.display = 'none';
            } else {
                btnProximo.style.display = 'block'; // ou 'inline-block', 'flex', etc.
            }
        });
    });

    async function salvarDadosNoBanco(e) {
        e.preventDefault(); // Previne o recarregamento da página

        try {
            // --- 1. COLETA E FORMATAÇÃO DOS DADOS ---
            const formData = new FormData(form);

            // O método getAll é crucial para pegar múltiplos checkboxes com o mesmo nome.
            const todasCategorias = formData.getAll('categorias').map(Number);

            // Monta o payload exatamente como o back-end espera.
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
                inativo: formData.get('inativo') === 'true', // Converte para booleano

                // Objeto aninhado para o endereço
                endereco: {
                    cep: formData.get('cep'),
                    pais: formData.get('pais') || 'Brasil',
                    estado: formData.get('estado'),
                    municipio: formData.get('municipio'),
                    endereco: formData.get('endereco'),
                    ponto_referencia: formData.get('ponto_referencia') || null,
                    setor: formData.get('setor') || null
                },

                // Array com os IDs das categorias
                categorias: todasCategorias
            };

            console.log('Dados prontos para enviar para a API:', payload);

            // --- 2. ENVIO PARA A API ---
            popup_carregando();
            const response = await fetch('http://localhost:3000/api/contatos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const resultado = await response.json();

            if (!response.ok) {
                // Joga um erro para ser capturado pelo bloco catch, usando a mensagem da API.
                throw new Error(resultado.error || `HTTP error! status: ${response.status}`);
            }

            popup_carregando(true);
            popup_aviso("Contato criado com sucesso!");
            carregarConteudo('contato/contato.html', document.querySelector('.principal'), false);
            form.reset();

            // Adicione aqui a sua lógica para voltar para a tela de listagem
            // Ex: carregarConteudo('contato/contato.html', document.querySelector('.principal'));

        } catch (error) {
            popup_carregando(true);
            popup_erro(error.message);
            console.error("Falha ao salvar contato:", error);
        }
    };
}
