import select2 from "../../../scripts/select.js";
import { dataAtual, alterarOptionsSelect } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import buscarDados from "../../../scripts/buscarDados.js";
import { popup, popup_aviso, popup_carregando, popup_erro } from "../../../scripts/popup.js";
import produto from "../produto.js";

function formatarMoeda(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length > 13) valor = valor.slice(0, 13);
    const numero = (parseInt(valor || '0', 10) / 100).toFixed(2);
    input.value = numero
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

window.formatarMoeda = formatarMoeda;

export default async function cadastro_produto() {
    dataAtual();
    select2("100%");

    let centros_de_estoque = await buscarDados("centro_estoque");
    alterarOptionsSelect(
        document.querySelector("#id_centro_estoque"),
        centros_de_estoque,
        3
    );

    let proximo_id_produto = await buscarDados('proximo_id_produto');
    document.querySelector(".codigo_id").innerHTML = proximo_id_produto.proximo_id;

    document.querySelector("#btn_voltar_produtos").addEventListener("click", () => {
        carregarConteudo("produto/produto.html", document.querySelector(".principal"));
    });

    const spanCodigo = document.querySelector(".codigo_id");

    let form = document.querySelector("form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        popup_carregando();

        let formData = new FormData(form);
        let dados = Object.fromEntries(formData);

        dados.id_produto = spanCodigo.textContent;
        dados.data_cadastro = document.querySelector(".data_cadastro").textContent;

        const formatarNumero = (valor) => {
            if (!valor) return 0;
            return Number(valor.toString().replace(/\./g, '').replace(',', '.'));
        };

        dados.preco_varejo = formatarNumero(dados.preco_varejo);
        dados.preco_atacado = formatarNumero(dados.preco_atacado);
        dados.quantidade = formatarNumero(dados.quantidade);
        dados.id_centro_estoque = parseInt(dados.id_centro_estoque);

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
        dados.preco_varejo = +dados.preco_varejo;
        dados.preco_atacado = +dados.preco_atacado;
        dados.quantidade = +dados.quantidade;
        dados.id_centro_estoque = +dados.id_centro_estoque;

        try {
            console.log(dados);
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