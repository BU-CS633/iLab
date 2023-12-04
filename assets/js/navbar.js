document.addEventListener('DOMContentLoaded', () => {
    // Example condition: Change this based on how you check the user's login status
    const isLoggedIn = false; // Set this to true if the user is logged in

    const navbarHtml = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">iLab</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/add-item">Add Item</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/all-item">All Item</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/all-request">All Request</a>
                    </li>
                    ${
                        isLoggedIn 
                        ? `
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src="assets/images/profile/user-1.jpg" alt="" width="35" height="35" class="rounded-circle">
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item" href="javascript:void(0)">My Request</a></li>
                                    <li><a class="dropdown-item" href="javascript:void(0)">My Account</a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item" href="./authentication-login.html">Logout</a></li>
                                </ul>
                            </li>`
                        : `<li class="nav-item"><a class="nav-link" href="/login">Login</a></li>`
                    }
                </ul>
            </div>
        </div>
    </nav>`;

    document.body.insertAdjacentHTML('afterbegin', navbarHtml);
});
