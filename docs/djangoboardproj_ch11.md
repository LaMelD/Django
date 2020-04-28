# Django Boardapp project

## 좋아요 기능 구성

- 좋아요 기능은 대화형(비동기식::ajax)으로 처리된다.
- 좋아요 누르기

## urls.py

- boardapp/urls.py

    ```python
    # urlpatterns에 추가한다.
    path('board_like/<int:article>/', board_like, name='boardlike'),
    path('board_like_res/', board_like_result, name='boardlikeres'),
    ```

### 좋아요 버튼 구현

- boardlist
    - boardapp/templates/board_view.html 수정
        ```html
        {% extends "base.html" %}

        {% block title %}{{ object.title }}{% endblock %}

        {% block script %}
        {% load static %}<script src="{% static 'boardapp/assets/js/boards.js' %}"></script>
        {% endblock %}

        {% block content %}
        <!-- 게시물 내용 -->
        <div class="row block-center board">
            <div class="col-12">
                <div class="row">
                    <div class="col-12"><h4>{{ object.category.category_name }}</h4></div>
                </div>
                <div class="row border-top-line">
                    <div class="col-9"><h2>{{ object.title }}</h2></div>
                    <div class="col-3 right"><h4>조회 {{ object.view_count }}</h4></div>
                </div>
                <div class="row border-bottom-line">
                    <div class="col-6"><h4>{{ object.user.last_name }}</h4></div>
                    <div class="col-6 right"><h4>{{ object.registered_date|date:"Y-m-d H:i:s" }}</h4></div>
                </div>
                <div class="row">
                    <div class="col-12 view-content">
                        <p class="content-box">{{ object.content }}</p>
                        {% if object.image %}<img src="{{ object.image.url }}"/>{% endif %}
                    </div>
                </div>
                <!-- 게시물 좋아요 -->
                <div class="article-like" data-id="{{ object.id }}">
                    <form action="" method="POST" data-type="like" data-id="{{ object.id }}">
                        <input type="hidden" name="article_id" value="{{ object.id }}"/>
                        {% csrf_token %}
                        <div class="row">
                            <div class="col-12 center">
                                <div class="like-box {% if user_count == 1 %}like-tag-2{% else %}like-tag-1{% endif %}" onclick="likeClick({{ object.id }})">
                                    <div class="row" style="height: 100%">
                                        <div class="col-6 like-text" style="padding: 0">
                                            <div class="like-contents">추천</div>
                                        </div>
                                        <div class="col-6 like-count" style="padding: 0">
                                            <div class="like-contents">{{ like_count }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="row">
                    <div class="col-12 right">
                        {% if object.user == user %}
                        <form action="{% url 'boarddeleteres' %}" method="POST" id="delete_form">
                            <input type="hidden" name="article_id" value="{{ object.id }}"/>
                            <input type="hidden" name="referer" value="board"/>
                            {% csrf_token %}
                            <input type="button" onclick="location.href='{% url 'boardlist' object.category.category_code %}'" value="목록"/>
                            <input type="button" onclick="location.href='{% url 'boardmodify' object.id %}'" value="수정"/>
                            <input type="button" onclick="deleteClick()" value="삭제"/>
                        </form>
                        {% endif %}
                    </div>
                </div>
            </div>
        </div>
        <!-- 게시물 댓글 -->
        <div class="row">
            <div class="col-12 article-reply" data-id="{{ object.id }}">
                <div class="row border-top-line">
                    <div class="col-12 margin-bottom-10"><h3>댓글 {{ replies.count }}개</h3></div>
                </div>
                {% for reply in replies %}
                <!-- Reply Title block -->
                <div class="row">
                    {% if reply.level == 0 %}
                    <div class="col-12 reply-block" data-id="{{ reply.id }}">
                    {% elif reply.level == 1%}
                    <div class="col-1 center">└</div>
                    <div class="col-11 reply-block" data-id="{{ reply.id }}">
                    {% endif %}
                        <div class="row border-top-dotted">
                            <div class="col-6"><h4>
                                <span style="padding-right: 30px">{{ reply.user.last_name }}</span>
                                <span>{{ reply.registered_date|date:"Y-m-d H:i:s" }}</span>
                            </h4></div>
                            <div class="col-6 right">
                                <form action="" method="POST" data-type="reply_delete" data-id="{{reply.id}}">
                                    <input type="hidden" name="reply_id" value="{{ reply.id }}"/>
                                    {% csrf_token %}
                                    <p>
                                        {% if reply.level == 0 %}
                                        <span style="cursor:pointer" onclick="replyClick({{ reply.id }})">댓글</span>
                                        {% endif %}
                                        {% if reply.user == request.user %}
                                        <span style="cursor:pointer" onclick="replyModifyClick({{ reply.id }})">수정</span>
                                        <span style="cursor:pointer" onclick="replyDeleteClick({{ reply.id }}, {{ reply.article.id }})">삭제</span>
                                        {% endif %}
                                    </p>
                                </form>
                            </div>
                        </div>
                        <!-- Reply Content Block -->
                        <div class="row border-bottom-dotted">
                            <div class="col-12 view-content-comm">
                                {{ reply.content }}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Reply Write Block -->
                {% if user.username and reply.level == 0 %}
                <div class="reply-reply" data-id="{{ reply.id }}">
                    <div class="write-box">
                        <form action="" method="POST" data-type="reply-reply" data-id="{{ reply.id }}">
                            <input type="hidden" name="level" value="1"/>
                            <input type="hidden" name="id" value="{{ reply.reference_reply_id }}"/>
                            {% csrf_token %}
                            <div class="row height-080 center">
                                <div class="col-11">
                                    <textarea name="content" class="form-width-90"></textarea>
                                </div>
                                <div class="col-1">
                                    <input type="button" onclick="replyReplySend({{ reply.reference_reply_id }}, {{ reply.article.id }})" value="등록" class="form-width-90"/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {% endif %}
                {% endfor %}
            </div>
        </div>
        {% if user.username %}
        <div class="write-box">
            <form action="" method="POST" data-type="reply" data-id="{{ object.id }}">
                <input type="hidden" name="id" value="{{ object.id }}"/>
                <input type="hidden" name="level" value="0"/>
                {% csrf_token %}
                <div class="row height-80 center">
                    <div class="col-1"></div>
                    <div class="col-10">
                        <textarea name="content" class="form-width-90"></textarea>
                    </div>
                    <div class="col-1">
                        <input type="button" onclick="replyWriteSend({{ object.id }})" value="등록" class="form-width-90"/>
                    </div>
                </div>
            </form>
        </div>
        {% endif %}
        <div class="height-100"></div>
        {% endblock %}
        ```
    - boardapp/views.py 확인
        ```python
        class BoardView(DetailView):
            model = Boards
            template_name = 'board_view.html'
            
            def dispatch(self, request, pk):
                obj = self.get_object()
                if request.user != obj.user:
                    obj.view_count = obj.view_count + 1
                    obj.save()
                    
                replies = BoardReplies.objects.filter(article__id=obj.id).order_by('reference_reply_id', 'level', 'id')
                like_count = BoardLikes.objects.filter(article__id=obj.id).count()
                user_count = BoardLikes.objects.filter(article__id=obj.id).filter(user=request.user).count()
                
                args = {}
                args.update({"replies": replies})
                args.update({"object": obj})
                args.update({"like_count": like_count})
                args.update({"user_count": user_count})
                    
                return render(request, self.template_name, args)
        ```

- commlist
    - commlist 에 likes 적용은 스스로 적용해보는 것을 권한다.
    - boardapp/templates/board_comm_list.html 수정
    - boardapp/templates/board_comm_view.html 수정
    - boardapp/views.py 수정
        - board_comm_list_page
        - class BoardCommView

### 좋아요 기능 구현

- boardapp/static/boardapp/assets/js/boards.js
    ```javascript
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
    ```

- `board_like/<int:article>`
    - boardapp/views.py
        ```python
        def board_like(request, article):
            args = {}
            like_count = BoardLikes.objects.filter(article__id=article).count()
            user_count = BoardLikes.objects.filter(article__id=article).filter(user=request.user).count()
            
            args.update({"like_count": like_count})
            args.update({"user_count": user_count})
            args.update({"article_id": article})
            
            return render(request, 'board_like.html', args)
        ```
    - boardapp/templates/board_like.html
        ```html
        <form action="" method="POST" data-type="like" data-id="{{ article_id }}">
            <input type="hidden" name="article_id" value="{{ article_id }}"/>
            {% csrf_token %}
            <div class="row">
                <div class="col-12 center">
                    <div class="like-box {% if user_count == 1 %}like-tag-2{% else %}like-tag-1{% endif %}" onclick="likeClick({{ article_id }})">
                        <div class="row" style="height: 100%">
                            <div class="col-6 like-text" style="padding: 0">
                                <div class="like-contents">추천</div>
                            </div>
                            <div class="col-6 like-count" style="padding: 0">
                                <div class="like-contents">{{ like_count }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        ```
- `board_like_res`
    - boardapp/views.py
        ```python
        def board_like_result(request):
            if request.method == "POST":
                article_id = request.POST['article_id']
            else:
                article_id = -1
                
            article = Boards.objects.get(id=article_id)
            like_confirm = BoardLikes.objects.filter(article=article)
            like_already_chk = like_confirm.filter(user=request.user).count()
            
            args = {}
            if article.user == request.user:
                args.update({"like_err_msg": "본인의 게시물에는 추천할 수 없습니다."})
            elif like_already_chk == 1:
                args.update({"like_err_msg": "이미 추천하였습니다."})
            else:
                boardlike = BoardLikes(article=article, user=request.user)
                boardlike.save()
            
            args.update({"article_id": article_id})
            
            return JsonResponse(args)
        ```