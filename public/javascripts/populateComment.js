function getCommentOfComment(commentId,currObject){
    console.log("comment clicked "+commentId);
    var divToAppend="#selected"+commentId;
    console.log(divToAppend);
    $('#selected_*').each(function() {
        console.log("1");
    });
    $.ajax({
        url: '../getComments',
        type: 'POST',
        data : {
            commentId: commentId,
        },
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            var one="<div class='well expandonClick commentOfComment'> <h4>Leave a Comment:</h4> <div>";
            one+="<div class='form-group'>";
            one+="<input type='text' class='form-control' name='comment' id='comment'/>";
            one+="</div><button onclick=\"addCommentofComment('"+commentId+"',this)\" class='btn btn-primary'>Post Comment</button>";
            one+="</div> </div>";
            $(divToAppend).append(one);
            console.log(data);
        }
    });
}

function addCommentofComment(commentID,currentObject){
      console.log(commentID);
      console.log($(currentObject).parent().html());
    $.ajax({
        url: '../addCommentOfComment',
        type: 'POST',
        data : {
            commentId: commentID,
            comment : $(currentObject).parent().find('input').val(),
        },
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            console.log(data);

        }
    });

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