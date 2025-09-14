import { carregarConteudo } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js";

export default function cadastro_tipo_entrada() {
    select2()
    document.querySelector("#btn_voltar_tipos_de_entrada").addEventListener("click", () => { 
        carregarConteudo("tipo_de_entrada/tipos_de_entrada.html", document.querySelector(".principal"), false, null, null);
        // Botão que volta para a tela de tipos de entrada
    })

    let btn_salvar = document.querySelector("form")
    btn_salvar.addEventListener("submit", async (e) => {
        e.preventDefault()
        popup_carregando(false, "Salvando tipo de entrada...");
        const data = {
            id_tipo_de_entrada: parseInt(document.getElementById('codigo').value),
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
        console.log(data)
        try {
            const response = await fetch('http://localhost:3000/tipos_entrada', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Cadastro feito com sucesso!');
            } else {
                const erro = await response.json();
                alert('Erro ao cadastrar: ' + erro.message);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao conectar com o servidor.');
        }
    })
}
