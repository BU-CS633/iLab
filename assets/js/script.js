$.ajax({
    url: "https://ilab-api.onrender.com/api/",
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    error: function () {
        alert('Error')
    },
    success: function (response) {
        console.log(response)
    },
});

let table = new DataTable('#myTable');