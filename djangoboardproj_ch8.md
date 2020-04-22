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
    - boardapp/templates/
        ```html
        ```
    - boardapp/static/boardapp/assets/js/
        ```javascript
        ```

### write

- `board_write/<category>`
    - boardapp/views.py
        ```python
        ```
    - boardapp/templates/
        ```html
        ```
    - boardapp/static/boardapp/assets/js/
        ```javascript
        ```
- `board_write_res`
    - boardapp/views.py
        ```python
        ```
    - boardapp/templates/
        ```html
        ```
    - boardapp/static/boardapp/assets/js/
        ```javascript
        ```

### view

- `board_view/<int:pk>`
    - boardapp/views.py
        ```python
        ```
    - boardapp/templates/
        ```html
        ```
    - boardapp/static/boardapp/assets/js/
        ```javascript
        ```

### delete

- `board_delete_res`
    - boardapp/views.py
        ```python
        ```
    - boardapp/templates/
        ```html
        ```
    - boardapp/static/boardapp/assets/js/
        ```javascript
        ```

### modify

- `board_modify/<int:pk>`
    - boardapp/views.py
        ```python
        ```
    - boardapp/templates/
        ```html
        ```
    - boardapp/static/boardapp/assets/js/
        ```javascript
        ```
- `board_modify_res`
    - boardapp/views.py
        ```python
        ```
    - boardapp/templates/
        ```html
        ```
    - boardapp/static/boardapp/assets/js/
        ```javascript
        ```