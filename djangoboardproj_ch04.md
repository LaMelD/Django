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

- static 파일과 media 파일

    - 각각의 파일의 위치를 settings.py에서 지정해준다.

        ```python
        STATIC_URL = '/static/'
        STATIC_ROOT = os.path.join(BASE_DIR, 'static')

        MEDIA_URL = '/media/'
        MEDIA_ROOT = os.path.join(BASE_DIR, 'media').replace('\\', '/')
        ```

- static 파일과 media 파일의 위치(URL, ROOT)를 지정해 주었다.
- 흩어져있는 static 파일을 지정한 URL로 복사하는 명령어는 다음과 같다

    ```
    (ve) $ ./manage.py collectstatic
    (ve) $ ls -al
    ```

- 확인하면 작업공간에 static 폴더가 생성된 것을 확인할 수 있다.

## MVC - MTV 패턴 :: css, js 파일 구성

- 앞으로 기본적으로 사용하게될 static 파일들은 다음과 같다

    - bootstrap.min.css
    - bootstrap.min.js
    - jquery-3.3.1.min.js

- 위의 파일을 wget으로 받아와서 `boardapp/static/boardapp/assets/css`, `boardapp/static/boardapp/assets/js`에 각각 옮겨 넣는다.

- 다음은 앞으로 사용할 custom css 파일이다. `boardapp/static/boardapp/assets/css`에 main.css로 저장한다.

    ```css
    html {
        position: relative;
        min-height: 100%;
        margin: 0;
    }
    body {
        min-height: 100%;
    }
    #container {
        min-width: 310px;
        max-width: 90%;
        margin: 0 auto;
        margin-bottom: 50px;
    }
    #footer {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
	    padding-top: 15px;
    }

    .center {
        text-align: center;
    }
    .right {
        text-align: right;
    }

    .form-width-90 {
        width: 90%;
    }
    .row {
        margin-left: 0px;
        margin-right: 0px;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .reply-reply {
        display: none;
    }

    .like-tag-1 {
        cursor: pointer;
        background: transparent;
    }
    .like-tag-2 {
        cursor: default;
        background: #DDDDFF;
    }
    ```
    - 더 추가될 가능성이 높다. 앞으로도 확인을 요한다.

- 위의 파일을 추가한 뒤에 다음 collectstatic 명령을 실행하여 static 파일을 모아준다.