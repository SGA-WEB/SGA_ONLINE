export default function select2 (largura = "80px") {
    /*
        Função para estilizar os selects do HTML com o plugin select2;
        Select2 é um plugin que transforma os selects padrões do HTML em selects mais bonitos e funcionais

        Parâmetros:
        - largura: String que define a largura do select2
    */

    $(document).ready(function () {
        $('.campo_select').select2({
            placeholder: 'Selecione a coluna',
            width: largura,
            minimumResultsForSearch: Infinity,
        });
    });
}