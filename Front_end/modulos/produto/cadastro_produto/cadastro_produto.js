import select2 from "../../../scripts/select.js";
import { dataAtual, alterarOptionsSelect } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import buscarDados from "../../../scripts/buscarDados.js";
import { popup, popup_aviso, popup_carregando, popup_erro } from "../../../scripts/popup.js";
import produto from "../produto.js";

export default async function cadastro_produto() {
    dataAtual(); 
    select2("100%");

    let centros_de_estoque = await buscarDados("centro_estoque");
    alterarOptionsSelect(
        document.querySelector("#id_centro_estoque"),
        centros_de_estoque,
        3
    );

<<<<<<< HEAD
  let dadosRecebidos = await buscarDados('proximo_id_produto');
console.log("O que o banco devolveu:", dadosRecebidos);

const spanCodigo = document.querySelector(".codigo_id");

if (dadosRecebidos) {
    // Isso vai mostrar todas as chaves disponíveis no objeto
    console.log("Chaves disponíveis:", Object.keys(Array.isArray(dadosRecebidos) ? dadosRecebidos[0] : dadosRecebidos));
}
=======
    const resProximoId = await fetch('http://localhost:3000/api/proximo_id_produto');
    const proximo_id_produto = await resProximoId.json();
    const spanCodigo = document.querySelector(".codigo_id");
    spanCodigo.innerHTML = proximo_id_produto.proximo_id;
>>>>>>> origin/Teste

    document.querySelector("#btn_voltar_produtos").addEventListener("click", () => {
        carregarConteudo("produto/produto.html", document.querySelector(".principal"), false, produto);
    });

    let form = document.querySelector("#form_cadastro_produto");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        popup_carregando();

        // Captura os dados do formulário
        let formData = new FormData(form);
        let dados = Object.fromEntries(formData);

        // --- CORREÇÕES CRÍTICAS ---
        
        // 1. Incluir campos que não são inputs (ID e Data)
        dados.id_produto = spanCodigo.textContent;
        dados.data_cadastro = document.querySelector(".data_cadastro").textContent;

        // 2. Função para converter string "1.200,50" ou "10,50" em número decimal puro
        const formatarNumero = (valor) => {
            if (!valor) return 0;
            return Number(valor.toString().replace(/\./g, '').replace(',', '.'));
        };

        dados.preco_varejo = formatarNumero(dados.preco_varejo);
        dados.preco_atacado = formatarNumero(dados.preco_atacado);
        dados.quantidade = formatarNumero(dados.quantidade);
        dados.id_centro_estoque = parseInt(dados.id_centro_estoque);

        // Validação básica antes de enviar
        if (isNaN(dados.preco_varejo) || isNaN(dados.quantidade)) {
            popup_carregando(true);
            popup_erro("Verifique os valores numéricos informados.");
            return;
        }

        let sucesso = await enviarFormulario(dados);

        if (sucesso) {
            popup_aviso("Produto cadastrado com sucesso!");
            form.reset();
            carregarConteudo("produto/produto.html", document.querySelector(".principal"), false, produto);
        } else {
            popup_erro("Erro ao cadastrar produto no servidor.");
        }
        popup_carregando(true);
    });

    async function enviarFormulario(dados) {
        try {
            console.log(dados)
            const response = await fetch('http://localhost:3000/produtos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro na resposta do servidor");
            }

            return true;
        } catch (error) {
            console.error('Erro no Fetch:', error);
            return false;
        }
    }
}