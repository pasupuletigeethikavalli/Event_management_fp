const loginForm = document.getElementById('admin-login-form');
const loginStatus = document.getElementById('admin-login-status');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('admin-id').value.trim();
  const password = document.getElementById('admin-password').value.trim();

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Login failed');
    }

    localStorage.setItem('adminToken', result.token);
    localStorage.setItem('adminName', result.name);
    window.location.href = 'admin.html';
  } catch (error) {
    loginStatus.innerText = `⚠️ ${error.message}`;
    loginStatus.style.color = 'red';
  }
});
