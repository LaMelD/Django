# Django Boardapp project

- CentOS 7
- mysql 5.7
- python 3.6.8
- pip3 9.0.3
- django 2.1

## CentOS 7 환경 설정

- CentOS 7 업데이트와 python3 설치

    ```
    $ yum update -y
    $ yum upgrade -y
    $ yum install python3 -y
    $ yum install python3-pip -y
    ```

- mysql 설치

    ```
    $ wget https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm
    $ sudo rpm -ivh mysql57-community-release-el7-11.noarch.rpm
    $ sudo yum install mysql-server
    $ systemctl start mysql
    ```

- mysql 임시 비밀번호와 비밀번호 변경
    - 임시 비밀번호를 입력하고
    - 변경할 비밀번호를 입력하고
    - 나머지는 `y`로 처리한다.

    ```
    $ cat /var/log/mysqld.log | grep root@localhost
    $ mysql_secure_installation
    ```

- 접속 확인

    ```
    $ mysql -u root -p
    # 비밀번호 입력
    ```

- 한글 입력 출력 설정
    - mysql을 실행하여 아래와 같이 실행한다.
    
        ```
        mysql> show variables like 'c%';
        ```
    
    - 몇몇 설정이 latin1으로 되어있는 것을 확인할 수있다.
    - 테이블을 수정하면 일시적으로 한글 입력을 확인할 수 있다.
    - 영구적으로 적용하기 위해 config파일을 수정할 필요가 있다.

    ```
    $ vi /etc/my.cnf
    ```

    - 아래와 같이 추가한다.

        ```
        [mysqld]
        character-set-server = utf8
        [client]
        default-character-set = utf8
        [mysql]
        default-character-set = utf8
        ```
    
    - mysql 재시작 및 확인

        ```
        $ systemctl restart mysqld
        $ mysql -u root -p
        mysql> show variables like 'c%';
        mysql> status;
        ```

## 개발환경 설정

- virtualenv 환경

    ```
    $ pip3 install --user virtualenv
    $ source ~/.bash_profile
    $ virtualenv ve
    ```

- virtualenv 활성화 비활성화

    ```
    $ source ve/bin/activate
    (ve) $ deactivate
    ```

- django 2.1 설치

    ```
    (ve) $ pip install django==2.1
    ```

- virtualenv 환경에 설치된 목록 확인

    ```
    (ve) $ pip freeze
    ```