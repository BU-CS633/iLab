async function getAllRequest() {
    const token = localStorage.getItem('token');
    const authHeader = token ? { 'Authorization': 'Token ' + token } : {};

    var dataSet = [];
    var itemNames = new Set();
    let itemNameToID = {};

    async function fetchAllData(initialUrl) {
        const token = localStorage.getItem('token');
        const authHeader = token ? { 'Authorization': 'Token ' + token } : {};

        let dataAccumulator = [];
        let url = initialUrl;

        while (url) {
            const settings = {
                "url": url,
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                    ...authHeader
                },
            };

            try {
                let response = await $.ajax(settings);
                dataAccumulator = dataAccumulator.concat(response.results);
                url = response.next; // Update URL for the next page
            } catch (error) {
                console.error("Error fetching data: ", error);
                throw error; // Propagate the error
            }
        }

        return dataAccumulator;
    }

    try {
        var HOST = "http://127.0.0.1:8000"
        if (location.hostname === "ilab-cs633.onrender.com") {
            HOST = "https://ilab-api.onrender.com"
        }
        let requestsData = await fetchAllData(HOST + "/api/requests/");
        let itemsData = await fetchAllData(HOST + "/api/items/");

        // Creating a lookup for items
        let itemLookup = {};
        itemsData.forEach(item => {
            itemLookup[item.id] = item; // Replace 'id' with your actual item identifier
        });

        requestsData.forEach(request => {
            let item = itemLookup[request.item]; // Replace 'itemId' with your actual property name in request that refers to the item ID
            if (item) {
                let url = item.link ? (item.link.startsWith('http://') || item.link.startsWith('https://') ? item.link : 'http://' + item.link) : 'No link';
                url = url !== 'No link' ? '<a href="' + url + '" target="_blank">link</a>' : 'No link';

                let itemName = request.item_name || 'Unknown';
                let itemId = request.item;
                itemNameToID[itemName] = itemId; // Replace 'itemId' with the actual property name
                itemNames.add(itemName);

                let vendor = item.vendor || 'Unknown';
                let catalog = item.catalog || 'Unknown';
                let channel = item.channel || 'Unknown';

                let notesButton = `<button class="btn btn-link note-btn" data-notes="${request.request_notes}">View Notes</button>`;
                // console.log(item.id)

                let actionColumnContent = request.status;

                if (request.status !== 'approved' && request.user_is_admin) {
                    actionColumnContent += `<button class="btn btn-approve" data-id="${request.id}">Approve</button>`;
                }

                dataSet.push([
                    request.owner_username,
                    itemName,
                    itemId,
                    vendor,
                    catalog,
                    channel,
                    request.quantity_requested,
                    item.price,
                    request.total_price,
                    item.location,
                    notesButton,
                    request.request_date,
                    url,
                    actionColumnContent,
                ]);
            }
        });
        new DataTable('#all-request', {
            columns: [
                { title: 'Owner' },
                { title: 'Item' },
                { title: 'Item ID' },
                { title: 'Vendor' },
                { title: 'Catalog' },
                { title: 'Channel' },
                { title: 'Quantity Requested' },
                { title: 'Unit Price' },
                { title: 'Total Price' },
                { title: 'Location' },
                { title: 'Request Notes' },
                { title: 'Date Request' },
                { title: 'Link' },
                { title: 'Status', orderable: true, defaultContent: '' }, // If button is in 'Status' column
                {
                    title: 'Action',
                    data: null, // No specific data field is used for this column
                    defaultContent: '<button class="btn request-again w-100 py-1">Request Again</button>',
                    orderable: false // This column is not orderable
                }
            ],
            data: dataSet,
        });

        populateItemDropdown(itemNames);
    } catch (error) {
        console.error("Error fetching data: ", error);
    }

    $(document).on('click', '.note-btn', function () {
        let notes = $(this).data('notes');
        $('#notesModal .modal-body').text(notes);
        $('#notesModal').modal('show');
    });


    $(document).ready(function () {
        $('#all-request').on('click', '.request-again', function () {
            var data = $('#all-request').DataTable().row($(this).parents('tr')).data();
            populateForm(data);
        });
    });

    //approve button
    $(document).on('click', '.btn-approve', function () {
        let requestId = $(this).data('id'); // Retrieve the request ID stored in the data-id attribute

        approveRequest(requestId, function () {
            alert("Request approved successfully!");
            location.reload(); // Refresh the page
        });
    });

    function approveRequest(requestId, onSuccess) {
        const token = localStorage.getItem('token'); // Retrieve your auth token
        const authHeader = token ? { 'Authorization': 'Token ' + token } : {};
        var HOST = "http://127.0.0.1:8000"
        if (location.hostname === "ilab-cs633.onrender.com") {
            HOST = "https://ilab-api.onrender.com"
        }
        $.ajax({
            url: HOST + `/api/request/approve/${requestId}/`, // Adjust URL as needed
            method: 'GET', // Use POST or appropriate method as per your backend API
            headers: authHeader,
            success: function (response) {
                // Handle successful approval
                console.log("Request approved successfully:", response);
                onSuccess(); // Call the onSuccess callback
                // Optionally, update the UI to reflect the approval
            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error("Error approving request:", xhr.responseText);
            }
        });
    }




    function populateItemDropdown(itemNames) {
        var $itemNameDropdown = document.getElementById('itemNameInput');

        $itemNameDropdown.innerHTML = ''; // Clear existing options

        itemNames.forEach(function (name) {
            var option = new Option(name, name);
            $itemNameDropdown.appendChild(option);
        });
    }

    function populateForm(data) {

        // Get the values from your data
        var unitPrice = parseFloat(data[6]); // Assuming unit price is at index 6
        var quantityRequested = parseInt(data[5]); // Assuming quantity is at index 5

        var currentDate = new Date().toISOString().split('T')[0];


        // Update the input fields for price and quantity
        $('#unitPriceInput').val(unitPrice);
        $('#quantityRequestedInput').val(quantityRequested);

        // Calculate the initial total price
        var totalPrice = unitPrice * quantityRequested;

        // Update the displayed total price
        $('#totalPriceDisplay').text(totalPrice.toFixed(2)); // Format to 2 decimal places

        // Add event listeners to dynamically update the total price
        $('#unitPriceInput, #quantityRequestedInput').on('input', function () {
            var newUnitPrice = parseFloat($('#unitPriceInput').val()) || 0;
            var newQuantityRequested = parseInt($('#quantityRequestedInput').val()) || 0;

            // Calculate the new total price
            var newTotalPrice = newUnitPrice * newQuantityRequested;
            // Update the displayed total price
            $('#totalPriceDisplay').text(newTotalPrice.toFixed(2)); // Format to 2 decimal places
        });

        // Handle the Link
        var linkHtml = data[10]; // Assuming the link HTML is at index 10
        if (linkHtml && linkHtml.includes('href')) {
            // Extract the URL from the anchor tag
            var linkUrl = $('<div>').html(linkHtml).find('a').attr('href');
            $('#linkInput').val(linkUrl);
        } else {
            // Set input value to empty if no link is provided
            $('#linkInput').val('');
        }

        var itemID = data[13]; // Assuming itemID is at index 13
        $('#itemIDInput').val(itemID); // Set the itemID in the hidden input

        $('#ownerInput').val(data[0]); // Owner
        $('#itemNameInput').val(data[1]); // Item
        $('#vendorInput').val(data[2]); // Vendor
        $('#catalogInput').val(data[3]); // Catalog
        $('#channelInput').val(data[4]); // Channel
        $('#quantityRequestedInput').val(data[5]); // Quantity Requested
        $('#unitPriceInput').val(data[6]); // Unit Price
        $('#totalPriceDisplay').text(totalPrice.toFixed(3)); // Format to 2 decimal places
        $('#locationInput').val(data[8]); // Location
        $('#dateRequestInput').val(currentDate);
        $('#linkDisplay').attr('href', linkUrl);

        $('#addRequestModal').modal('show');
    }

    // Attach event listener to the Clear button
    var clearButton = document.getElementById('clearForm');
    if (clearButton) {
        clearButton.addEventListener('click', clearForm);
    } else {
        console.error('Clear button not found');
    }

    // Function to clear the form
    function clearForm() {
        var form = document.querySelector('.addrequest');
        if (form) {
            form.reset();
            $('#totalPriceDisplay').text('0.00'); // Reset the total price display
            // Reset other fields as needed...
        } else {
            console.error('Form not found');
        }
    }

    // Function to handle form submission
    async function submitForm() {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        async function fetchCurrentUserId() {
            try {
                var HOST = "http://127.0.0.1:8000"
                if (location.hostname === "ilab-cs633.onrender.com") {
                    HOST = "https://ilab-api.onrender.com"
                }
                const response = await fetch(HOST + '/api/current_user/', {
                    headers: new Headers({
                        'Authorization': 'Token ' + token  // Ensure correct format: 'Token <token>'
                    })
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Current User ID:', data.user_id);
                return data.user_id
                // Use the user ID as needed in your frontend app
            } catch (error) {
                console.error('Failed to fetch current user ID:', error);
            }
        }

        let userId;
        try {
            userId = await fetchCurrentUserId();
        } catch (error) {
            console.error('Error fetching user ID:', error);
            return; // Stop execution if user ID could not be fetched
        }

        if (!userId) {
            console.error('No user ID found');
            return; // Stop execution if no user ID
        }

        console.log(userId)

        // Gather data from the form
        var formData = {
            // owner will be use when apply authtication that login will its user ID and user for post
            owner: userId, //need to change to current user later
            item: itemNameToID[$('#itemNameInput').val()],
            qty: parseInt(document.getElementById('quantityRequestedInput').value),
            price: parseFloat(document.getElementById('unitPriceInput').value),
            vendor: document.getElementById('vendorInput').value,
            channel: document.getElementById('channelInput').value,
            link: document.getElementById('linkInput').value,
            notes: document.getElementById('notesTextarea').value,
            request_date: document.getElementById('dateRequestInput').value,
            // Add other fields as needed
        };


        // Log formData to console for demonstration purposes
        console.log('Form Data:', formData);
        var HOST = "http://127.0.0.1:8000"
        if (location.hostname === "ilab-cs633.onrender.com") {
            HOST = "https://ilab-api.onrender.com"
        }
        fetch(HOST + '/api/requests/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeader
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                alert('Request create success'); // Display success message
                // Optionally, you can clear the form or redirect the user
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error creating request: ' + error); // Display error message
            });
    }

    document.addEventListener('DOMContentLoaded', function () {
        displayCurrentUserName();
        // ... other initialization code ...
    });

    // Attach event listener to the submit button
    var submitButton = document.getElementById('submitRequest');
    if (submitButton) {
        submitButton.addEventListener('click', submitForm);
    } else {
        console.error('Submit button not found');
    }
}
