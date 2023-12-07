document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = checkLoginStatus();
    const navbarHtml = createNavbarHtml(isLoggedIn);

    document.body.insertAdjacentHTML('afterbegin', navbarHtml);
    attachLogoutEvent(); // Attach event listener for logout if the user is logged in
});

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    return !!token; // Convert to boolean: true if token exists, false otherwise
}

function createNavbarHtml(isLoggedIn) {
    return `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="search-page.html">iLab</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    ${
                        isLoggedIn 
                        ? `
                            <li class="nav-item">
                                <a class="nav-link" href="add-item.html">Add Item</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="inventory-all.html">All Item</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="request-all.html">All Request</a>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src="assets/images/profile/user-1.jpg" alt="" width="35" height="35" class="rounded-circle">
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item" href="javascript:void(0)">My Request</a></li>
                                    <li><a class="dropdown-item" href="javascript:void(0)">My Account</a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item" href="javascript:void(0)" id="logoutLink">Logout</a></li>
                                </ul>
                            </li>`
                        : `
                            <li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>`
                    }
                </ul>
            </div>
        </div>
    </nav>`;
}

function attachLogoutEvent() {
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            logout();
        });
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html'; // Redirect to login page after logout
}
