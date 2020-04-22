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