# Django Boardapp project

## MVC - MTV 패턴 :: Models

### Models :: Database 구성

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

- 어플리케이션 생성 및 settings.py에 앱 등록

    ```
    (ve) $ ./manage.py startapp boardapp
    (ve) $ vi djangoboard/settings.py
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

    - 