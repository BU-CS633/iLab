const URL = "https://ilab-api.onrender.com"

function getAllRequest() {
    var settings = {
        "url": URL + "/api/requests/",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };

    $.ajax(settings).done(function (response) {
        var dataSet = []
        for (let i = 0; i < response.results.length; i++) {
            dataSet.push([response.results[i].owner.username, response.results[i].item.name, response.results[i].id, response.results[i].item.vendor, response.results[i].item.catalog, response.results[i].item.channel, response.results[i].item.qty, response.results[i].item.price, response.results[i].request_date])
        }
        new DataTable('#all-request', {
            columns: [
                { title: 'Owner' },
                { title: 'Item' },
                { title: 'Item ID' },
                { title: 'Vendor' },
                { title: 'Catalog' },
                { title: 'Channel' },
                { title: 'Quantity' },
                { title: 'Price' },
                { title: 'Date Request' },
                { 'data': null, title: 'Action', wrap: true, "render": function (item) { return '<div class="btn-group"> <button type="button" onclick="getRequestDetail(\'' + item[2] + ' \')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#RequestModal">Detail</button></div>' } },
            ],
            data: dataSet,
        });
    });
}

function getItemDetail(id) {
    var settings = {
        "url": URL + "/api/items/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };

    $.ajax(settings).done(function (response) {
        $("#item-name").text(response.name);
        $("#item-fullname").text(response.fullName);
        $("#item-vendor").text(response.vendor);
    });
}

function getRequestDetail(id) {
    var settings = {
        "url": URL + "/api/requests/" + id,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };

    $.ajax(settings).done(function (response) {
        console.log(response)
        console.log(response.item.name)
        $("#request-title").text(response.item.name);
    });
}

async function getAllItems() {
    try {
        const response = await fetch(URL + "/api/items/");
        const data = await response.json();

        const dataSet = data.results.map(item => [
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
            item.notes ?? 'N/A',
            item.id ?? 'N/A'
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
                { title: 'Notes' },
                { 'data': null, title: 'Action', wrap: true, "render": function (item) { return '<div class="btn-group"> <button type="button" onclick="console.log(\'' + item[13] + ' \')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#InventoryModal">Detail</button></div>' } },

            ]
        });
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}
