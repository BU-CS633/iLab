async function getAllRequest() {
    var owner_id 
    var item_id
    var requestSettings = {
        "url": "http://127.0.0.1:8000/api/requests/",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };

    var itemSettings = {
        "url": "http://127.0.0.1:8000/api/items/",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };

    try {
        let requestResponse = await $.ajax(requestSettings);
        let itemResponse = await $.ajax(itemSettings);

        var dataSet = [];
        var itemNames = new Set();

        let itemNameToID = {}; // Object to map item names to their IDs

        for (let i = 0; i < Math.max(itemResponse.results.length, requestResponse.results.length); i++) {
            let request = requestResponse.results[i];
            let item = itemResponse.results[i]; // Get the item details using the item ID from the request
            

            let url = item ? item.link : null;

            // Check if url is not null or undefined
            if (url) {
                // Check if the URL starts with 'http://' or 'https://', if not, prepend 'http://'
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'http://' + url;
                }
                url = '<a href="' + url + '" target="_blank">link</a>';
            } else {
                // Handle the case where url is null or undefined
                url = 'No link'; // or any other placeholder you want to use
            }
                        
            if (request && item) {
                // Process request and item here
                // Ensure that both request and item objects exist before accessing their properties
                let itemName = request.item_name || 'Unknown';
                requestResponse.results.forEach(request => {
                    itemNameToID[request.item_name] = request.item;
                });
        
                console.log(itemNameToID);
                
                let itemID = itemNameToID[itemName];

                itemNames.add(itemName);

                let vendor = item.vendor || 'Unknown';
                let catalog = item.catalog || 'Unknown';
                let channel = item.channel || 'Unknown';
                let notesButton = `<button class="btn btn-link note-btn" data-notes="${request.request_notes}">View Notes</button>`;


                dataSet.push([
                    request.owner_username, 
                    itemName, 
                    vendor, 
                    catalog, 
                    channel, 
                    request.quantity_requested,
                    item.price, 
                    request.total_price,
                    item.location,
                    notesButton,
                    request.request_date,
                    url , // Use the updated linkHtml
                    request.status, 
                    itemID
                ])
                // Rest of your processing code for request and item...
            }

           
        }
        new DataTable('#all-request', {
            columns: [
                { title: 'Owner' },
                { title: 'Item' },
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
                {
                    title: 'Action', 
                    data: null, // No specific data field is used for this column
                    defaultContent: '<button class="btn btn-info w-100 py-1">Request Again</button>',
                    orderable: false // This column is not orderable
                }
            ],
            data: dataSet,
        });

        populateItemDropdown(itemNames);
    } catch (error) {
        console.error("Error fetching data: ", error);
    }

    $(document).on('click', '.note-btn', function() {
        let notes = $(this).data('notes');
        $('#notesModal .modal-body').text(notes);
        $('#notesModal').modal('show');
    });
     

    $(document).ready(function() {
        $('#all-request').on('click', '.btn-info', function () {
            var data = $('#all-request').DataTable().row($(this).parents('tr')).data();
            populateForm(data);
        });
    });

    function populateItemDropdown(itemNames) {
        var $itemNameDropdown = document.getElementById('itemNameInput');
    
        $itemNameDropdown.innerHTML = ''; // Clear existing options
    
        itemNames.forEach(function(name) {
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
    function submitForm() {
        // Prevent the default form submission if needed
        // event.preventDefault();
        

        // Gather data from the form
        var formData = {
                owner: 1, //need to change to current user later
                item: $('#itemIDInput').val(),
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

        fetch('http://127.0.0.1:8000/api/requests/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
            // Handle success (e.g., show a message, clear the form)
          })
          .catch((error) => {
            console.error('Error:', error);
            // Handle errors here
          });
    }

    

    // Attach event listener to the submit button
    var submitButton = document.getElementById('submitRequest');
    if (submitButton) {
        submitButton.addEventListener('click', submitForm);
    } else {
        console.error('Submit button not found');
    }
}
