import { mudarPesquisa } from "../../scripts/funcionalidades.js";
import select2 from "../../scripts/select.js";
export default function centro_de_estoque() {
    mudarPesquisa(document.querySelector(".input_pesquisa"));
    select2("120px");
}