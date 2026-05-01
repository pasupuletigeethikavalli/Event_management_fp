const adminStatus = document.getElementById('admin-status');
const adminList = document.getElementById('admin-list');
const logoutButton = document.getElementById('logout-button');

function redirectToLogin() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminName');
  window.location.href = 'admin-login.html';
}

window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    redirectToLogin();
    return;
  }

  try {
    const response = await fetch('/api/students', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 401) {
      redirectToLogin();
      return;
    }

    if (!response.ok) {
      throw new Error('Unable to fetch registered students.');
    }

    const students = await response.json();
    if (!students.length) {
      adminStatus.innerText = 'No students have registered yet.';
      return;
    }

    adminStatus.innerText = `Admin: ${localStorage.getItem('adminName')}`;
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Event</th>
          <th>Registered At</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    students.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.event}</td>
        <td>${new Date(student.registeredAt).toLocaleString()}</td>
      `;
      tbody.appendChild(row);
    });

    adminList.appendChild(table);
  } catch (error) {
    adminStatus.innerText = 'Unable to load admin data. Please start the backend server and ensure MongoDB is running.';
    console.error(error);
  }
});

logoutButton.addEventListener('click', redirectToLogin);

