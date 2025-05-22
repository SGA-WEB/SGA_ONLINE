import buscarDados from "../../../scripts/buscarDados.js";
import { carregarDadosNaTabela, pesquisar } from "../../../scripts/carregarDadosNaTabela.js";
import { mudarPesquisa } from "../../../scripts/funcionalidades.js";
import select2 from "../../../scripts/select.js";

export default async function entrada_de_produtos() {
    select2("10rem")
    mudarPesquisa(document.querySelector("#input_pesquisa_tabela"))

    let dados = await buscarDados("entrada_produto")
    let colunasExibir = ["id_entrada_produto", "tipo_entrada", "numero_nf", "data_recebimento", "fornecedor_id", "valor_total", "desconto", "total", "status" ]
    console.log(dados)
    
    carregarDadosNaTabela(dados, colunasExibir)
    pesquisar(dados, colunasExibir)
}
