import { carregarConteudo } from "../../scripts/javaScript.js";
import cadastro_tipo_entrada from "./cadastro_tipo_entrada/cadastro_tipo_entrada.js";

export default function tipos_de_entrada () {
    document.querySelector("#btn_adicionar_centro_de_estoque").addEventListener("click",() => {
        carregarConteudo("lista_cadastro_entrada/cadastro_tipo_entrada/cadastro_tipo_entrada.html", document.querySelector(".principal"), cadastro_tipo_entrada)
    })
}