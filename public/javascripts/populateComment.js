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

function sample () {
    console.log('check');
}

function addComment(postId){
    $.ajax({
        url: '../postsComment',
        type: 'POST',
        data : {
            getPost: $("#getPost").val(),
            comment: $("#comment").val(),
        },
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            console.log(data);
            var one="<div class='media' onclick=\"getCommentOfComment('"+data._id+"',this)\">";
            one+="<a class='pull-left'>";
            one+="<img class='media-object' style='width: 7em;height: 5em;' src='http://localhost:8000/uploads/"+data.user.filename+"' alt='profile pic of user'>";
            one+="</a><div class='media-body'> <h4 class='media-heading'>"+data.user.username+"<small>"+data.lastModified+"</small>";
            one+="</h4>"+data.text+"</div></div>";
            $("#commentsList").append(one);
        }
    });
}