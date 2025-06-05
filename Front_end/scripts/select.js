export default function select2 (largura = "80px") {
    /*
        Função para estilizar os selects do HTML com o plugin select2;
        Select2 é um plugin que transforma os selects padrões do HTML em selects mais bonitos e funcionais

        Parâmetros:
        - largura: String que define a largura do select2
    */

    $(document).ready(function () {
        document.querySelectorAll('.campo_select').forEach(el => {
            if (!$(el).hasClass('select2-hidden-accessible')) {
                console.log("Select2 aplicado ao elemento:", el);
                $(el).select2({
                    placeholder: 'Selecione a coluna',
                    width: largura,
                    minimumResultsForSearch: 5,
                });
            }
        });
    });
}
