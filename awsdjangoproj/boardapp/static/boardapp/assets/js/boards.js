function writeSend() {
    if (!$('#title').val()) {
        alert("제목을 입력해 주시기 바랍니다.");
        return;
    }
    if (!$('#content').val()) {
        alert("내용을 입력해 주시기 바랍니다.");
        return;
    }
    $('#write_form').submit();
}

function deleteClick(id) {
    if (confirm("삭제하시겠습니까?")) {
        if (!id) {
            $('#delete_form').submit();
        }
        else {
            $("form[data-id="+id+"]").submit();
        }
    }
}

function modifySend() {
    if ( !$('#title').val()) {
        alert("제목을 입력해 주시기 바랍니다.");
        return;
    }
    if (!$('#content').val()) {
        alert("내용을 입력해 주시기 바랍니다.");
        return;
    }
    $('#modify_form').submit();
}

function modifyClick(id) {
    $.ajax({
        type: "GET",
        url: "/boardapp/comm_modify/" + id + '/',
        success: function(response) {
            $(".article-view[data-id="+id+"]").html(response);
        }
    })
}

function modifyCommSend(id) {
    var article_div = ".article-view[data-id="+id+"]";
    var article_form = "form[data-type=modify][data-id="+id+"]";
    
    if (!$(article_form + ' input[name=title]').val()) {
        alert("제목을 입력해 주시기 바랍니다.");
        return;
    }
    
    if (!$(article_form + ' textarea[name=content]').val()) {
        alert("내용을 입력해 주시기 바랍니다.");
        alert(article_div);
        return;
    }
    
    var data = new FormData($(article_form)[0]);
    data.append("img_file", $(article_form + ' input[type=file]')[0].files[0]);
    
    $.ajax({
        type: "POST",
        url: "/boardapp/board_modify_res/",
        processData: false,
        contentType: false,
        data: data,
        success: function(response) {
            $(article_div).html(response);
        },
    });
}

function modifyCancel(id) {
    $.ajax({
        type: "GET",
        url: "/boardapp/comm_view/"+id,
        success: function(response) {
            $(".article-view[data-id="+id+"]").html(response);
        },
    });
}

function replyWriteSend(id) {
    var reply_div = '.article-reply[data-id='+id+']';
    var reply_form = 'form[data-type=reply][data-id='+id+']';
    
    if (!$(reply_form + ' textarea').val()) {
        alert("내용을 입력해주시기 바랍니다.");
        return;
    }
    
    $.ajax({
        type: "POST",
        url: "/boardapp/reply_write_res/",
        data: $(reply_form).serialize(),
        success: function(response) {
            $(reply_div).html(response);
            $(reply_form + ' textarea').val('');
        },
    });
}

function replyClick(reply_id) {
    $('.reply-reply').each(function() {
        $(this).css('display', 'none');
    });
    
    $('.reply-reply[data-id='+reply_id+']').css('display','block');
}

function replyModifyClick(id) {
    $.ajax({
        type: "GET",
        url: "/boardapp/reply_modify/" + id + "/",
        success: function(response) {
            $(".reply-block[data-id="+id+"]").html(response);
        },
    });
}

function replyDeleteClick(reply_id, article_id) {
    if (confirm("삭제하시겠습니까?")) {
        var reply_div = '.article-reply[data-id='+article_id+']';
        var reply_form = 'form[data-type=reply_delete][data-id='+reply_id+']';
        
        $.ajax({
            type: "POST",
            url: "/boardapp/reply_delete_res/",
            data: $(reply_form).serialize(),
            success: function(response) {
                $(reply_div).html(response);
                $(reply_form + ' textarea').val('');
            },
        });
    }
}

function replyReplySend(id, article_id) {
    var reply_div = '.article-reply[data-id='+article_id+']';
    var reply_form = 'form[data-type=reply-reply][data-id='+id+']';
    
    if (!$(reply_form + ' textarea').val()) {
        alert("내용을 입력해 주시기 바랍니다.");
        return;
    }
    
    $.ajax({
        type: "POST",
        url: "/boardapp/reply_write_res/",
        data: $(reply_form).serialize(),
        success: function(response) {
            $(reply_div).html(response);
            $(reply_form + ' textarea').val('');
            $('.reply-reply[data-id='+id+']').css('display','none');
        },
    });
}

function replyModifySend(id, article_id) {
    var reply_div = ".article-reply[data-id="+article_id+"]";
    var reply_form = "form[data-type=reply-modify][data-id="+id+"]";
    
    if (!$(reply_form + ' textarea').val()) {
        alert("내용을 입력해 주시기 바랍니다.");
        return;
    }
    
    $.ajax({
        type: "POST",
        url: "/boardapp/reply_modify_res/",
        data: $(reply_form).serialize(),
        success: function(response) {
            $(reply_div).html(response);
            $(reply_form + ' textarea').val('');
        },
    });
}

function replyView(article_id) {
    var reply_div = ".article-reply[data-id="+article_id+"]";
    
    $.ajax({
        type: "GET",
        url: "/boardapp/reply_list/" + article_id + "/",
        success: function(response) {
            $(reply_div).html(response);
        },
    });
}

var inProgress = false;

function likeClick(article_id) {
    var like_form = 'form[data-type=like][data-id='+article_id+']';
    
    if(!inProgress) {
        inProgress = true;
        
        $.ajax({
            type: "POST",
            url: "/boardapp/board_like_res/",
            data: $(like_form).serialize(),
            success: function(response) {
                if (response.like_err_msg) {
                    alert(response.like_err_msg);
                }
                $.ajax({
                    type: "GET",
                    url: "/boardapp/board_like/" + response.article_id + "/",
                    success: function(response) {
                        $(".article-like[data-id="+article_id+"]").html(response);
                    },
                });
                inProgress = false;
            },
        });
    }
}



