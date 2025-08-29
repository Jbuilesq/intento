import { navigate } from "../index.js";

// Función para manejar el login
export async function login() {
  const message = document.getElementById('message');
  const loginForm = document.getElementById('login-form-id');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('user').value.trim(); // El documento (username)
    const API_URL = 'https://lifelens-db.vercel.app/document';

    if (!username) {
      message.textContent = 'Por favor ingresa tu documento.';
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${username}`);

      if (!response.ok) {
        message.textContent = 'Usuario no encontrado.';
        return;
      }

      const userData = await response.json();

      // Guardar toda la información del usuario en localStorage (como string)
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirigir a la siguiente página
      navigate('/stroop');

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      message.textContent = 'Error al iniciar. Inténtalo de nuevo.';
    }
  });
}

