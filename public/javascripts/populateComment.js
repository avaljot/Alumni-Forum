function getCommentOfComment(commentId,currObject){
    console.log("comment clicked "+commentId);
    $.ajax({
        url: '../getComments',
        type: 'POST',
        data : {
            commentId: commentId,
        },
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            $(currObject).append("<div> new div </div>");
        }
    });
}