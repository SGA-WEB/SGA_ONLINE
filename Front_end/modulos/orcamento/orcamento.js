import { mudarPesquisa } from "../../scripts/funcionalidades.js";
import buscarDados from "../../scripts/buscarDados.js";
import select2 from "../../scripts/select.js";
import { carregarConteudo, fecharMenu } from "../../scripts/javaScript.js";
import { dataAtual } from "../../scripts/funcionalidades.js";
import { carregarDadosNaTabela, pesquisar } from "../../scripts/carregarDadosNaTabela.js";
import carregarDadosNosCards from "../../scripts/carregarDadosNosCards.js";
import cadastro_orcamento from "../orcamento/cadastro_orcamento/cadastro_orcamento.js";

export default async function orcamento() {
    mudarPesquisa(document.querySelector(".input_pesquisa"));
    select2("120px");
    let dados = await buscarDados('orcamento'); // Busca os dados da tabela, exibe na tela e permite pesquisar
    let colunas = ["id_orcamento", "cliente_razao_social", "status", "criado_por_nome", "data_criacao", "subtotal", "desconto_total", "valor_total"]
    carregarDadosNaTabela(dados, colunas, document.querySelector(".tabela"), true, true) // Exibe na tela e permite pesquisar
    pesquisar(dados, colunas, document.querySelector(".tabela"), true, true)

    let btnAdicionar = document.querySelector("#btn_criar_orcamento");
    btnAdicionar.addEventListener("click", () => {
        carregarConteudo("orcamento/cadastro_orcamento/cadastro_orcamento.html", document.querySelector(".principal"), false, cadastro_orcamento, dados)
    })

    let btn_change_view_mode = document.querySelector(".btn_change_view_mode");
    btn_change_view_mode.addEventListener("click", () => {
        if (btn_change_view_mode.classList.contains("table_mode")) {
            const colunasBancoDeDados = ["id_orcamento", "cliente_razao_social", "status", "criado_por_nome", "data_criacao", "subtotal", "desconto_total", "valor_total"]
            const colunasExibir = ["Código", "Cliente", "Status", "Criado por", "Criado em", "Subtotal", "Desconto", "Total"]
            carregarDadosNosCards(dados, colunasBancoDeDados, colunasExibir)
            pesquisar(dados, colunasExibir, null, true, colunasBancoDeDados)
            btn_change_view_mode.classList.remove("table_mode")
            btn_change_view_mode.classList.add("card_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo tabela"
        } else {
            document.querySelector('.container_tabela').innerHTML = `
                <table class="tabela" id="tabela_produtos">
                    <thead>
                        <tr>
                            <th class="th_selecionar_todos">
                                <input type="checkbox" name="selecionar_todos" id="selecionar_todos">
                            </th>
                            <th id="codigo">Código</th>
                            <th id="cliente">Cliente</th>
                            <th id="status">Status</th>
                            <th id="criado_por">Criado por:</th>
                            <th id="criado_em">Criado em:</th>
                            <th id="subtotal">Subtotal:</th>
                            <th id="desconto">Desconto:</th>
                            <th id="total">Total</th>
                        </tr>
                    </thead>
                    <tbody class="tbody">
                    </tbody>
                </table>
            `
            carregarDadosNaTabela(dados, colunas, document.querySelector(".tabela"), true, true)
            pesquisar(dados, colunas, document.querySelector(".tabela"), true, true)
            btn_change_view_mode.classList.remove("card_mode")
            btn_change_view_mode.classList.add("table_mode")
            btn_change_view_mode.querySelector("span").textContent = "Exibir modo card"
        }
    })

    let widthModulo = document.querySelector(".modulo").offsetWidth;

    window.addEventListener("resize", () => {
        if (document.querySelector(".tabela")) {
            fecharMenu(document.querySelector(".tabela").offsetWidth, 510)
        }

        widthModulo = document.querySelector(".modulo").offsetWidth

        if (widthModulo <= 510 && !btn_change_view_mode.classList.contains("card_mode")) {
            btn_change_view_mode.click()
        }
    })

    if (widthModulo <= 510) {
        btn_change_view_mode.click()
    }

    const btnExportar = document.querySelector("#btn_exportar_orcamento");
    const dropdownMenu = document.querySelector("#dropdown_menu_exportar");

    btnExportar.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle("aberto");
    });

    document.addEventListener("click", () => {
        dropdownMenu.classList.remove("aberto");
    });

    document.querySelector("#btn_exportar_pdf").addEventListener("click", () => {
        dropdownMenu.classList.remove("aberto");
        exportarPDF();
    });

    document.querySelector("#btn_exportar_xlsx").addEventListener("click", () => {
        dropdownMenu.classList.remove("aberto");
        exportarExcel();
    });

    const _cabecalho = ["Código", "Cliente", "Status", "Criado por", "Criado em", "Subtotal", "Desconto", "Total"];
    const _campos    = ["id_orcamento", "cliente_razao_social", "status", "criado_por_nome", "data_criacao", "subtotal", "desconto_total", "valor_total"];
    const _moeda     = ["subtotal", "desconto_total", "valor_total"];
    const _pad = n => String(n).padStart(2, "0");

    function _fmtData(v) {
        if (!v) return "";
        const d = new Date(v);
        if (isNaN(d)) return v;
        return `${d.getFullYear()}/${_pad(d.getMonth()+1)}/${_pad(d.getDate())} - ${_pad(d.getHours())}:${_pad(d.getMinutes())}:${_pad(d.getSeconds())}`;
    }

    function _fmtMoeda(v) {
        return v != null ? `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "";
    }

    function _getDadosVisiveis() {
        const trs = document.querySelectorAll("#tabela_produtos .table_tr");
        if (trs.length > 0) {
            const ids = [...trs].map(tr => parseInt(tr.id.replace("tr_", ""))).filter(n => !isNaN(n));
            return dados.filter(d => ids.includes(d.id_orcamento));
        }
        const cardIds = [...document.querySelectorAll(".card .card_id")]
            .map(el => parseInt(el.textContent.replace("Código:", "").trim()))
            .filter(n => !isNaN(n));
        return cardIds.length ? dados.filter(d => cardIds.includes(d.id_orcamento)) : dados;
    }

    function _mapearLinha(item) {
        return _campos.map(c => {
            if (c === "data_criacao") return _fmtData(item[c]);
            if (_moeda.includes(c))   return _fmtMoeda(item[c]);
            return item[c] ?? "";
        });
    }

    function exportarExcel() {
        const linhas = [_cabecalho, ..._getDadosVisiveis().map(_mapearLinha)];
        const planilha = XLSX.utils.aoa_to_sheet(linhas);

        planilha['!cols'] = _cabecalho.map((_, i) => ({
            wch: Math.max(...linhas.map(row => row[i] ? row[i].toString().length + 4 : 10))
        }));

        const COR_HEADER  = "2980B9";
        const COR_ZEBRA   = "EBF5FB";
        const COLS_DIREITA = [5, 6, 7];

        linhas.forEach((row, r) => {
            row.forEach((_, c) => {
                const ref = XLSX.utils.encode_cell({ r, c });
                if (!planilha[ref]) return;
                const isHeader = r === 0;
                const isZebra  = !isHeader && r % 2 === 0;
                planilha[ref].s = {
                    fill: { patternType: "solid", fgColor: { rgb: isHeader ? COR_HEADER : (isZebra ? COR_ZEBRA : "FFFFFF") } },
                    font: isHeader ? { bold: true, color: { rgb: "FFFFFF" }, sz: 10 } : { sz: 9 },
                    alignment: { horizontal: COLS_DIREITA.includes(c) ? "right" : "left", vertical: "center" },
                    border: { bottom: { style: "thin", color: { rgb: "DDDDDD" } }, right: { style: "thin", color: { rgb: "DDDDDD" } } }
                };
            });
        });

        const livro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(livro, planilha, "Orçamentos");
        XLSX.writeFile(livro, "Orcamentos_Exportados.xlsx");
    }

    function exportarPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

        doc.autoTable({
            head: [_cabecalho],
            body: _getDadosVisiveis().map(_mapearLinha),
            theme: "striped",
            headStyles: { fillColor: [41, 128, 185] },
            styles: { fontSize: 9, cellPadding: 3, halign: "left" },
            columnStyles: { 5: { halign: "right" }, 6: { halign: "right" }, 7: { halign: "right" } }
        });

        doc.save("Orcamentos_Exportados.pdf");
    }
}
