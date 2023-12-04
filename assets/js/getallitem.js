async function getAllItems(searchQuery = '') {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/items/");
        const data = await response.json();

        let filteredData = data.results;

        if (searchQuery) {
            filteredData = filteredData.filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.vendor && item.vendor.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.catalog && item.catalog.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

            // Destroy the existing DataTable and recreate it with new data
            if ($.fn.DataTable.isDataTable('#inventory-all')) {
                $('#inventory-all').DataTable().clear().destroy();
            }


            const dataSet = filteredData.map(item => [
                item.name,
                item.fullName,
                item.unitSize ?? 'N/A', // 'N/A' for null values
                item.qty,
                item.price ?? 'N/A',
                item.vendor ?? 'N/A',
                item.catalog ?? 'N/A',
                item.lastOrderDate ?? 'N/A',
                item.lastReceivedDate ?? 'N/A',
                item.channel ?? 'N/A',
                item.location ?? 'N/A',
                item.link ?? 'N/A',
                item.notes ?? 'N/A'
            ]);

            $('#inventory-all').DataTable({
                data: dataSet,
                columns: [
                    { title: 'Name' },
                    { title: 'Full Name' },
                    { title: 'Unit Size' },
                    { title: 'Quantity' },
                    { title: 'Price' },
                    { title: 'Vendor' },
                    { title: 'Catalog' },
                    { title: 'Last Order Date' },
                    { title: 'Last Received Date' },
                    { title: 'Channel' },
                    { title: 'Location' },
                    { title: 'Link' },
                    { title: 'Notes' }
                ]
            });
        } catch (error) {
        console.error('Error fetching items:', error);
    }
}

function searchItems() {
    const searchQuery = document.getElementById('searchInput').value;
    window.location.href = 'inventory-all.html?search=' + encodeURIComponent(searchQuery);
}

// Function to get the search query from the URL
function getSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('search');
}

async function loadItems() {
    const searchQuery = getSearchQuery();
    if (searchQuery) {
        // Fetch and display data based on the search query
        // Call your API with the search query as a parameter
        getAllItems(searchQuery);
    } else {
        // Fetch and display all data if no search query is provided
        getAllItems();
    }
}

// Call loadItems when the page loads
document.addEventListener('DOMContentLoaded', loadItems);


