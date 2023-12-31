

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.add-item-form');

    // Handle form submission
    form.addEventListener('submit', function (e) {
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

        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            return; // Optionally, redirect to login page or show a message
        }
        var HOST = "http://127.0.0.1:8000"
        if (location.hostname === "ilab-cs633.onrender.com") {
            HOST = "https://ilab-api.onrender.com"
        }
        // Example: Send a POST request to your server endpoint
        fetch(HOST + '/api/items/', {
            method: 'POST',
            body: JSON.stringify(formData), // Convert formData to JSON
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
                'Authorization': 'Token ' + token // Include the token
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                form.reset(); // Optional: Reset the form after successful submission
                fetch(HOST + '/api/requests/', {
                    method: 'POST',
                    body: JSON.stringify({
                        "owner": 1,
                        "item": data.id,
                        "request_date": "2023-12-08",
                        "status": "pending",
                        "quantity_requested": formData.qty,
                        "total_price": formData.qty * formData.price,
                        "request_notes": formData.notes,
                    }), // Convert formData to JSON
                    headers: {
                        'Content-Type': 'application/json', // Set the content type to JSON
                        'Authorization': 'Token ' + token // Include the token
                    },
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);
                        form.reset(); // Optional: Reset the form after successful submission



                        window.location.href = 'request-all.html'; // Redirect user

                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Error creating item: ' + error); // Alert for error
                    });



            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error creating item: ' + error); // Alert for error
            });
    });

    // Clear form
    const clearButton = document.querySelector('.btn-secondary');
    clearButton.addEventListener('click', function () {
        form.reset();
    });
});
