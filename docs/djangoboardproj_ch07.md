# Django Boardapp project

## 회원관리 웹페이지 구성

- 로그인
- 로그아웃
- 회원가입
- 비밀번호 변경, 비밀번호 변경 완료

## urls.py

- boardapp/urls.py

    ```python
    # urlpatterns에 추가한다.
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('password_change/', auth_views.PasswordChangeView.as_view(template_name='password_change.html'), name='password_change'),
    path('password_change_done/', auth_views.PasswordChangeDoneView.as_view(template_name='password_change_done.html'), name='password_change_done'),
    path('user_register/', user_register_page, name='register'),
    path('user_register_idcheck/', user_register_idcheck, name='registeridcheck'),
    path('user_register_res/', user_register_result, name='registerres'),
    path('user_register_completed/', user_register_completed, name='registercompleted'),
    ```

### 회원가입 :: register

- user_register
    - boardapp/views.py
        ```python
        def user_register_page(request):
            return render(request, 'user_register.html')
        ```
    - boardapp/templates/user_register.html
        ```html
        {% extends "base.html" %}

        {% block title %}회원가입{% endblock %}

        {% block script %}
        {% load static %}<script src="{% static 'boardapp/assets/js/user.js' %}"></script>
        {% endblock %}

        {% block content %}
        <div class="row block-center">
            <div class="card-box col-6">
                <form id="register_form" action="/boardapp/user_register_res/" method="post">
                {% csrf_token %}
                    <input type="hidden" name="phone" id="phone" value=""/>
                    <input type="hidden" name="email" id="email" value=""/>
                    <div class="row">
                        <div class="col-12"><h2>회원가입</h2></div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            ID:
                            <span class="margin-left-10">
                                <input type="text" name="username" id="username" value="" size="8"/>
                                <input type="button" value="중복확인" onclick="idCheck()"/>
                                <span id="idcheck-result"></span>
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            Password:
                            <span class="margin-left-10">
                                <input type="password" name="password" id="password" value="" size="8"/>
                            </span>
                            <br/>
                            <span style="font-size: 0.7em">
                                * 비밀번호는 8글자 이상 입력해 주셔야 합니다.
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            Password 확인:
                            <span class="margin-left-10">
                                <input type="password" id="password_check" value="" size="8"/>
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            이름:
                            <span class="margin-left-10">
                                <input type="test" name="last_name" id="last_name" value="" size="8"/>
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            E-mail:
                            <span class="margin-left-10">
                                <input type="test" name="email_id" id="email_id" value="" size="8"/>
                                @ <input type="text" id="email_domain" value="" size="8"/>
                                <select id="email_selection" onchange="changeEmailDomain()">
                                    <option value="" selected="selected">--선택하세요--</option>
                                    <option value="naver.com">naver.com</option>
                                    <option value="hanmail.net">hanmail.net</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="me.com">me.com</option>
                                </select>
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            전화번호:
                            <span class="margin-left-10">
                                <input type="text" id="phone1" value="" size="3"/> - 
                                <input type="text" id="phone2" value="" size="4"/> - 
                                <input type="text" id="phone3" value="" size="4"/>
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            생년월일:
                            <span class="margin-left-10">
                                <input type="test" name="birth_year" id="birth_year" value="" size="4"/> 년
                                <select name="birth_month" id="birth_month">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select> 월
                                <input type="text" name="birth_day" id="birth_day" value="" size="2"/> 일
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 center">
                            <input type="button" value="회원가입" onclick="userRegister()"/>
                            <input type="button" value="취소" onclick="cancelUserRegister()"/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        {% endblock %}
        ```
    - boardapp/static/boardapp/assets/js/user.js
        ```javascript
        function idCheck() {
            if (!$('#username').val()) {
                alert("ID를 입력해 주시기 바랍니다.");
                return;
            }

            $.ajax({
                type: "POST",
                url: "/boardapp/user_register_idcheck/",
                data: {
                    'username': $('#username').val(),
                    'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
                },
                success: function(response) {
                    $('#idcheck-result').html(response);
                },
            });
        }
        function changeEmailDomain() {
            $('#email_domain').val($('#email_selection').val());
        }

        function cancelUserRegister() {
            var result = confirm("회원가입을 취소하시겠습니까?");

            if (result) {
                $(location).attr('href', '/boardapp/login');
            }
        }

        function userRegister() {
            if (!$('#username').val()) {
                alert("아이디를 입력해 주시기 바랍니다.");
                return;
            }
            if (!$('#IDCheckResult').val()) {
                alert("ID 중복체크를 먼저 진행해 주시기 바랍니다.");
                return;
            }
            if (!$('#password').val()) {
                alert("비밀번호를 입력해 주시기 바랍니다.");
                return;
            }
            if ($('#password').val() != $('#password_check').val()) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }
            if (!$('#last_name').val()) {
                alert("이름을 입력해 주시기 바랍니다.");
                return;
            }
            if (!$('#phone1').val() || !$('#phone2').val() || !$('#phone3').val()) {
                alert("전화번호를 올바르게 입력해 주시기 바랍니다.");
                return;
            }
            if (!$('#email_id').val() || !$('#email_domain').val()) {
                alert("E-mail 주소를 올바르게 입력해 주시기 바랍니다.");
                return;
            }
            if (!$('#birth_year').val() || !$('#birth_month').val() || !$('#birth_day').val()) {
                alert("생년월일을 올바르게 입력해 주시기 바랍니다.");
                return;
            }

            $('#phone').val($('#phone1').val() + "-" + $('#phone2').val() + "-" + $('#phone3').val());
            $('#email').val($('#email_id').val() + "@" + $('#email_domain').val());

            $('#register_form').submit();
        }
        ```

- user_register_idcheck
    - boardapp/views.py
        ```python
        def user_register_idcheck(request):
            if request.method == "POST":
                username = request.POST['username']
            else:
                username = ''
                
            idObject = User.objects.filter(username__exact=username)
            idCount = idObject.count()
            
            if idCount > 0:
                msg = "<font color='red'>이미 존재하는 ID입니다.</font><input type='hidden' name='IDCheckResult' id='IDCheckResult' value=0/>"
            else:
                msg = "<font color='blue'>사용할 수 있는 ID입니다.</font><input type='hidden' name='IDCheckResult' id='IDCheckResult' value=1/>"
            
            return HttpResponse(msg)
        ```

- user_register_res
    - boardapp/views.py
        ```python
        def user_register_result(request):
            if request.method == "POST":
                username = request.POST['username']
                password = request.POST['password']
                last_name = request.POST['last_name']
                phone = request.POST['phone']
                email = request.POST['email']
                birth_year = request.POST['birth_year']
                birth_month = request.POST['birth_month']
                birth_day = request.POST['birth_day']
            
            try:
                if username and User.objects.filter(username__exact=username).count() == 0:
                    date_of_birth = datetime(int(birth_year), int(birth_month), int(birth_day))
                    user = User.objects.create_user(username, password, last_name, email, phone, date_of_birth)
                    redirection_page = '/boardapp/user_register_completed/'
                else:
                    redirection_page = '/boardapp/error/'
            except BaseException as e:
                print(e)
                redirection_page = '/boardapp/error/'
                
            return redirect(redirection_page)
        ```

- user_register_complete
    - boardapp/views.py
        ```python
        def user_register_completed(request):
            return render(request, 'user_register_completed_page.html')
        ```
    - boardapp/templates/user_register_completed_page.html
        ```html
        {% extends "base.html" %}

        {% block title %}회원가입 완료{% endblock %}

        {% block script %}
        {% endblock %}

        {% block content %}
        <div style="height: 70px;"></div>
        <div class="row block-center">
            <div class="card-box col-8">
                <div class="row">
                    <div class="col-12">
                        <h3 class="margin-bottom-10">
                            회원가입이 완료되었습니다.
                        </h3>
                        <h3 class="margin-bottom-10">
                            AWS / Django Web Application의 서비스를 이용할 수 있습니다.
                        </h3>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 center">
                        <input type="button" value="로그인" onclick="location.href='{% url 'login' %}'" />
                        <input type="button" value="메인화면" onclick="location.href='{% url 'main' %}'" />
                    </div>
                </div>
            </div>
        </div>
        {% endblock %}
        ```

### login

- LoginView
    - LoginView는 django에서 지원하는 auth의 views를 사용한다.
    - urls.py에서 template_name을 login.html로 지정하였다.
    - boardapp/templates/login.html
        ```html
        {% extends "base.html" %}

        {% block title %}Login{% endblock %}

        {% block script %}
        {% load static %}<script src="{% static 'boardapp/assets/js/login.js' %}"></script>
        {% endblock %}

        {% block content %}
        {% if form.errors %}
        <script>alert("ID와 비밀번호를 올바르게 입력하십시오");</script>
        {% endif %}
        <div style="height: 70px;"></div>
        <div class="row block-center">
            <div class="card-box col-12">
                <form id="login_form" action="." method="POST">
                    {% csrf_token %}
                    <div class="row">
                        <div class="col-12 center"><h2>Login</h2></div>
                    </div>
                    <div class="row">
                        <div class="col-6 right">ID</div>
                        <div class="ml-1 col-5">
                            <input type="text" name="username" id="username" size="12"/>
                        </div>
                    </div>
                    <div class = "row">
                        <div class="col-6 right">PASSWORD</div>
                        <div class="ml-1 col-5">
                            <input type="password" name="password" id="password" size="12"/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 center">
                            <input type="button" value="로그인" onclick="login()"/>
                            <input type="button" value="회원가입" onclick="location.href='{% url 'register' %}'"/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 center">
                            <h4>아이디가 없으십니까? 회원가입을 해 주시기 바랍니다!</h4>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        {% endblock %}
        ```
    - boardapp/static/boardapp/assets/js/login.js
        ```javascript
        $(document).ready(function() {
            $('input').keydown(function(e) {
                if (e.which == 13) {
                    $('form').submit();
                }
            });
        });

        function login() {
            if (!$('#username').val()) {
                alert("아이디를 입력해 주시기 바랍니다.");
                return;
            }
            if (!$('#password').val()) {
                alert("비밀번호를 입력해 주시기 바랍니다.");
                return;
            }
            
            $('#login_form').submit();
        }
        ```

### logout

- LogoutView
    - LogoutView는 django에서 지원하는 auth의 views를 사용한다.
    - template는 따로 지정하지 않았다.

### modify

- PasswordChangeView
    - PasswordChangeView는 django에서 지원하는 auth의 views를 사용한다.
    - urls.py에서 template_name을 password_change.html로 지정하였다.
    - boardapp/templates/password_change.html
        ```html
        {% extends "base.html" %}

        {% block title %}회원정보 조회{% endblock %}

        {% block script %}
        {% load static %}<script src="{% static 'boardapp/assets/js/user.js' %}"></script>
        {% endblock %}

        {% block content %}
        {% if form.errors %}
        <script>alert("비밀번호 변경이 잘못되었습니다. 올바르게 입력해 주시기 바랍니다.")</script>
        {% endif %}
        <div class="row block-center">
            <div class="card-box col-6">
                <form id="password_change_form" action="." method="POST">
                    {% csrf_token %}
                    <div class="row">
                        <div class="col-12"><h2>회원정보 조회 / 비밀번호 변경</h2></div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            ID: <span class="margin-left-10">{{ user.username }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            {{ form.old_password.label_tag }}
                            <span class="margin-left-10">{{ form.old_password }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            {{ form.new_password1.label_tag }}
                            <span class="margin-left-10">{{ form.new_password1 }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            {{ form.new_password2.label_tag }}
                            <span class="margin-left-10">{{ form.new_password2 }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            이름: <span class="margin-left-10">{{ user.last_name }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            E-mail: <span class="margin-left-10">{{ user.email }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            전화번호: <span class="margin-left-10">{{ user.phone }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="ml-1 col-11">
                            생년월일: <span class="margin-left-10">{{ user.date_of_birth | date:"Y년 n월 j일" }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 center">
                            <input type="button" value="비밀번호 변경" onclick="changePassword()"/>
                            <input type="button" value="이전화면" onclick="window.history.back()"/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        {% endblock %}
        ```
    - boardapp/static/boardapp/assets/js/user.js
        ```javascript
        function changePassword() {
            if (!$('#id_old_password').val()) {
                alert("비밀번호를 입력해 주시기 바랍니다.");
                return;
            }
            if ($('#id_new_password1').val() != $('#id_new_password2').val()) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }
            
            $('#password_change_form').submit();
        }
        ```

- PasswordChangeDoneView
    - PasswordChangeDoneView는 django에서 지원하는 auth의 views를 사용한다.
    - urls.py에서 template_name을 password_change_done.html로 지정하였다.
    - boardapp/templates/password_change_done.html
        ```html
        <script>
            alert("비밀번호 변경이 완료되었습니다.");
            location.href="{% url 'main' %}"
        </script>
        ```

## settings.py 변경

- django에서 지원하는 auth를 사용하였으므로 settings.py에 명시해 주어야 한다.

    ```python
    LOGIN_REDIRECT_URL = '/boardapp/'
    LOGOUT_REDIRECT_URL = '/boardapp/'
    ```

## 테스트

- base.html에서 완성된 부분을 #에서 name에 맞게 변경하고 runserver를 실시한다.
- 회원가입을 테스트한다.
    - id : admin
    - 이름 : administrator
    - email : admin@admin.com
- 앞으로 관리자 계정이 필요하므로 mysql에 접속하여 해당 user의 컬럼을 변경
    - is_superuser = 1
    - is_staff = 1
- SQL : update auth_user set is_superuser = 1, is_staff = 1 where username = 'admin';
- admin 페이지에 접속하여 로그인을 테스트한다.