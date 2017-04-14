$(function() {
    $( "#searchBox" ).keyup(function() {
        $.ajax({
            url: '../posts/getPostByTag',
            type: 'POST',
            data : {
                tags: $("#searchBox").val(),
            },
            contentType: 'application/x-www-form-urlencoded',
            success: function (data) {
                console.log(data);
            }
        });
    });
});


function getpostsForCurrentRow(){
var one="<tr class='clickable-row'>";
one+="<form method='post' action='/posts/getPost/' id='getPost'>";
one+="<input type='hidden' value={{_id}} id='postId' name='getPost'/>";
one+="<td style='width: 10em;'>";
one+="<span style='width: 70%; float: right;' id='title'>{{title}}</span>";
one+="<br/>";
one+="<span style='width: 10%; color:greenyellow;'>Up votes : {{upvotes}}</span>";
one+="<br/>";
one+="<span style='width: 10%; color:lightcoral;'>Down votes : {{downvotes}}</span>";
one+="<br/>";
one+="<span style='width: 10%; color:cornflowerblue;'>Views : {{preview}}</span>";
one+="</td>";
one+="<td style='width: 7em;'>";
one+="<span style='float: right;'>";
one+=getTagsofPost(post.tags);
one+="</span> </td> <td style='width: 3em; float: right; color: darkslategray;'> <span>";
one+="checkComment();</span></td>";
one+="<td style='width: 7em; color: darkcyan;'><span>{{lastModified}}</span></td>";
one+="</form></tr>";
}

function checkComment(comments) {
    if(comments!=null){
        return comments.length;
    }
    else{
        return 0;
    }
}

function getTagsofPost(tags){
    var one="";
    for(var x in tags) {
        one+="<span style='background-color:#cdf2f1;color: black;display: inline;font-weight: bold;'>#{{this.text}}</span>";
        one+="<span>&nbsp;</span>";
    }
    return one;
}