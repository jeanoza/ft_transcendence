This is a boiler plate to use generally at my futur web application.

## Stacks

- Frontend: React JS, Next JS

- Backend: Node JS, Nest JS

- Database: PostgreSQL

- Docker

## Features

- Frontend:

  - [x] login btn => change dynamically ('login' -> 'Hello USER_NAME')

  - [x] auth page for sign-up/sign-in

  - [x] request to server

  - [x] auth(via cookie)

  - [x] 42 auth via cookie

  - [ ] to see how to protect AuthUrl in authForm instead of use Link href

  - [x] Note page implement

    - [x] All note(/note)

    - [x] Create note(/note/create)

    - [x] note(/note/:id)

    - [x] divide FormField => InputField(FormField), TextareaField

    - [x] redirect if no accessToken

  - [x] Chat page

  - [ ] userList(socket) have to be updated when user refresh page
        => it will be resolved when 'userList' event returns user list saved in db

  - [ ] Modal

    - [ ] Generic

    - [ ] Join room (roomname, password) => if password? private : public

- Backend:

  - [x] connect Postgresql with typeorm

  - [x] assemble .env => gitignore but how to partager with collaborator??

  - [x] 42 auth(passport && jwt => send cookie on server side)

  - [x] create User then send cookie for auth(No redirection but send cookie with access token in response)

  - [x] add Note module, entity, service and controller

  - [x] verify bug in Note CRUD

  - [x] put loggedIn guard to Note request

  - [x] Websocket/Socketio connection with client

    - [x] handle join room => to modify after

    - [ ] handle leave room

  - [ ] to implement swagger to make simple dto code

- Database:

  - [x] config PostgreSQL and connect with nestJS server

  - [x] User table

  - [x] Note table : id, title, content, userId(foreign key), ...etc

  - [x] Channel table

  - [x] db table draw.io

- Docker:

  - [x] docker-compose.yml

- ETC:

  - [ ] save only locally .env

## BUG to fix

- frontend:

- backend:

  - [x] validate local-auth : unique value validation to add for name

  - [ ]

## Refactoring

- frontend:

  - [x] navbar

  - [x] auth page

  - [ ] chat page

    - [x] left(channelList)

    - [x] center(dialogue pannel) + messageInput

    - [x] right(currenteUserList)

- backend:

  - [x] see refactoring - user.service, entities

## Useful commands

### PostgreSQL:

- psql -U $POSTGRES_USER -d $POSTGRES_DB

### Docker :

- docker-compose up --build -V

  - V: remove anonymous volume

- clean

```bash
docker-compose down
docker container prune --force
docker image prune --force --all
docker network prune --force
docker volume prune --force
```
