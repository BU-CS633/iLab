function getAllRequest() {
    var settings = {
        "url": "http://127.0.0.1:8000/api/requests/",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };

    $.ajax(settings).done(function (response) {
        var dataSet = []
        for (let i = 0; i < response.results.length; i++) {
            dataSet.push([response.results[i].owner.username, response.results[i].item.name, response.results[i].item.vendor, response.results[i].item.catalog, response.results[i].item.channel, response.results[i].item.qty, response.results[i].item.price, response.results[i].request_date])
        }
        new DataTable('#all-request', {
            columns: [
                { title: 'Owner' },
                { title: 'Item' },
                { title: 'Vendor' },
                { title: 'Catalog' },
                { title: 'Channel' },
                { title: 'Quantity' },
                { title: 'Price' },
                { title: 'Date Request' },
                { 'data': null, title: 'Action', wrap: true, "render": function (item) { return '<div class="btn-group"> <button type="button" onclick="console.log(\'' + item[0] + ' \')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#DetailModal">Detail</button></div>' } },
            ],
            data: dataSet,
        });
    });
}

function getItemDetail() {
    var settings = {
        "url": "http://127.0.0.1:8000/api/items/1",
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