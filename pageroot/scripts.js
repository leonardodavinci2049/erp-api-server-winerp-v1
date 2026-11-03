document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();

  // Exibir mensagem de erro
  document.getElementById('error-message').style.display = 'block';

  // Limpar os campos do formulário
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';

  // Foco de volta no campo de email
  document.getElementById('email').focus();
});
