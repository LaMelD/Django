# Django Boardapp project

## django project start

- startproject

    ```
    (ve) $ django-admin startproject djangoproj
    (ve) $ cd djangoproj
    ```

- 장고 프로젝트가 생성되었다.
- 제대로 생성이 되었는지 확인하기 위해서 테스트 서버를 실행한다.

    ```
    (ve) $ ./manage.py runserver
    또는
    (ve) $ ./manage.py runserver 0.0.0.0:8000
    ```

- 여기서 CentOS가 아닌 다른 곳에서 테스트 접속을 원한다면...
    - djangoproj/settings.py 를 편집기로 연다.
    - `ALLOWED_HOSTS = ['*']`로 변경해준다.
    - 방화벽(firewalld) 설정을 했는지 껐는지 확인해야한다.

## 설정파일 settings.py

- djangoproj/settings.py 파일은 장고의 전반적인 설정을 다룬다.

    ```python
    import os

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    SECRET_KEY = '-f!h^6k&hu%hxb^eeu%0b9cw^p9(ro8at#bye)3*(e4)9@8@6_'

    DEBUG = True

    ALLOWED_HOSTS = ['*']

    INSTALLED_APPS = [
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
    ]

    MIDDLEWARE = [
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
    ]

    ROOT_URLCONF = 'djangoproj.urls'

    TEMPLATES = [
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'DIRS': [],
            'APP_DIRS': True,
            'OPTIONS': {
                'context_processors': [
                    'django.template.context_processors.debug',
                    'django.template.context_processors.request',
                    'django.contrib.auth.context_processors.auth',
                    'django.contrib.messages.context_processors.messages',
                ],
            },
        },
    ]

    WSGI_APPLICATION = 'djangoproj.wsgi.application'

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }

    AUTH_PASSWORD_VALIDATORS = [
        {
            'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
        },
    ]

    LANGUAGE_CODE = 'en-us'

    TIME_ZONE = 'UTC'

    USE_I18N = True

    USE_L10N = True

    USE_TZ = True

    STATIC_URL = '/static/'
    ```

- 설정 변경

    - 언어와 시간 변경

        ```python
        LANGUAGE_CODE = 'ko-kr'
        TIME_ZONE = 'Asia/Seoul'
        ```
    
    - 데이터베이스 변경
        - 기본 DB는 sqlites3로 되어있다.
        - 우리는 mysql을 사용할 것이므로 변경이 필요하다.

        ```python
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.mysql',
                'NAME': 'db이름',
                'USER': '사용자',
                'PASSWORD': '암호',
                'PORT': '3306',
                'HOST': 'localhost',
                'OPTIONS': {
                    'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
                },
            }
        }
        ```
        - django와 같은 곳에 db를 설치했으므로 localhost로 진행한다.
        - db 이름, 사용자, 암호를 각각 입력한다.
        - 예시
            ```python
            DATABASES = {
                'default': {
                    'ENGINE': 'django.db.backends.mysql',
                    'NAME': 'project',
                    'USER': 'test',
                    'PASSWORD': 'qwer1234',
                    'PORT': '3306',
                    'HOST': 'localhost',
                    'OPTIONS': {
                        'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
                    },
                }
            }
            ```
        - 데이터베이스를 지정했으니 mysql에 접속해서 database를 생성한다.

            ```
            mysql> create database project;
            ```