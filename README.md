This is a boiler plate to use generally at my futur web application.

## Get start

```bash
# start frontend/backend server
make up
#or with commend docker manually
docker-compose up --build

# stop server
make clean

# reset all db and docker containers, images, volumes, networks
make fclean
```

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

  - [x] Note page implement

    - [x] All note(/note)

    - [x] Create note(/note/create)

    - [x] note(/note/:id)

    - [x] divide FormField => InputField(FormField), TextareaField

    - [x] redirect if no accessToken

  - [ ] chat page

    - [x] left

      - [x] channelList

      - [ ] DM list

    - [x] center(dialogue pannel) + messageInput

    - [x] right(currenteUserList)

  - [x] Modal

    - [x] NewChannel Modal (name, password) => if password? private : public

    - [ ] Edit Modal

      - [x] two factor

      - [ ] change avatar photo

    - [ ] Match History => after

    - [x] Friends : with 2 tabs

      - [x] friend list

      - [x] blokced list

- Backend:

  - [x] connect Postgresql with typeorm

  - [x] assemble .env => gitignore but how to partager with collaborator??

  - [x] 42 auth(passport && jwt => send cookie on server side)

  - [x] create User then send cookie for auth(No redirection but send cookie with access token in response)

  - [x] add Note module, entity, service and controller

  - [x] verify bug in Note CRUD

  - [x] put loggedIn guard to Note request

  - [x] Websocket/Socketio connection with client

  - [ ] to implement swagger to make simple dto code

  - [x] update entities

    - [x] User

    - [x] Friend list

    - [x] Blocked list

  - [x] Controller and services

    - [x] user

    - [x] friend

    - [x] Blocked

  - SocketIO

    - [x] save ChannelChat in db

- Database:

  - [x] config PostgreSQL and connect with nestJS server

  - [x] User table

  - [x] Note table : id, title, content, userId(foreign key), ...etc

  - [x] Channel table

  - [ ] db table draw.io => to update with recent db

  - [x] Friends table

  - [x] Blocked list

  - [x] User table update

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
