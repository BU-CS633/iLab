function searchItems() {
    const searchQuery = document.getElementById('searchInput').value;
    window.location.href = 'inventory-all.html?search=' + encodeURIComponent(searchQuery);
}

document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action of the enter key
        searchItems();
    }
});
