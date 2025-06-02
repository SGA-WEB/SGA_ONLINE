import { dataAtual } from "../../../../scripts/funcionalidades.js";
import select2 from "../../../../scripts/select.js";

export default function cadastro_entrada_produtos(dados) {
    select2("100%")
    dataAtual()

    let ultimoIdProduto
    let fornecedores = []
    dados.forEach(dado => {
        ultimoIdProduto = dado.id_entrada_produto
        fornecedores.push({
            fornecedor_id: dado.fornecedor_id,
            fornecedor_razao_social: dado.fornecedor_razao_social
        })
    });
    fornecedores = [...new Set(fornecedores.map(f => f.fornecedor_id))].map(id => {
        return fornecedores.find(f => f.fornecedor_id === id);
    });

    document.querySelector(".codigo_id").textContent = ultimoIdProduto + 1

    fornecedores.forEach(fornecedor => {
        let option = document.createElement("option");
        option.value = fornecedor.fornecedor_id;
        option.text = fornecedor.fornecedor_razao_social;
        document.querySelector("#fornecedor").appendChild(option);
    });

    let formEntradaProduto = document.querySelector("#form_entrada_produto");

    formEntradaProduto.addEventListener("submit", async (e) => {
        e.preventDefault();
        let formData = new FormData(formEntradaProduto);
        let data = Object.fromEntries(formData);

        // Converter campos numéricos corretamente
        console.log(data);
        data.fornecedor = parseInt(data.fornecedor);
        data.valor_total = parseFloat(data.valor_total);
        data.desconto = parseFloat(data.desconto || 0);
        data.total = parseFloat(data.total);

        console.log(data);
        try {
            const response = await fetch('http://localhost:3000/entrada_produto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                alert('Entrada salva com sucesso!');
                form.reset();
            } else {
                alert('Erro: ' + result.erro);
            }
        } catch (err) {
            alert('Erro ao conectar com a API.');
            console.error(err);
        }
    })
}
