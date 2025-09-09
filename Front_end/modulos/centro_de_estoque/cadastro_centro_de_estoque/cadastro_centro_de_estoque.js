import buscarDados from "../../../scripts/buscarDados.js";
import { dataAtual } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import { popup_aviso, popup_carregando, popup_erro } from "../../../scripts/popup.js";
import select2 from "../../../scripts/select.js";
import centro_de_estoque from "../centro_de_estoque.js";

export default async function cadastro_centro_de_estoque() {
    dataAtual() // Altera o campo data para a data atual
    select2("100%") // Aplica o select2 nos selects

    let centros = await buscarDados('id_centros_estoques');
    let centroComMaiorId = centros.reduce((prev, curr) => {
        return prev.id_centro_estoque > curr.id_centro_estoque ? prev : curr;
    })
    document.querySelector(".codigo_id").innerHTML = centroComMaiorId.id_centro_estoque + 1;

    let form = document.querySelector("form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        popup_carregando()
        let dados = Object.fromEntries(new FormData(form));
        dados.padrao_centro_estoque = dados.padrao_centro_estoque === "sim";

        await enviarFormulario(dados);

        popup_carregando(true)
    })

    document.querySelector("#btn_voltar_produtos").addEventListener("click", () => {
        carregarConteudo("centro_de_estoque/centro_de_estoque.html", document.querySelector(".principal"), true, centro_de_estoque) // Volta para a tela de centros de estoque
    })

    async function enviarFormulario(dados) {
        try {
            const response = await fetch('http://localhost:3000/centros-estoque', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            popup_aviso("Centro de estoque cadastrado com sucesso!");
            form.reset();
            carregarConteudo("centro_de_estoque/centro_de_estoque.html", document.querySelector(".principal"), true, centro_de_estoque);

        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            popup_erro(error.message || "Erro ao cadastrar centro de estoque. Tente novamente.");
        }
    }
}
