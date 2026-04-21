import { carregarConteudo } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js";
import { popup_aviso, popup_carregando } from "../../../scripts/popup.js";
import tipos_de_entrada from "../tipos_de_entrada.js";
import { popup_erro } from "../../../scripts/popup.js";
import { dataAtual } from "../../../scripts/funcionalidades.js";

export default function cadastro_tipo_entrada(tipos_entradas) {
    select2("100%")
    dataAtual()

    let ultimoIdProduto
    tipos_entradas.forEach(entrada => {
        ultimoIdProduto = entrada.id_tipo_de_entrada
    })
    document.querySelector(".codigo_id").textContent = ultimoIdProduto + 1

    document.querySelector("#btn_voltar_tipos_de_entrada").addEventListener("click", () => {
        carregarConteudo("tipo_de_entrada/tipos_de_entrada.html", document.querySelector(".principal"), false, tipos_de_entrada);
    })

    let btn_salvar = document.querySelector("form")
    btn_salvar.addEventListener("submit", async (e) => {
        e.preventDefault()

        // Validação das checkboxes
        const checkboxes = document.querySelectorAll('.checkbox_opcao');
        const algumaMarcada = Array.from(checkboxes).some(cb => cb.checked);

        if (!algumaMarcada) {
            const primeiraCheckbox = checkboxes[0];
            primeiraCheckbox.setCustomValidity('Marque ao menos uma opção.');
            primeiraCheckbox.reportValidity();
            return;
        }

        // Limpa a validação caso esteja marcada
        checkboxes.forEach(cb => cb.setCustomValidity(''));

        popup_carregando(false, "Salvando tipo de entrada...");
        const data = {
            id_tipo_de_entrada: ultimoIdProduto + 1,
            descricao: document.getElementById('descricao').value,
            cfop_dentro: document.getElementById('cfop_dentro').value,
            cfop_fora: document.getElementById('cfop_fora').value,
            ativo: document.getElementById('ativo').value === "true",
            movimenta_estoque: document.getElementById('movimenta_estoque').checked,
            hab_agrupamento: document.getElementById('hab_agrupamento').checked,
            hab_movimento: document.getElementById('hab_movimento').checked,
            habilita_nf: document.getElementById('hab_nf').checked,
            atualiza_produto: document.getElementById('atualiza_produto').checked,
            padrao: document.getElementById('padrao').checked
        };
        try {
            const response = await fetch('http://localhost:3000/tipos_entrada', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            popup_carregando(true)
            if (response.ok) {
                popup_aviso('Cadastro feito com sucesso!');
                carregarConteudo("tipo_de_entrada/tipos_de_entrada.html", document.querySelector(".principal"), false, tipos_de_entrada)
            } else {
                const erro = await response.json();
                popup_erro('Erro ao cadastrar: ' + erro.message);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            popup_erro('Erro ao conectar com o servidor.');
        }
    })
}