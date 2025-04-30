import { carregarConteudo } from "../../scripts/javaScript.js"

export default function configuracoes () {
    let btn_voltar = document.querySelector("#btn_voltar_config")
    btn_voltar.addEventListener("click",()=>{
        document.querySelector(".modulo_selecionado").classList.remove("modulo_selecionado")
        document.querySelector("#btn_dashboard").classList.add("modulo_selecionado")
        carregarConteudo("dashboard/dashboard.html",document.querySelector(".principal"))
    })
} 


document.addEventListener("DOMContentLoaded", function () {
    const botoes = document.querySelectorAll(".item_config[data-form]");
    const formularios = document.querySelectorAll(".formulario");

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            const formId = botao.dataset.form;

            // Esconde todos os formulários
            formularios.forEach(form => form.style.display = "none");

            // Remove destaque dos botões
            botoes.forEach(b => b.classList.remove("item_config_selecionado"));

            // Mostra o formulário correspondente
            const formSelecionado = document.getElementById(formId);
            if (formSelecionado) {
                formSelecionado.style.display = "block";
                botao.classList.add("item_config_selecionado");
            }
        });
    });

    // Opcional: mostrar o primeiro formulário por padrão
    if (formularios.length > 0) {
        formularios.forEach(form => form.style.display = "none");
        const primeiroFormulario = document.getElementById(botoes[0].dataset.form);
        if (primeiroFormulario) primeiroFormulario.style.display = "block";
        botoes[0].classList.add("item_config_selecionado");
    }
});