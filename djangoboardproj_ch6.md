# Django Boardapp project

## base.html 작성과 main 페이지 작성

### base.html

- 거의 모든 template의 기반이 되는 `base.html`

- `boardapp/templates/base.html`

    ```html
    <!DOCTYPE html>
    <html lang="KO">
        <head>
            <title>{% block title %}AWS / Django Web Application{% endblock %}</title>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            {% load static %}
            <link rel="stylesheet" href="{% static 'boardapp/assets/css/bootstrap.min.css' %}"/>
            <link rel="stylesheet" href="{% static 'boardapp/assets/css/main.css' %}"/>
            <script src="{% static 'boardapp/assets/js/jquery-3.3.1.min.js' %}"></script>
            <script src="{% static 'boardapp/assets/js/bootstrap.min.js' %}"></script>        
            {% block script %}{% endblock %}
        </head>
        <body>
            <div id="header">
                <div class="logo">
                    <div class="row bg-dark">
                        <div class="col-8 logo-link dark-link">
                            <a href="{% url 'main' %}">AWS / Django Web Application</a>
                        </div>
                        <div class="col-4 center member-link dark-link bg-black">
                        {% if user.username %}
                            <a href="{% url 'password_change' %}">{{ user.last_name }} 님</a> /
                            <a href="{% url 'logout' %}">로그아웃</a>
                        {% else %}
                            <a href="{% url 'login' %}">로그인</a> /
                            <a href="{% url 'register' %}">회원가입</a>
                        {% endif %}
                        </div>
                    </div>
                </div>
                <div class="menu">
                    <div class="row bg-dark">
                        <div class="col-2 center sideline dark-link">
                            <a href="{% url 'main' %}">HOME</a>
                        </div>
                        <div class="col-2 center sideline dark-link">
                            <a href="{% url 'introduce' %}">소개</a>
                        </div>
                        <div class="col-2 center sideline dark-link">
                            <a href="{% url 'boardlist' 'notice' %}">공지사항</a>
                        </div>
                        <div class="col-2 center sideline dark-link">
                            <a href="{% url 'boardlist' 'test' %}">자유 게시판</a>
                        </div>
                        <div class="col-2 center sideline dark-link">
                            <a href="{% url 'commlist' 'comm' %}">대화형 게시판</a>
                        </div>
                        <div class="col-2 center sideline">&nbsp;</div>
                    </div>
                </div>
            </div>
            <div id="container">
                {% block content %}{% endblock %}
            </div>
            <div id="footer">
                <div id="row">
                    <div class="col-12 center">Copyright by Digitalbooks / <a href="mailto:mail">Contact Us</a></div>
                </div>
            </div>
        </body>
    </html>
    ```

    - urls.py에 등록되지 않은 url은 '#'으로 변경한다.
    - url을 추가할 때 마다 원래의 base.html을 업데이트 해준다.

    ```html
    <!DOCTYPE html>
    <html lang="KO">
        <head>
            <title>{% block title %}AWS / Django Web Application{% endblock %}</title>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            {% load static %}
            <link rel="stylesheet" href="{% static 'boardapp/assets/css/bootstrap.min.css' %}"/>
            <link rel="stylesheet" href="{% static 'boardapp/assets/css/main.css' %}"/>
            <script src="{% static 'boardapp/assets/js/jquery-3.3.1.min.js' %}"></script>
            <script src="{% static 'boardapp/assets/js/bootstrap.min.js' %}"></script>        
            {% block script %}{% endblock %}
        </head>
        <body>
            <div id="header">
                <div class="logo">
                    <div class="row bg-dark">
                        <div class="col-8 logo-link dark-link">
                            <a href="{% url 'main' %}">AWS / Django Web Application</a>
                        </div>
                        <div class="col-4 center member-link dark-link bg-black">
                        {% if user.username %}
                            <a href="#">{{ user.last_name }} 님</a> /
                            <a href="#">로그아웃</a>
                        {% else %}
                            <a href="#">로그인</a> /
                            <a href="#">회원가입</a>
                        {% endif %}
                        </div>
                    </div>
                </div>
                <div class="menu">
                    <div class="row bg-dark">
                        <div class="col-2 center sideline dark-link">
                            <a href="{% url 'main' %}">HOME</a>
                        </div>
                        <div class="col-2 center sideline dark-link">
                            <a href="#">소개</a>
                        </div>
                        <div class="col-2 center sideline dark-link">
                            <a href="#">공지사항</a>
                        </div>
                        <div class="col-2 center sideline dark-link">
                            <a href="#">자유 게시판</a>
                        </div>
                        <div class="col-2 center sideline dark-link">
                            <a href="#">대화형 게시판</a>
                        </div>
                        <div class="col-2 center sideline">&nbsp;</div>
                    </div>
                </div>
            </div>
            <div id="container">
                {% block content %}{% endblock %}
            </div>
            <div id="footer">
                <div id="row">
                    <div class="col-12 center">Copyright by Digitalbooks / <a href="mailto:mail">Contact Us</a></div>
                </div>
            </div>
        </body>
    </html>
    ```

### main page

#### urls.py

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

#### views.py

- `boardapp/views.py`

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
        return render(request, 'main.html')
    ```

#### template - main.html

- `boardapp/main.html`

    ```html
    {% extends "base.html" %}

    {% block title %} Main {% endblock %}

    {% block script %}
    {% endblock %}

    {% block content %}
    <div class="row block-center">
        <div class="col-12 center">
            <h1>Welcome to AWS Django Board!</h1>
        </div>
    </div>
    {% endblock %}
    ```

마지막 로컬 테스트 