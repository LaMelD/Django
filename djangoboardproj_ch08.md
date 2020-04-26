# Django Boardapp project

## 자유게시판 웹페이지 구성

- 게시글 리스트
- 게시글 상세 페이지
- 게시글 쓰기
- 게시글 삭제
- 게시글 수정

## DB category 생성

- 시작하기에 앞서 category를 생성한다.
- runserver를 하고 admin 페이지에 접속한다(ip:8000/admin/)
- 이전에 만들어 두었던 admin 계정으로 로그인한다.
- boardcategoriess에 추가를 선택한다.

|type|code|name|desc|List count|Authority|
|:---:|:---:|:---:|:---:|:---:|:---:|
|notice|notice|공지사항|설명|10|1|
|normal|normal|자유게시판|설명|10|0|
|communication|comm|대화형 게시판|설명|5|0|

## urls.py

- boardapp/urls.py

    ```python
    # urlpatterns에 추가한다.
    path('board_list/', board_list_page, name='boardlist'),
    path('board_list/<category>/', board_list_page, name='boardlist'),
    path('board_write/<category>/', board_write_page, name='boardwrite'),
    path('board_write_res/', board_write_result, name='boardwriteres'),
    path('board_view/<int:pk>/', BoardView.as_view(), name='boardview'),
    path('board_delete_res/', board_delete_result, name='boarddeleteres'),
    path('board_modify/<int:pk>/', BoardModifyView.as_view(), name='boardmodify'),
    path('board_modify_res/', board_modify_result, name='boardmodifyres'),
    ```

### list

- `board_list`, `board_list/<category>`
    - boardapp/views.py
        ```python
        def board_list_page(request, category=''):
            if request.method == "POST":
                search_text = request.POST['search_text']
            else:
                search_text = ''
            
            if category:
                articles = Boards.objects.filter(category__category_code=category)
                board_category = BoardCategories.objects.get(category_code=category)
                list_count = board_category.list_count
            else:
                articles = Boards.objects.all()
                board_category = BoardCategories()
                list_count = 10
            
            if search_text:
                articles = articles.filter(title__contains=search_text)
            
            articles = articles.annotate(like_count=Count('boardlikes', distinct=True), reply_count=Count('boardreplies', distinct=True)).order_by('-id')
            
            paginator = Paginator(articles, list_count)
            try:
                page = int(request.GET['page'])
            except:
                page = 1
            articles = paginator.get_page(page)
            
            page_count = 10
            page_list = []
            first_page = (math.ceil(page/page_count) - 1) * page_count + 1
            last_page = min([math.ceil(page/page_count) * page_count, paginator.num_pages])
            for i in range(first_page, last_page + 1):
                page_list.append(i)
            
            args = {}
            args.update({"articles":articles})
            args.update({"board_category":board_category})
            args.update({"search_text":search_text})
            args.update({"page_list":page_list})
            
            return render(request, 'board_list.html', args)
        ```
    - boardapp/templates/board_list.html
        ```html
        {% extends "base.html" %}

        {% block title %}{{ board_category.category_name}} 리스트{% endblock %}

        {% block script %}
        {% endblock %}

        {% block content %}
        <div class="row block-center board">
            <div class="col-12">
            {% if board_category.category_name %}
                <div class="row">
                    <div class="col-12"><h2>{{ board_category.category_name }}</h2></div>
                </div>
                <div class="row">
                    <div class="col-12"><h4>{{ board_category.category_desc }}</h4></div>
                </div>
                <div class="row">
                    <div class="list-title col-1"><p>No.</p></div>
                    <div class="list-title col-5"><p>제목</p></div>
                    <div class="list-title col-2"><p>등록자</p></div>
                    <div class="list-title col-2"><p>등록일</p></div>
                    <div class="list-title col-1"><p>조회</p></div>
                    <div class="list-title col-1"><p>추천</p></div>
                </div>
                {% for article in articles %}
                <div class="row">
                    <div class="list-contents col-1">
                        <p>
                            {{ article.id }}
                        </p>
                    </div>
                    <div class="list-contents-title col-5">
                        <p>
                            <a href="{% url 'boardview' article.id %}">
                                {{ article.title }}
                                {% if article.reply_count > 0 %}
                                [{{ article.reply_count }}]
                                {% endif %}
                            </a>
                        </p>
                    </div>
                    <div class="list-contents col-2">
                        <p>
                            {{ article.user.last_name }}
                        </p>
                    </div>
                    <div class="list-contents col-2">
                        <p>
                            {{ article.registered_date | date:"Y-m-d" }}
                        </p>
                    </div>
                    <div class="list-contents col-1">
                        <p>
                            {{ article.view_count }}
                        </p>
                    </div>
                    <div class="list-contents col-1">
                        <p>
                            {{ article.like_count }}
                        </p>
                    </div>
                </div>
                {% empty %}
                <div class="row margin-10 center">
                    현재 등록된 게시물이 없습니다.
                </div>
                {% endfor %}
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
                <div class="row">
                    <div class="col-12 margin-10 center">
                        <form action="." method="POST" id="search_form">
                            {% csrf_token %}
                            <p>
                                제목
                                <input type="text" name="search_text" id="search_text" value="{{ search_text }}" size="8"/>
                                <input type="submit" value="검색"/>
                            </p>
                        </form>
                    </div>
                </div>
                {% if user.username and user.is_superuser >= board_category.authority %}
                <div class="row">
                    <div class="col-12 right">
                        <h4>
                            <a href="{% url 'boardwrite' board_category.category_code %}">글쓰기</a>
                        </h4>
                    </div>
                </div>
                {% endif %}
            {% else %}
                <div class="row">
                    <div class="list-title col-1"><p>No.</p></div>
                    <div class="list-title col-2"><p>게시판이름</p></div>
                    <div class="list-title col-3"><p>제목</p></div>
                    <div class="list-title col-2"><p>등록자</p></div>
                    <div class="list-title col-2"><p>등록일</p></div>
                    <div class="list-title col-1"><p>조회</p></div>
                    <div class="list-title col-1"><p>추천</p></div>
                </div>
                {% for article in articles %}
                <div class="row">
                    <div class="list-contents col-1"><p>{{ article.id }}</p></div>
                    <div class="list-contents col-2"><p>{{ article.category.category_name }}</p></div>
                    <div class="list-contents-title col-3">
                        <p>
                            <a href="{% url 'boardview' article.id %}">
                                {{ article.title }}
                                {% if article.reply_count > 0 %}
                                [{{ article.reply_count }}]
                                {% endif %}
                            </a>
                        </p>
                    </div>
                    <div class="list-contents col-2"><p>{{ article.user.last_name }}</p></div>
                    <div class="list-contents col-2"><p>{{ article.registered_date | date:"Y-m-d" }}</p></div>
                    <div class="list-contents col-1"><p>{{ article.view_count }}</p></div>
                    <div class="list-contents col-1"><p>{{ article.like_count }}</p></div>
                </div>
                {% empty %}
                <div class="row margin-10 center">
                    현재 등록된 게시물이 없습니다.
                </div>
                {% endfor %}
            {% endif %}
            </div>
        </div>
        <div class="height-100"></div>
        {% endblock %}
        ```

### write

- `board_write/<category>`
    - boardapp/views.py
        ```python
        @login_required
        def board_write_page(request, category):
            args={}
            
            board_category = BoardCategories.objects.get(category_code=category)
            args.update({"board_category":board_category})
            
            return render(request, 'board_write.html', args)
        ```
    - boardapp/templates/board_write.html
        ```html
        {% extends "base.html" %}

        {% block title %}{{ object.category.category }} - 게시물 작성{% endblock %}

        {% block script %}
        {% load static %}<script src="{% static 'boardapp/assets/js/boards.js' %}"></script>
        {% if user.username == "" %}
        <script>
            alert("잘못된 접근입니다.");
            location.href="{% url 'main' %}"
        </script>
        {% endif %}
        {% endblock %}

        {% block content %}
        <div class="row block-center board">
            <div class="col-12">
                <form id="write_form" action="{% url 'boardwriteres' %}" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="category_id" value="{{ board_category.id }}"./>
                    {% csrf_token %}
                    <div class="row">
                        <div class="col-12"><h4>{{ board_category.category_name }} - 게시물 작성</h4></div>
                    </div>
                    <div class="row border-top-line">
                        <div class="col-1 right"><p>작성자</p></div>
                        <div class="col-11 right"><p>{{ user.last_name }}</p></div>
                    </div>
                    <div class="row">
                        <div class="col-1 right"><p>제목</p></div>
                        <div class="col-11 right"><input type="text" name="title" id="title" class="form-width-90"/></div>
                    </div>
                    <div class="row height-400">
                        <div class="col-1 right"><p>내용</p></div>
                        <div class="col-11 right"><textarea name="content" id="content" class="form-width-90"></textarea></div>
                    </div>
                    <div class="row">
                        <div class="col-1 right"><p class="middle">이미지</p></div>
                        <div class="col-11 right"><input type="file" name="img_file" accept="image/gif, image/jpeg, image/png"/></div>
                    </div>
                    <div class="row">
                        <div class="col-12 center">
                            <input type="button" onclick="writeSend()" value="작성"/>
                            <input type="button" onclick="locaion.href='{% url 'boardlist' board_category.category_code %}'" value="취소"/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        {% endblock %}
        ```
    - boardapp/static/boardapp/assets/js/boards.js
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
        ```

- `board_write_res`
    - boardapp/views.py
        ```python
        @login_required
        def board_write_result(request):
            if request.method == "POST":
                title = request.POST['title']
                content = request.POST['content']
                category_id = request.POST['category_id']
                try:
                    img_file = request.FILES['img_file']
                except:
                    img_file = None
                    
            else:
                title = None
                
            args = {}
            
            try:
                category = BoardCategories.objects.get(id=category_id)
                if request.user and title and content and request.user.is_superuser >= category.authority:
                    article = Boards(category=category, user=request.user, title=title, content=content, image=img_file)
                    article.save()
                    
                    redirection_page = '/boardapp/board_list/' + category.category_code + '/'
                else:
                    redirection_page = '/boardapp/error/'
            except BaseException as e:
                print(e)
                redirection_page = '/boardapp/error/'
                
            return redirect(redirection_page)
        ```

### view

- `board_view/<int:pk>`
    - boardapp/views.py
        ```python
        class BoardView(DetailView):
            model = Boards
            template_name = 'board_view.html'
            
            def dispatch(self, request, pk):
                obj = self.get_object()
                if request.user != obj.user:
                    obj.view_count = obj.view_count + 1
                    obj.save()
                    
                # reply와 likes를 위해 미리 준비한다.
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
        {% endblock %}
        ```
    - boardapp/static/boardapp/assets/js/boards.js
        ```javascript
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
        ```

### delete

- `board_delete_res`
    - boardapp/views.py
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
                
                redirection_page = '/boardapp/board_list/' + article.category.category_code + '/'
            else:
                redirection_page = '/boardapp/error/'
                
            return redirect(redirection_page)
        ```

### modify

- `board_modify/<int:pk>`
    - boardapp/views.py
        ```python
        class BoardModifyView(DetailView):
            model = Boards
            template_name = 'board_modify.html'
        ```
    - boardapp/templates/board_modify.html
        ```html
        {% extends "base.html" %}

        {% block title %}{{ object.category.category_name}} - 게시물 수정 {% endblock %}

        {% block script %}
        {% load static %}<script src="{% static 'boardapp/assets/js/boards.js' %}"></script>
        {% endblock %}

        {% block content %}
        <div class="row block-center board">
            <div class="col-12">
                <form id="modify_form" action="{% url 'boardmodifyres' %}" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="id" value="{{ object.id }}"/>
                    <input type="hidden" name="referer" value="board"/>
                    {% csrf_token %}
                    <div class="row">
                        <div class="col-12"><h4>{{ object.category.category_name }} - 게시물 수정</h4></div>
                    </div>
                    <div class="row border-top-line">
                        <div class="col-1 right"><p>작성자</p></div>
                        <div class="col-11"><p>{{ user.last_name }}</p></div>
                    </div>
                    <div class="row border-top-line">
                        <div class="col-1 right"><p>작성일</p></div>
                        <div class="col-11"><p>{{ user.registered_date|date:"Y-m-d" }}</p></div>
                    </div>
                    <div class="row">
                        <div class="col-1 right"><p>제목</p></div>
                        <div class="col-11"><input type="text" name="title" id="title" class="form-width-90" value="{{ object.title }}"/></div>
                    </div>
                    <div class="row height-400">
                        <div class="col-1 right"><p class="middle">내용</p></div>
                        <div class="col-11"><textarea name="content" id="content" class="form-width-90">{{ object.content }}</textarea></div>
                    </div>
                    <div class="row">
                        <div class="col-1 right"><p class="middle">이미지</p></div>
                        <div class="col-11">
                            <div class="row">
                                <div class="col-12">현재 등록된 파일: {{ object.image.name }}</div>
                            </div>
                            <div class="row">
                                <div class="col-12"><input type="file" name="img_file" accept="image/gif, image/jpeg, image/png"/></div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 center">
                            <input type="button" onclick="modifySend()" value="수정"/>
                            <input type="button" onclick="location.href='{% url 'boardview' object.id %}'" value="취소"/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        {% endblock %}
        ```
    - boardapp/static/boardapp/assets/js/boards.js
        ```javascript
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
        ```

- `board_modify_res`
    - boardapp/views.py
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
                        
                        redirection_page = '/boardapp/board_view/' + article_id + '/'
                        
                else:
                    redirection_page = '/boardapp/error/'
            except:
                redirection_page = '/boardapp/error/'
            
            return redirect(redirection_page)
        ```

## base.html 수정

- 공지사항과 자유게시판을 다음과 같이 수정한다.

    ```html
    <div class="col-2 center sideline dark-link">
        <a href="{% url 'boardlist' 'notice' %}">공지사항</a>
    </div>
    <div class="col-2 center sideline dark-link">
        <a href="{% url 'boardlist' 'normal' %}">자유 게시판</a>
    </div>
    ```

## 테스트

- 로그인을 실시하고 자유롭게 게시글을 작성하며 테스트를 진행한다.