# Django Boardapp project

## MVC - MTV 패턴 :: admin 페이지 사용

- admin 페이지를 django에서 지원하는 페이지를 상속받아 사용할 것이다.
- boardapp/admin.py를 수정한다.

    ```python
    from django.contrib import admin
    from boardapp.models import *

    admin.site.register(Boards)
    admin.site.register(BoardCategories)
    admin.site.register(BoardReplies)
    admin.site.register(BoardLikes)
    ```

## MVC - MTV 패턴 :: static, media의 위치

- collectstatic 설명과 settings.py의 static, media 설명