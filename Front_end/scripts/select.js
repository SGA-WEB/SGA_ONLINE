export default function select2 (largura = "80px") {
    $(document).ready(function () {
        $('.campo_select').select2({
            placeholder: 'Selecione a coluna',
            width: largura,
            minimumResultsForSearch: Infinity,
        });
    });
}