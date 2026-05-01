const form = document.getElementById("form");
const list = document.getElementById("list");
const success = document.getElementById("success");

async function loadRegistrations() {
    list.innerHTML = '';
    try {
        const response = await fetch('/api/students');
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        data.forEach(user => addUser(user));
    } catch (error) {
        const data = JSON.parse(localStorage.getItem('users')) || [];
        data.forEach(user => addUser(user));
    }
}

window.onload = loadRegistrations;

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const event = document.getElementById('event').value;

    if (!event) {
        success.innerText = '⚠️ Select event!';
        success.style.color = 'red';
        return;
    }

    const user = { name, email, event };

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Registration failed');
        }

        addUser(user);
        success.innerText = '✅ Registered Successfully!';
        success.style.color = 'green';

        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));

        form.reset();
    } catch (error) {
        success.innerText = `⚠️ ${error.message}`;
        success.style.color = 'red';
    }
});

function addUser(user) {
    const li = document.createElement('li');
    li.innerText = `${user.name} (${user.email}) - ${user.event}`;
    list.appendChild(li);
}
