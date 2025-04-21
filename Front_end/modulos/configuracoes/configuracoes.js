import { carregarConteudo } from "../../scripts/javaScript.js"

export default function configuracoes () {
    let btn_voltar = document.querySelector("#btn_voltar_config")
    btn_voltar.addEventListener("click",()=>{
        document.querySelector(".modulo_selecionado").classList.remove("modulo_selecionado")
        document.querySelector("#btn_dashboard").classList.add("modulo_selecionado")
        carregarConteudo("dashboard/dashboard.html",document.querySelector(".principal"))
    })
}

  document.querySelectorAll('.item_config').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Remove classe de seleção do menu
      document.querySelectorAll('.item_config').forEach(el => el.classList.remove('item_config_selecionado'));
      this.classList.add('item_config_selecionado');

      // Esconde todos os mains
      document.querySelectorAll('.main_config').forEach(main => {
        main.style.display = 'none';
      });

      // Mostra o main correspondente ao data-target
      const alvo = this.getAttribute('data-target');
      const mainMostrar = document.getElementById(alvo);
      if (mainMostrar) {
        mainMostrar.style.display = 'block';
      }
    });
  });
