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

  - [ ] chat page

    - [x] left

      - [x] channelList

      - [ ] DM list

    - [x] center(dialogue pannel) + messageInput

    - [x] right(currenteUserList)

  - [ ] Modal

    - [ ] Edit Modal

      - [x] two factor

      - [ ] change avatar photo

  - [ ] Match History => after

  - [ ]

- Backend:

  - [ ] to implement swagger to make simple dto code

- Database:

  - [ ] db table draw.io => to update with recent db

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
