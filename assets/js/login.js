document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        var HOST = "https://ilab-api.onrender.com"
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            HOST = "http://127.0.0.1:8000"
        }
        const response = await fetch(HOST + '/api/login/', { // Adjust URL as needed
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            alert('Login successful');
            window.location.href = 'search-page.html'; // Redirect user
        } else {
            document.getElementById('loginError').textContent = 'Invalid credentials';
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
});
