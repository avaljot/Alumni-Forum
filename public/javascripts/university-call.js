$(document).ready(function () {
    $.ajax({
        url: "users/universityname",
        method: 'get',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
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
    // $('#university-list').change(function () {
    //     $('[name="university"]').val($(this).find(":selected").text());
    // });


});

