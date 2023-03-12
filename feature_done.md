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

    - [x] Edit Modal

      - [x] two factor

      - [x] change avatar photo

    - [x] ChannelSettingModal(only creator)

      - [x] update password

  - [x] edit profile => username

  - [x] chat page

    - [x] left

      - [x] channelList

      - [x] DM list

    - [x] center(dialogue pannel) + messageInput

    - [x] right(currenteUserList)

    - [x] edit profile => username

  - [x] User list(admin and creator)

    - [x] ban: users in channel

    - [x] give admin right

  - [x] manage channel msg sent by blocked user for some user

  - [x] mute: mutted user can't send message (with time determinated)

  - [x] manage when user in game change router => no game

  - [x] live game list

  - [x] Match History

  - [x] Home page

    - [x] leader board

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

  - See schedule to set time for ban/mute

  - [x] to fix ban(In current system, it doesn't depend on time fixed)

  - [x] feat mute

  - [x] game to manage in server (to avoid synchronization problems!!)

  - [x] ready btn condition (1. not in game 2. home or away)

  - [x] Match history for other user by id

  - Game:

    - [x] when home or away has 3 scores => game over => send result to db(Match history and User.rank)

    - [x] when user quit => send result to db(AFK) => no game

    - [x] random matching system

- Database:

  - [x] config PostgreSQL and connect with nestJS server

  - [x] User table

  - [x] Note table : id, title, content, userId(foreign key), ...etc

  - [x] Channel table

  - [x] Friends table

  - [x] Blocked list

  - [x] User table update

  - [x] Match history table : `id`, `user1(home)`, `user2(away)`, `winner`...

  - [x] rank to implement in User table

- Docker:

  - [x] docker-compose.yml
