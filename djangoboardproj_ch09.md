# Django Boardapp project

# 대화형 게시판 삭제에 이슈가 있다. 앞으로 해결될 예정

## 대화형 게시판 웹페이지 구성

- 대화형 게시글 리스트, 글쓰기
- 대화형 게시글 삭제
- 대화형 게시글 수정

## urls.py

- boardapp/urls.py

    ```python
    # urlpatterns에 추가한다.
    path('comm_list/<category>/', board_comm_list_page, name='commlist'),
    path('comm_modify/<int:pk>/', BoardCommModifyView.as_view(), name='commmodify'),
    path('comm_view/<int:pk>/', BoardCommView.as_view(), name='commview'),
    ```

### list, write

- `comm_list/<category>`
    - 쓰기도 같이 처리된다.
        - `POST` : 쓰기
        - `GET` : 읽기
    - boardapp/views.py
        ```python
        def board_comm_list_page(request, category):
            error_flag = False
            
            if request.method == "POST":
                title = request.POST['title']
                content = request.POST['content']
                try:
                    img_file = request.FILES['img_file']
                except:
                    img_file = None
                    
                try:
                    board_category = BoardCategories.objects.get(category_code=category)
                    if request.user and title and content and request.user.is_superuser >= board_category.authority:
                        article = Boards(category=board_category, user=request.user, title=title, content=content, image=img_file)
                        article.save()
                        print('saved')
                    else:
                        error_flag = True
                except BaseException as e:
                    print(e)
                    error_flag = True
            
            articles = Boards.objects.filter(category__category_code=category).order_by('-id')
            board_category = BoardCategories.objects.get(category_code=category)
            paginator = Paginator(articles, board_category.list_count)
            
            if request.GET.get('page'):
                page = int(request.GET.get('page'))
            else:
                page = 1
                
            articles = paginator.get_page(page)
            
            page_count = 10
            page_list = []
            first_page = (math.ceil(page/page_count) - 1) * page_count + 1
            last_page = min([math.ceil(page/page_count) * page_count, paginator.num_pages])
            
            for i in range(first_page, last_page + 1):
                page_list.append(i)
                
            
            args = {}
            args.update({"error_flag":error_flag})
            args.update({"articles":articles})
            args.update({"board_category":board_category})
            args.update({"page_list":page_list})
            
            return render(request, 'board_comm_list.html', args)
        ```
    - boardapp/templates/board_comm_list.html
        ```html
        {% extends "base.html" %}

        {% block title %}{{ board_category.category_name}} 리스트{% endblock %}

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
                
                <!-- Reply Block -->
                <div class="row">
                    <div class="col-12 article-reply" data-id="{{ article.id }}"></div>
                </div>
                
                <!-- Reply Write Block -->

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
        {% endblock %}
        ```
    - boardapp/static/boardapp/assets/js/boards.js
        - 이전의 writeSend() 재활용
        - 이전의 deleteClick() 재활용
        ```javascript
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

        // 비동기식 ajax로 처리한다.
        function modifyClick(id) {
            $.ajax({
                type: "GET",
                url: "/boardapp/comm_modify/" + id + '/',
                success: function(response) {
                    $(".article-view[data-id="+id+"]").html(response);
                }
            })
        }
        ```

## modify

- `comm_modify/<int:pk>`
    - boardapp/views.py
        ```python
        class BoardCommModifyView(DetailView):
            model = Boards
            template_name = 'board_comm_modify.html'
        ```
    - boardapp/templates/board_comm_modify.html
        ```html
        <form action="" method="POST" data-type="modify" data-id="{{ object.id }}" enctype="multipart/form-data">
            {% csrf_token %}
            <input type="hidden" name="id" value="{{ object.id }}"/>
            <input type="hidden" name="referer" value="comm"/>
            <div class="row border-top-line">
                <div class="col-11"><input type="text" name="title" class="form-width-90" value="{{ object.title }}"/></div>
            </div>
            <div class="row border-bottom-line">
                <div class="col-12">
                    <h4>
                        <span style="padding-right: 30px">{{ object.user.last_name }}</span>
                        <span>{{ user.registered_date|date:"Y-m-d" }}</span>
                    </h4>
                </div>
            </div>
            <div class="row height-200">
                <div class="col-12 view-content-comm">
                    <textarea name="content" class="form-width-90">{{ object.content }}</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-1 right"><p class="middle">이미지</p></div>
                <div class="col-11">
                    <div class="row">
                        <div class="col-12">
                            현재 등록된 파일: {{ object.image.name }}<br/><br/>
                            <input type="file" name="img_file" accept="image/gif, image/jpeg, image/png"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 center">
                    <input type="button" onclick="modifyCommSend({{ object.id }})" value="수정"/>
                    <input type="button" onclick="modifyCancel({{ object.id }})" value="취소"/>
                </div>
            </div>
        </form>
        ```
    - boardapp/static/boardapp/assets/js/boards.js
        ```javascript
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
        ```

## view

- `comm_view/<int:pk>`
    - boardapp/views.py
        ```python
        class BoardCommView(DetailView):
            model = Boards
            template_name = 'board_comm_view.html'
        ```
    - boardapp/templates/board_comm_view.html
        ```html
        <div class="row border-top-line">
            <div class="col-12"><h2>{{ object.title }}</h2></div>
        </div>
        <div class="row border-bottom-line">
            <div class="col-6"><h4>
                    <span style="padding-right:30px">{{ object.user.last_name }}</span>
                    <span>{{ object.registered_date|date:"Y-m-d H:i:s" }}</span>
            </h4></div>
            <div class="col-6 right">
                {% if object.user == request.user %}
                <form action="{% url 'boarddeleteres' %}" method="POST" data-id="{{ object.id }}">
                    <input type="hidden" name="article_id" value="{{ object.id }}"/>
                    <input type="hidden" name="referer" value="comm"/>
                    {% csrf_token %}
                    <p>
                        <span style="cursor:pointer" onclick="modifyClick({{ object.id }})">수정</span>
                        <span style="cursor:pointer" onclick="deleteClick({{ object.id }})">삭제</span>
                    </p>
                </form>
                {% endif %}
            </div>
        </div>
        <div class="row">
            <div class="col-12 view-content-comm">
                <p>{{ object.content }}</p>
                {% if object.image %}<img src="{{ object.image.url }}"/>{% endif %}
            </div>
        </div>
        ```

## modify, delete

- board_delete_result, board_modify_result를 board와 공유하여 사용한다.
- board, comm 각각에서 행동을 하였을 때 redirect 를 바꾸어 주어야한다.
- 따라서 각각 아래와 같이 수정한다.
    - boardapp/views.py의 board_delete_result
        ```python
        @login_required
        def board_delete_result(request):
            if request.method == "POST":
                article_id = request.POST['article_id']
                referer = request.POST['referer']
            else:
                article_id = -1
                
            args = {}
            
            article = Boards.objects.get(id=article_id)
            if request.user == article.user:
                article.delete()
                
                if referer == "board":
                    redirection_page = '/boardapp/board_list/' + article.category.category_code + '/'
                else:
                    redirection_page = '/boardapp/comm_list/' + article.category.category_code + '/'
            else:
                redirection_page = '/boardapp/error/'
                
            return redirect(redirection_page)
        ```
    - boardapp/views.py의 board_modify_result
        ```python
        @login_required
        def board_modify_result(request):
            if request.method == "POST":
                title = request.POST['title']
                content = request.POST['content']
                article_id = request.POST['id']
                referer = request.POST['referer']
                try:
                    img_file = request.FILES['img_file']
                except:
                    img_file = None
            else:
                title = None
            
            args = {}
            
            try:
                if request.user and title and content and article_id:
                    article = Boards.objects.get(id=article_id)
                    
                    if article.user != request.user:
                        redirection_page = '/boardapp/error/'
                    else:
                        article.title = title
                        article.content = content
                        article.last_update_date = timezone.now()
                        
                        if img_file:
                            article.image = img_file
                        
                        article.save()
                        
                        if referer == 'board':
                            redirection_page = '/boardapp/board_view/' + article_id + '/'
                        else:
                            redirection_page = '/boardapp/comm_view/' + article_id + '/'
                        
                else:
                    redirection_page = '/boardapp/error/'
            except:
                redirection_page = '/boardapp/error/'
            
            return redirect(redirection_page)
        ```

## base.html 수정

- 대화형 게시판을 다음과 같이 수정한다.
    ```html
    <div class="col-2 center sideline dark-link">
        <a href="{% url 'commlist' 'comm' %}">대화형 게시판</a>
    </div>
    ```

## 테스트

- 로그인을 실시하고 자유롭게 게시글을 작성하며 테스트를 진행한다.