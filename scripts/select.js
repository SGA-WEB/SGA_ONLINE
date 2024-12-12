export default function select2 () {
    $(document).ready(function () {
        $('.campo_select').select2({
            placeholder: 'Selecione a coluna',
            width: '140px',
            minimumResultsForSearch: Infinity,
        });
    });
}