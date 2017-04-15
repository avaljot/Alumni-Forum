$(function() {
    $( "#searchBox" ).keyup(function() {
        console.log("data now "+$("#searchBox").val());
        $.ajax({
            url: '../posts/getPostByTag',
            type: 'POST',
            data : {
                tags: $("#searchBox").val(),
            },
            contentType: 'application/x-www-form-urlencoded',
            success: function (data) {
                $("#middleTable").empty();
                $("#middleTable").append(getHeaderRow());
                for(var i=0;i<data.length;i++){
                    $("#middleTable").append(getpostsForCurrentRow(data[i]));
                }
            }
        });
    });
});

function getHeaderRow(){
    var one="<tr>";
    one+="<th style='width: 10em;'><span>Discussion</span></th>";
    one+="<th style='width: 7em;'><span>Topics</span></th>";
    one+="<th style='width: 3em;'><span>Posts</span></th>";
    one+="<th style='width: 7em;'><span>Last Post</span></th>";
    one+="</tr>";
    return one;
}
function getpostsForCurrentRow(data){
    var one="<tr class='clickable-row'>";
    one+="<form method='post' action='/posts/getPost/' id='getPost'>";
    one+="<input type='hidden' value="+data._id+" id='postId' name='getPost'/>";
    one+="<td style='width: 10em;'>";
    one+="<span style='width: 70%; float: right;' id='title'>"+data.title+"</span>";
    one+="<br/>";
    one+="<span style='width: 10%; color:greenyellow;'>Up votes : "+getLength(data.upvotes)+"</span>";
    one+="<br/>";
    one+="<span style='width: 10%; color:lightcoral;'>Down votes : "+getLength(data.downvotes)+"</span>";
    one+="<br/>";
    one+="<span style='width: 10%; color:cornflowerblue;'>Views : "+data.preview+"</span>";
    one+="</td>";
    one+="<td style='width: 7em;'>";
    one+="<span style='float: right;'>";
    one+=getTagsofPost(data.tags);
    one+="</span> </td> <td style='width: 3em; float: right; color: darkslategray;'> <span>";
    one+=getLength(data.comment);+"</span></td>";
    one+="<td style='width: 7em; color: darkcyan;'><span>"+data.lastModified+"</span></td>";
    one+="</form></tr>";
    return one;
}

function getLength(data) {
    if(data!=null){
        return data.length;
    }
    else{
        return 0;
    }
}

function getTagsofPost(tags){
    var one="";
    for(var i=0;i<tags.length;i++) {
        one+="<span style='background-color:#cdf2f1;color: black;display: inline;font-weight: bold;'>"+tags[i].text+"</span>";
        one+="<span>&nbsp;</span>";
    }
    return one;
}