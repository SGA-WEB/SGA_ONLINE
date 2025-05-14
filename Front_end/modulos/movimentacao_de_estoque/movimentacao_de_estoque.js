document.addEventListener("DOMContentLoaded", () => {
    const btnAdicionar = document.querySelector("#btn_adicionar");

    btnAdicionar.addEventListener("click", async () => {
        await carregarConteudo("centro_de_estoque/cadastro_centro_de_estoque/cadastro_centro_de_estoque.html", document.querySelector(".modulo"));

        const observer = new MutationObserver(() => {
            if (document.querySelector(".modulo")) {
                dataAtual(); // Atualiza data no input
                select2("100%"); // Configura select2

                document.querySelector("#btn_voltar_produtos").addEventListener("click", async () => {
                    await carregarConteudo("centro_de_estoque/centro_de_estoque.html", document.querySelector(".modulo"));
                });

                document.querySelector(".btn_salvar").addEventListener("click", async () => {
                    alert("Centro de estoque salvo com sucesso!");
                    await carregarConteudo("centro_de_estoque/centro_de_estoque.html", document.querySelector(".modulo"));
                });

                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });

    // Pesquisa na tabela de saída
    document.querySelector("#btn_pesquisar_produto").addEventListener("click", () => {
        const termoPesquisa = document.querySelector("#input_pesquisa_tabela").value.toLowerCase();
        const linhas = document.querySelectorAll("#tabela_produtos tbody tr");

        linhas.forEach(linha => {
            linha.style.display = linha.innerText.toLowerCase().includes(termoPesquisa) ? "" : "none";
        });
    });

    // Limpar pesquisa
    document.querySelector("#btn_limpar_pesquisa_produto").addEventListener("click", () => {
        document.querySelector("#input_pesquisa_tabela").value = "";
        document.querySelectorAll("#tabela_produtos tbody tr").forEach(linha => linha.style.display = "");
    });

    // Função de exclusão no popup
    document.querySelector("#btn_popup_excluir_excluir").addEventListener("click", () => {
        alert("Produto excluído com sucesso!");
        document.querySelector("#container_popup_excluir_produto").classList.add("hide");
    });

    document.querySelector("#btn_popup_excluir_cancelar").addEventListener("click", () => {
        document.querySelector("#container_popup_excluir_produto").classList.add("hide");
    });

    // Fechar menu ao redimensionar
    window.addEventListener("resize", () => {
        fecharMenu(document.querySelector(".tabela").offsetWidth, 510);
    });
});
