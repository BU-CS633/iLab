async function getAllRequest() {
    const token = localStorage.getItem('token');
    const authHeader = token ? { 'Authorization': 'Token ' + token } : {};

    var dataSet = [];
    var itemNames = new Set();
    let itemNameToID = {};

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

        requestsData = requestsData.filter(request => request.owner === userId);


        requestsData.forEach(request => {
            let item = itemLookup[request.item]; // Replace 'itemId' with your actual property name in request that refers to the item ID
            if (item) {
                let url = item.link ? (item.link.startsWith('http://') || item.link.startsWith('https://') ? item.link : 'http://' + item.link) : 'No link';
                url = url !== 'No link' ? '<a href="' + url + '" target="_blank">link</a>' : 'No link';

                let itemName = request.item_name || 'Unknown';
                let itemId = request.item;
                itemNameToID[itemName] = itemId; // Replace 'itemId' with the actual property name
                itemNames.add(itemName);
                // console.log(itemNameToID)

                let vendor = item.vendor || 'Unknown';
                let catalog = item.catalog || 'Unknown';
                let channel = item.channel || 'Unknown';
                let notesButton = `<button class="btn btn-link note-btn" data-notes="${request.request_notes}">View Notes</button>`;

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
                    request.status,
                ]);
            }
        });

        $('#my-request').DataTable({
            data: dataSet,
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
                { title: 'Status' },
                // {
                //     title: 'Action', 
                //     data: null, // No specific data field is used for this column
                //     defaultContent: '<button class="btn btn-info w-100 py-1">Request Again</button>',
                //     orderable: false // This column is not orderable
                // }
            ]
        });
    } catch (error) {
        console.error("Error fetching data: ", error);
    }

    $(document).on('click', '.note-btn', function () {
        let notes = $(this).data('notes');
        $('#notesModal .modal-body').text(notes);
        $('#notesModal').modal('show');
    });

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

}

