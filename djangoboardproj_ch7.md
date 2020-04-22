# Django Boardapp project

## 회원관리 웹페이지 구성

- 로그인
- 로그아웃
- 회원가입
- 비밀번호 변경, 비밀번호 변경 완료

## urls.py

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

#### views.py

```python
```

#### templates :: login.html

```html
```

#### static/boardapp/assets/js/user.js

```javascript
```