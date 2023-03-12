This is a final project in common core at 42 Paris.

It's a web application which contains real time chat and pong game by websocket and socket io. And also, it contains two factor authentication(2fa) by qrcode thanks to google authentication.

\*To test, you must have a .env file which contains all environement variable to configure docker and its containers(frontend, backend and database)

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

- Frontend: React JS, Next JS, Socket io

- Backend: Node JS, Nest JS

- Database: PostgreSQL

- Docker

## Features

- Frontend:

  - [ ] responsive

- Backend:

  - [ ] to implement swagger to make simple dto code

- Database:

  - [ ] db table draw.io => to update with recent db

- Docker:

  - [x] docker-compose.yml

- ETC:

  - [x] save only locally .env

## BUG to fix

- frontend:

- backend:

## Refactoring

- frontend:

- backend:

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
