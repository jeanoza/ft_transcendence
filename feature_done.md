## Feature finished

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

    - [x] center(dialogue pannel) + messageInput

    - [x] right(currenteUserList)

  - [x] Modal

    - [x] NewChannel Modal (name, password) => if password? private : public

    - [x] Friends : with 2 tabs

      - [x] friend list

      - [x] blokced list

    - [ ] Edit Modal

      - [x] two factor

      - [x] change avatar photo

    - [ ] chat page

      - [x] left

        - [x] channelList

        - [x] DM list

      - [x] center(dialogue pannel) + messageInput

      - [x] right(currenteUserList)

- Backend:

  - [x] connect Postgresql with typeorm

  - [x] assemble .env => gitignore but how to partager with collaborator??

  - [x] 42 auth(passport && jwt => send cookie on server side)

  - [x] create User then send cookie for auth(No redirection but send cookie with access token in response)

  - [x] add Note module, entity, service and controller

  - [x] verify bug in Note CRUD

  - [x] put loggedIn guard to Note request

  - [x] Websocket/Socketio connection with client

  - [x] update entities

    - [x] User

    - [x] Friend list

    - [x] Blocked list

  - [x] Controller and services

    - [x] user

    - [x] friend

    - [x] Blocked

  - [x] user status => but it's better to use socket with a gateway which contains only connect/disconnect event

    - [x] user get request '/user/current' and pass jwtguard => update status to 'online'

    - [x] user get request '/auth/logout' => update status to 'offline'

  - [x] manage no_image case(if no image saved in server)

  - SocketIO

    - [x] save ChannelChat in db

- Database:

  - [x] config PostgreSQL and connect with nestJS server

  - [x] User table

  - [x] Note table : id, title, content, userId(foreign key), ...etc

  - [x] Channel table

  - [x] Friends table

  - [x] Blocked list

  - [x] User table update

- Docker:

  - [x] docker-compose.yml
