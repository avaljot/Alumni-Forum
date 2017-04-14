function companyName() {
    $.ajax({
        url: "./companyname",
        method: 'get',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $.each(data, function (index, item) {
                $('#company-list').empty();
            });
            $.each(data, function (index, item) {
                $('#company-list').append("<option>" + item.name + "</option>");
            });

        },
        error: function (xhr, text, err) {
            console.log('error: ', err);
            console.log('text: ', text);
            console.log('xhr: ', xhr);
            console.log("there is a problem whit your request, please check ajax request");
        }
    });
}

function univName() {
    $.ajax({
        url: "./universityname",
        method: 'get',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $.each(data, function (index, item) {
                $('#university-list').empty();
            });
            $.each(data, function (index, item) {
                $('#university-list').append("<option>" + item.name + "</option>");
            });
        },
        error: function (xhr, text, err) {
            console.log('error: ', err);
            console.log('text: ', text);
            console.log('xhr: ', xhr);
            console.log("there is a problem whit your request, please check ajax request");
        }
    });
}


