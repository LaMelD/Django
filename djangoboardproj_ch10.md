# Django Boardapp project

## 댓글 웹페이지 구성

- 댓글은 대화형(비동기식)으로 처리된다.
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
    - boardapp/views.py
        ```python
        ```
    - boardapp/templates/board_comm_list.html
        ```html
        ```
    - boardapp/static/boardapp/assets/js/boards.js
        ```javascript
        ```

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