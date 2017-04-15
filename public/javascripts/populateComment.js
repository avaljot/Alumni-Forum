function getCommentOfComment(commentId){
    console.log("comment clicked "+commentId);
    var divToAppend="#selected"+commentId;
    //console.log(divToAppend);
    $('#selected*').each(function() {
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
            //$(divToAppend).append(one);
            var one = "<div class='commentOfComment well'>";
            if(data.comments!="done") {
                for (i = 0; i < data.comments.length; i++) {
                    one += getCommentDiv(data.comments[i]);
                }
            }
            if(data.user!=false)
                one+=getCommentButtonOfComment(data,commentId);
            one+="</div>";
            $(divToAppend).empty();
            $(divToAppend).append(one);
        }
    });
}

function getCommentButtonOfComment(data,commentId){
    var one="<div class='expandonClick'> <h4>Leave a Comment:</h4> <div>";
    one+="<div class='form-group'>";
    one+="<input type='text' class='form-control' name='comment' id='comment'/>";
    one+="</div><button onclick=\"addCommentofComment('"+commentId+"',this)\" class='btn btn-primary'>Post Comment</button>";
    one+="</div> </div>";
    return one;
}

function addCommentofComment(commentID,currentObject){
    console.log($(currentObject).parent().parent().parent().html());
    var divToAppend="#selected"+commentID;
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
            //$(currentObject).parent().parent().parent().empty();
            var one=getCommentDiv(data);
            $(currentObject).after(one);
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
            var one=getCommentDiv(data);
            $("#commentsList").append(one);
        }
    });
}

function getCommentDiv(data){
    var one="<div class='media' onclick=\"getCommentOfComment('"+data._id+"',this)\">";
    one+="<a class='pull-left'>";
    one+="<img class='media-object' style='width: 7em;height: 5em;' src='http://localhost:8000/uploads/"+data.user.filename+"' alt='profile pic of user'>";
    one+="</a><div class='media-body'> <h4 class='media-heading'>"+data.user.username+"<small>"+data.lastModified+"</small>";
    one+="</h4>"+data.text+"</div></div><div class=\"clickedDiv\" id='selected"+data._id+"'></div>";
    return one;
}

function increaseUpvotes(postId){
    console.log('inside upvotes');
    $.ajax({
        url: '../increaseUpvotes',
        type: 'POST',
        data : {
            getPost: postId,
        },
        success: function (data) {
            $("#upvotes").empty();
            $("#upvotes").append("Up votes : "+data);
        },
        error: function (xhr, text, err) {
            console.log('error: ', err);
            console.log('text: ', text);
            console.log('xhr: ', xhr);
        }
    });
}

function favThisPost(postId){
    console.log('inside upvotes');
    $.ajax({
        url: '../favPost',
        type: 'POST',
        data : {
            getPost: postId,
        },
        success: function (data) {
            $("#fav").attr("onclick", "unfavThisPost('" + postId + "');");
            $("#fav").attr("src", "/images/fav.jpg");

        },
        error: function (xhr, text, err) {
            console.log('error: ', err);
            console.log('text: ', text);
            console.log('xhr: ', xhr);
        }
    });
}

function unfavThisPost(postId) {

    $.ajax({
        url: '../unfavPost',
        type: 'POST',
        data: {
            getPost: postId
        },
        success: function (data) {
            $("#fav").attr("onclick", "favThisPost('" + postId + "');");
            $("#fav").attr("src", "/images/unfav.png");

        },
        error: function (xhr, text, err) {
            console.log('error: ', err);
            console.log('text: ', text);
            console.log('xhr: ', xhr);
        }
    });
}


function increaseDownvotes(postId){
    $.ajax({
        url: '../increaseDownvotes',
        type: 'POST',
        data : {
            getPost: postId,
        },
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            $("#downvotes").empty();
            $("#downvotes").append("Down votes : "+data);
        },
        error: function (xhr, text, err) {
            console.log('error: ', err);
            console.log('text: ', text);
            console.log('xhr: ', xhr);
        }
    });
}