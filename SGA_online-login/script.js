document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.login-form');
  const usuario = document.getElementById('usuario');
  const senha = document.getElementById('senha');
  const empresa = document.getElementById('selecione-a-empresa');

  form.addEventListener('submit', function(event) {
      let valid = true;

      // Limpar todos os erros antes de iniciar a validação
      clearAllErrors();

      // Verificar campo de usuário (assumindo que é um e-mail)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (usuario.value.trim() === '') {
          alert('Usuário não pode estar vazio');
          valid = false;
      } else if (!emailRegex.test(usuario.value)) {
          alert('Formato de e-mail inválido');
          valid = false;
      }

      // Verificar campo de senha
      if (senha.value.trim() === '') {
          alert('Senha não pode estar vazia');
          valid = false;
      } else if (senha.value.length < 8) {
          alert('Senha deve ter no mínimo 8 caracteres');
          valid = false;
      }

      // Verificar seleção de empresa
      if (empresa.value === 'default') {
          alert('Selecione uma empresa');
          valid = false;
      }

      // Impedir o envio do formulário se houver erros
      if (!valid) {
          event.preventDefault();
      }
  });

  // Função para limpar todos os erros (não necessária se você usar apenas alert)
  function clearAllErrors() {
      // Não é mais necessário se os erros forem exibidos via alert
  }
});
