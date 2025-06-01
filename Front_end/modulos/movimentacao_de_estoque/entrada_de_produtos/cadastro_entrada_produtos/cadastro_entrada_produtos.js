import { dataAtual } from "../../../../scripts/funcionalidades.js";
import select2 from "../../../../scripts/select.js";

export default function cadastro_entrada_produtos (dados) {
    select2("10rem")
    dataAtual()

    let ultimoIdProduto
    dados.forEach(dado => {
        ultimoIdProduto = dado.id_entrada_produto
    });

    document.querySelector(".codigo_id").textContent = ultimoIdProduto + 1

}
