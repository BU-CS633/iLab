document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.add-item-form');

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Gather form data
        const formData = {
            name: form.querySelector('#itemName').value,
            fullName: form.querySelector('#itemFullName').value,
            unitSize: form.querySelector('#unitSize').value,
            qty: form.querySelector('#quantity').value,
            price: form.querySelector('#price').value || null,
            vendor: form.querySelector('#vendor').value,
            catalog: form.querySelector('#catalog').value,
            lastOrderDate: form.querySelector('#lastOrderDate').value || null,
            lastReceivedDate: form.querySelector('#lastReceivedDate').value || null,
            channel: form.querySelector('#channel').value,
            location: form.querySelector('#location').value,
            link: form.querySelector('#link').value,
            notes: form.querySelector('#notes').value,
        };
        console.log(formData)

        // Example: Send a POST request to your server endpoint
        fetch('http://127.0.0.1:8000/api/items/', {
            method: 'POST',
            body: JSON.stringify(formData), // Convert formData to JSON
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    });

    // Clear form
    const clearButton = document.querySelector('.btn-secondary');
    clearButton.addEventListener('click', function() {
        form.reset();
    });
});
