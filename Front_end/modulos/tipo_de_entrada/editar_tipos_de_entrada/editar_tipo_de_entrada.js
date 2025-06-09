import { dataAtual, aguardarRenderizacao, formatarData } from "../../../scripts/funcionalidades.js";
import { carregarConteudo } from "../../../scripts/javaScript.js";
import select2 from "../../../scripts/select.js"
import { popup, popup_aviso, popup_carregando } from "../../../scripts/popup.js";
import tipos_de_entrada from "../tipos_de_entrada.js";

export default function editar_tipo_de_entrada(dado, telaAnteriorVisualizar) {
    select2("100%")
   
    document.querySelector("#btn_voltar_tipos_de_entrada").addEventListener("click", () => {
        carregarConteudo("tipo_de_entrada/tipos_de_entrada.html", document.querySelector(".principal"),false, tipos_de_entrada)
        
    })
    document.querySelector(".data_cadastro").innerHTML = formatarData(dado.data_criacao)
    document.querySelector(".codigo_id").innerHTML = dado.id_tipo_de_entrada
    document.querySelector("#descricao_tipo_de_entrada").value = dado.descricao
    document.querySelector("#cfop_dentro").value = dado.cfop_dentro
    document.querySelector("#cfop_fora").value = dado.cfop_fora
    document.querySelector("#ativo_tipo_de_entrada").value = dado.ativo
    document.querySelector("#hab_agrupamento").checked = dado.hab_agrupamento
    document.querySelector("#movimenta_estoque").checked = dado.movimenta_estoque
    document.querySelector("#hab_movimento").checked = dado.hab_movimenta
    document.querySelector("#hab_nf").checked = dado.habilita_nf
    document.querySelector("#atualiza_produto").checked = dado.atualiza_produto
    document.querySelector("#padrao").checked = dado.padrao
}