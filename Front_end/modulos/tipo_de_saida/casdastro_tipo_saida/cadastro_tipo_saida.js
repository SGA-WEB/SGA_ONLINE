/* import { carregarConteudo } from "../../../../assets/js/carregar_conteudo.js";
import select2 from "../../../../assets/js/select.js";
import { popup_aviso, popup_carregando } from "../../../../assets/js/popup.js";
import tipos_de_saida from "../tipos_de_saida.js";
import { popup_erro } from "../../../../assets/js/popup.js";
import { dataAtual } from "../../../../assets/js/funcionalidades.js"; */

export default function cadastro_tipo_saida() {
   select2("100%")
    dataAtual()

    let ultimoIdProduto
    tipos_entradas.forEach(entrada => {
        ultimoIdProduto = entrada.id_tipo_de_entrada
    }) 
    document.querySelector(".codigo_id").textContent = ultimoIdProduto + 1

    
    document.querySelector("btn_voltar_tipos_de_saida").addEventListener("click",() => {
        carregarConteudo("tipo_de_saida/tipos_de_saida.html", document.querySelector(".principal"), false, tipos_de_saida);
        // Botão que volta para a tela de tipos de saída
    })
    let btn_salvar = document.querySelector("form")
    btn_salvar.addEventListener("submit", async (e) => {
        e.preventDefault()
        popup_carregando(false, "Salvando tipo de saída...");
        const data = {
            id_tipo_de_saida: ultimoIdProduto + 1,
            descricao: document.getElementById('descricao').value,
            cfop_dentro: document.getElementById('cfop_dentro').value,
            cfop_fora: document.getElementById('cfop_fora').value,
            ativo: document.getElementById('ativo').value === "true",
            devolução_compra: document.getElementById('devolução_compra').checked,
            remessa_conserto: document.getElementById('remessa_conserto').checked,
            trans_filiais: document.getElementById('trans_filiais').checked,
            baixa_perda_quebra: document.getElementById('baixa_perda_quebra').checked,
            saida_uso_consumo: document.getElementById('saida_uso_consumo').checked
        };
        try {
            const response = await fetch('http://localhost:3000/tipos_saida', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            popup_carregando(true)
            if (response.ok) {
                popup_aviso('Cadastro feito com sucesso!');
                carregarConteudo("tipo_de_saida/tipos_de_saida.html", document.querySelector(".principal"), false, tipos_de_saida)
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

