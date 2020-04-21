# Django Boardapp project

## MVC - MTV 패턴 :: django 어플리케이션 흐름

- urls.py에 등록되어 있는 url을 따라간다.

- urls.py에 특정 url에 접근 했을 때 동작할 행동을 지정한다.

- 지정한 동작을 views.py에 def, class로 만들어 행동을 이행시킨다.

- 필요하다면 models.py에 접근하여 만들어 놓은 모델을 사용한다.

## MVC - MTV 패턴 :: urls.py 작성

- `djangoboard/urls.py`

    ```python
    from django.conf.urls.static import static
    from django.conf import settings
    from django.contrib import admin
    from django.urls import include, path

    urlpatterns = [
        path('admin/', admin.site.urls),
        path('boardapp/', include('boardapp.urls')),
    ]

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    ```

- `boardapp/urls.py`

    ```python
    from django.conf.urls.static import static
    from django.conf import settings
    from django.urls import path
    from django.contrib.auth import views as auth_views
    from boardapp.views import *

    urlpatterns = [
        path('', main_page, name='main'),
    ]

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    ```

## MVC - MTV 패턴 :: 테스트 views.py 작성

- `boardapp/views.py` 앞으로 사용될 모듈을 모두 import에 넣어줬다.

    ```python
    from django.shortcuts import render, redirect
    from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
    from boardapp.models import *
    from datetime import datetime
    from django.utils import timezone
    import math
    from django.db.models import Count
    from django.core.paginator import Paginator
    from django.contrib.auth.decorators import login_required
    from django.views.generic import DetailView

    def main_page(request):
        return HttpResponse("<h2>hi</h2>")
    ```

    - `ip:8000/boardapp/`에 접속하면 `hi`라는 문자가 보이는 것을 확인할 수 있다.

- 이제는 template를 사용하여 Page를 보이게 할 것이다.

- `boardapp/views.py`

    ```python
    def main_page(request):
        return render(request, 'main.html')
    ```

- runserver로 작성한 내용을 확인한다.

- `boardapp/templates/` 디렉토리를 생성한다.
- `boardapp/templates/main.html`

    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf8">
            <title>타이틀</title>
        </head>
        <body>
            <h1>template로 작성되었습니다.</h1>
        </body>
    </html>
    ```

- runserver로 작성한 내용을 확인한다.

하이 test code
