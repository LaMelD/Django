# Django Boardapp project

## MVC - MTV 패턴 :: Database 구성

- 모델을 구성하기에 앞서서 django에서 지원하는 admin을 사용하기 위해 기본적인 database를 받아온다.

    ```
    (ve) $ ./manage.py makemigrations
    (ve) $ ./manage.py migrate
    ```

- 데이터 베이스 수정 및 생성

    ```sql
    # 유저 테이블 수정
    ALTER TABLE auth_user
    ADD COLUMN phone VARCHAR(45) NOT NULL AFTER date_joined,
    ADD COLUMN date_of_birth DATETIME NOT NULL AFTER phone,
    CHANGE COLUMN date_joined date_joined DATETIME NOT NULL AFTER email,
    CHANGE COLUMN first_name first_name VARCHAR(30) NULL AFTER is_active,
    CHANGE COLUMN is_staff is_staff TINYINT(1) NULL,
    CHANGE COLUMN is_active is_active TINYINT(1) NULL;

    # 게시물 테이블 생성
    ## board_categories
    create table board_categories(
        id int(10) not null auto_increment,
        category_type varchar(45) not null default 'Normal',
        category_code varchar(100) not null,
        category_name varchar(100) not null,
        category_desc varchar(200) not null,
        list_count int(10) default '20',
        authority int(1) default '0',
        creation_date datetime default current_timestamp,
        last_update_date datetime default null,
        primary key(id)
    )engine=InnoDB default CHARSET=utf8;

    ## boards
    create table boards(
        id int(10) not null auto_increment,
        category_id int(10) not null,
        user_id int(10) not null,
        title varchar(300) not null,
        content text not null,
        registered_date datetime default current_timestamp,
        last_update_date datetime default null,
        view_count int(10) default '0',
        image varchar(255) default null,
        primary key(id),
        key board_category_fk_idx(category_id),
        key board_user_fk_idx(user_id),
        constraint board_category_fk foreign key(category_id) references board_categories(id) on delete no action on update no action,
        constraint board_user_fk foreign key(user_id) references auth_user(id) on delete no action on update no action
    )engine=InnoDB default CHARSET=utf8;

    ## board_replies
    create table board_replies(
        id int(10) not null auto_increment,
        article_id int(10) not null,
        user_id int(10) not null,
        `level` tinyint(1) default '1',
        content text not null,
        reference_reply_id int(10) default '0',
        registered_date datetime default current_timestamp,
        last_update_date datetime default null,
        primary key(id),
        key user_reply_fk_idx(user_id),
        key article_reply_fk_idx(article_id),
        constraint article_reply_fk foreign key(article_id) references boards(id) on delete no action on update no action,
        constraint user_reply_fk foreign key(user_id) references auth_user(id) on delete no action on update no action
    )engine=InnoDB default CHARSET=utf8;

    ## board_likes
    create table board_likes(
        id int(10) not null auto_increment,
        article_id int(10) not null,
        user_id int(11) not null,
        registered_date datetime default current_timestamp,
        primary key(id),
        key like_article_fk_idx(article_id),
        key like_user_fk_idx(user_id),
        constraint like_article_fk foreign key(article_id) references boards(id) on delete no action on update no action,
        constraint like_user_fk foreign key(user_id) references auth_user(id) on delete no action on update no action
    )engine=InnoDB default CHARSET=utf8;
    ```

- 어플리케이션 생성 및 settings.py 수정

    ```
    (ve) $ ./manage.py startapp boardapp
    (ve) $ vi djangoproj/settings.py
    ```

    - 아래와 같이 INSTALLED_APPS에 생성한 어플리케이션을 등록한다.

        ```python
        INSTALLED_APPS = [
            'django.contrib.admin',
            'django.contrib.auth',
            'django.contrib.contenttypes',
            'django.contrib.sessions',
            'django.contrib.messages',
            'django.contrib.staticfiles',
            'boardapp.apps.BoardappConfig',
        ]
        ```

    - django의 기본 Auth_user를 사용하기위해 settings.py에 추가한다.

        ```python
        AUTH_USER_MODEL = 'boardapp.user'
        ```

## MVC - MTV 패턴 :: Models 구성

- boardapp에서 사용할 table을 만들었으니 model에 추가해준다.
- 기본적인 틀을 가져오기 위해서 inspectdb를 사용한다.

    ```
    (ve) $ ./manage.py inspectdb > boardapp/models.py
    ```

- 모델을 받아왔으나 앞으로 사용할 모델에 적합하게 수정한다.

    ```python
    from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
    from django.db import models
    from django.utils import timezone

    class UserManager(BaseUserManager):
        def create_user(self,
                    username,
                    password,
                    last_name,
                    email,
                    phone,
                    date_of_birth):
            user = self.model(
                username=username,
                last_name=last_name,
                email=self.normalize_email(email),
                phone=phone,
                date_of_birth=date_of_birth,
                date_joined=timezone.now(),
                is_superuser=0,
                is_staff=0,
                is_active=1
            )
            user.set_password(password)
            user.save(using=self._db)
            return user

        def create_superuser(self,
                            username,
                            last_name,
                            email,
                            phone,
                            date_of_birth,
                            password):
            user = self.create_user(
                username=username,
                password=password,
                last_name=last_name,
                email=email,
                phone=phone,
                date_of_birth=date_of_birth
            )
            user.is_superuser = 1
            user.is_staff = 1
            user.save(using=self._db)
            return user


    class User(AbstractBaseUser, PermissionsMixin):
        password = models.CharField(max_length=128)
        username = models.CharField(unique=True, max_length=150)
        is_superuser = models.IntegerField()
        last_name = models.CharField(max_length=150)
        phone = models.CharField(max_length=45)
        email = models.CharField(max_length=254)
        date_of_birth = models.DateTimeField()
        date_joined = models.DateTimeField()
        last_login = models.DateTimeField(blank=True, null=True)
        is_staff = models.IntegerField(blank=True, null=True)
        is_active = models.IntegerField(blank=True, null=True)
        first_name = models.CharField(max_length=30, blank=True, null=True)

        objects = UserManager()

        USERNAME_FIELD = 'username'
        REQUIRED_FIELD = ['last_name', 'phone', 'email', 'date_of_birth']

        def has_perm(self, perm, obj=None):
            return True

        def has_module_perms(self, app_lable):
            return True

        class Meta:
            db_table = 'auth_user'

    class BoardCategories(models.Model):
        category_type = models.CharField(max_length=45)
        category_code = models.CharField(max_length=100)
        category_name = models.CharField(max_length=100)
        category_desc = models.CharField(max_length=200)
        list_count = models.IntegerField(blank=True, null=True)
        authority = models.IntegerField(blank=True, null=True)
        creation_date = models.DateTimeField(default=timezone.now)
        last_update_date = models.DateTimeField(default=timezone.now)
        
        def __str__(self):
            return '%s (%s)' % (self.category_name, self.category_code)

        class Meta:
            managed = False
            db_table = 'board_categories'

    class Boards(models.Model):
        category = models.ForeignKey(BoardCategories, models.DO_NOTHING)
        user = models.ForeignKey(User, models.DO_NOTHING)
        title = models.CharField(max_length=300)
        content = models.TextField()
        registered_date = models.DateTimeField(default=timezone.now)
        last_update_date = models.DateTimeField(default=timezone.now)
        view_count = models.IntegerField(blank=True, default=0)
        image = models.ImageField(upload_to="images/%Y/%m/%d", blank=True)
        
        def __str__(self):
            return '[%d] %.40s' % (self.id, self.title)

        class Meta:
            managed = False
            db_table = 'boards'

    class BoardReplies(models.Model):
        article = models.ForeignKey(Boards, models.DO_NOTHING)
        user = models.ForeignKey(User, models.DO_NOTHING)
        level = models.IntegerField(blank=True, null=True)
        content = models.TextField()
        reference_reply_id = models.IntegerField(blank=True, null=True)
        registered_date = models.DateTimeField(default=timezone.now)
        last_update_date = models.DateTimeField(default=timezone.now)
        
        def __str__(self):
            return '[%d] %.40s - [%d] %.40s' % (self.article.id, self.article.title, self.id, self.content)

        class Meta:
            managed = False
            db_table = 'board_replies'

    class BoardLikes(models.Model):
        article = models.ForeignKey(Boards, models.DO_NOTHING)
        user = models.ForeignKey(User, models.DO_NOTHING)
        registered_date = models.DateTimeField(default=timezone.now)
        
        def __str__(self):
            return '[%d] %.40s - %s' % (self.article.id, self.article.title, self.user.last_name)

        class Meta:
            managed = False
            db_table = 'board_likes'
    ```