# Django Boardapp project

## 댓글 웹페이지 구성

- 댓글은 대화형(비동기식::ajax)으로 처리된다.
- 댓글 보기
- 댓글 쓰기
- 댓글 수정
- 댓글 삭제

## urls.py

- boardapp/urls.py

    ```python
    # urlpatterns에 추가한다.
    path('reply_list/<int:article>/', reply_list, name='replylist'),
    path('reply_modify/<int:pk>/', ReplyModifyView.as_view(), name='replymodify'),
    path('reply_modify_res/', reply_modify_result, name='replymodifyres'),
    path('reply_write_res/', reply_write_result, name='replywriteres'),
    path('reply_delete_res/', reply_delete_result, name='replydeleteres'),
    ```

### 댓글을 쓰고 보여줄 페이지 수정

- `board_view/<int:pk>`
    - 댓글 창 추가
    - boardapp/templates/board_view.html
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
        {% endblock %}
        ```
    - boardapp/static/boardapp/assets/js/boards.js
        ```javascript
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
        ```

- `comm_list/<category>`
    - 댓글 창, 댓글보기 버튼 추가
    - boardapp/templates/board_comm_list.html
        ```html
        {% extends "base.html" %}

        {% block title %}{{ board_category.category_name}} 대화형{% endblock %}

        {% block script %}
        {% load static %}<script src="{% static 'boardapp/assets/js/boards.js' %}"></script>
        {% if error_flag == True %}
        <script>alert('게시물 등록에 실패했습니다.');</script>
        {% endif %}
        {% endblock %}

        {% block content %}
        <div class="row block-center board">
            <div class="col-12">
                <div class="row" style="height: 50px">
                    <div class="col-12"><h3>{{ board_category.category_name }}</h3></div>
                </div>
                <!-- Write Block -->
                {% if user.username and user.is_superuser >= board_category.authority %}
                <div class="write-box">
                    <form action="." method="POST" id="write_form" enctype="multipart/form-data">
                        {% csrf_token %}
                        <div class="row">
                            <div class="col-2 right"><p>등록자</p></div>
                            <div class="col-10"><p>{{ user.last_name}}</p></div>
                        </div>
                        <div class="row">
                            <div class="col-2 right"><p>제목</p></div>
                            <div class="col-10"><input type="text" name="title" id="title" class="form-width-90"/></div>
                        </div>
                        <div class="row">
                            <div class="col-2 right"><p>내용</p></div>
                            <div class="col-10"><textarea name="content" id="content" class="form-width-90"></textarea></div>
                        </div>
                        <div class="row">
                            <div class="col-2 right"><p class="middle">이미지</p></div>
                            <div class="col-10"><input type="file" name="img_file" accept="image/gif, image/jpeg, image/png"/></div>
                        </div>
                        <div class="row">
                            <div class="col-12 center">
                                <input type="button" onclick="writeSend()" value="등록"/>
                                <input type="reset" value="취소"/>
                            </div>
                        </div>
                    </form>
                </div>
                {% endif %}
                <!-- List Block -->
                {% for article in articles %}
                <div class="article-view" data-id="{{ article.id }}">
                    <div class="row border-top-line">
                        <div class="col-12"><h2>{{ article.title }}</h2></div>
                    </div>
                    <div class="row border-bottom-line">
                        <div class="col-6"><h4>
                                <span style="padding-right:30px">{{ article.user.last_name }}</span>
                                <span>{{ article.registered_date|date:"Y-m-d H:i:s" }}</span>
                                <span style="cursor:pointer" onclick="replyView({{ article.id }})">댓글보기</span>
                        </h4></div>
                        <div class="col-6 right">
                            {% if article.user == request.user %}
                            <form action="{% url 'boarddeleteres' %}" method="POST" data-id="{{ article.id }}">
                                <input type="hidden" name="article_id" value="{{ article.id }}"/>
                                <input type="hidden" name="referer" value="comm"/>
                                {% csrf_token %}
                                <p>
                                    <span style="cursor:pointer" onclick="modifyClick({{ article.id }})">수정</span>
                                    <span style="cursor:pointer" onclick="deleteClick({{ article.id }})">삭제</span>
                                </p>
                            </form>
                            {% endif %}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 view-content-comm">
                            <p>{{ article.content }}</p>
                            {% if article.image %}<img src="{{ article.image.url }}"/>{% endif %}
                        </div>
                    </div>
                </div>
                <div class="article-like" data-id="{{ article.id }}"></div>
                
                <!-- Reply Bock -->
                <div class="row">
                    <div class="col-12 article-reply" data-id="{{ article.id }}"></div>
                </div>
                
                <!-- Reply Write Block -->
                {% if user.username %}
                <div class="write-box">
                    <form action="" method="POST" data-type="reply" data-id="{{ article.id }}">
                        <input type="hidden" name="id" value="{{ article.id }}"/>
                        <input type="hidden" name="level" value="0"/>
                        {% csrf_token %}
                        <div class="row height-80 center">
                            <div class="col-1"></div>
                            <div class="col-10">
                                <textarea name="content" class="form-width-90"></textarea>
                            </div>
                            <div class="col-1">
                                <input type="button" onclick="replyWriteSend({{ article.id }})" value="등록" class="form-width-90"/>
                            </div>
                        </div>
                    </form>
                </div>
                {% endif %}
                
                {% empty %}
                <div class="row">
                    <div class="col-12 center">
                        <p>현재 등록된 게시물이 없습니다.</p>
                    </div>
                </div>
                {% endfor %}
                
                <!-- Page Block -->
                <div class="row">
                    <div class="col-12 margin-10 center">
                        <span>
                        {% if articles.has_previous %}
                            <a href="?page=1">&laquo; 처음</a>
                            <a href="?page={{ articles.previous_page_number }}">이전</a>
                        {% endif %}
                            
                        {% for page in page_list %}
                            {% if page == articles.number %}
                                {{ page }}
                            {% else %}
                                <a href="?page={{ page }}">{{ page }}</a>
                            {% endif %}
                        {% endfor %}
                            
                        {% if articles.has_previous %}
                            <a href="?page={{ articles.next_page_nubmer }}">다음</a>
                            <a href="?page={{ articles.paginator.num_pages }}">마지막 &raquo;</a>
                        {% endif %}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="height-100"></div>
        {% endblock %}
        ```
    - boardapp/static/boardapp/assets/js/boards.js
        ```javascript
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
        ```

### write

- `reply_write_res`
    - boardapp/views.py
        ```python
        ```
    - boardapp/templates/board_comm_list.html
        ```html
        ```
    - boardapp/static/boardapp/assets/js/boards.js
        ```javascript
        ```

### list

- `comm_list/<category>`
    - boardapp/views.py
        ```python
        ```
    - boardapp/templates/board_comm_list.html
        ```html
        ```
    - boardapp/static/boardapp/assets/js/boards.js
        ```javascript
        ```

### delete

- `comm_list/<category>`
    - boardapp/views.py
        ```python
        ```
    - boardapp/templates/board_comm_list.html
        ```html
        ```
    - boardapp/static/boardapp/assets/js/boards.js
        ```javascript
        ```

### modify

- `comm_list/<category>`
    - boardapp/views.py
        ```python
        ```
    - boardapp/templates/board_comm_list.html
        ```html
        ```
    - boardapp/static/boardapp/assets/js/boards.js
        ```javascript
        ```

## base.html 수정

- 공지사항과 자유게시판을 다음과 같이 수정한다.

## 테스트

- 로그인을 실시하고 자유롭게 게시글을 작성하며 테스트를 진행한다.