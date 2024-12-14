export default function select2 (largura) {
    let selectLargura = "style"
    if (largura) {
        selectLargura = largura
    }
    $(document).ready(function () {
        $('.campo_select').select2({
            placeholder: 'Selecione a coluna',
            width: selectLargura,
            minimumResultsForSearch: Infinity,
        });
    });
}