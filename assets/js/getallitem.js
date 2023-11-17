async function getAllItems() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/items/");
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
