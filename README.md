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

  - [ ] post page implement

- Backend:

  - [x] connect Postgresql with typeorm

  - [x] assemble .env => gitignore but how to partager with collaborator??

  - [x] 42 auth(passport && jwt => send cookie on server side)

  - [x] create User then send cookie for auth(No redirection but send cookie with access token in response)

  - [ ] add post module, entity, service and controller

- Database:

  - [x] config PostgreSQL and connect with nestJS server

  - [x] User table

  - [ ] Post table : id, title, content, userId(foreign), ...etc

  - [ ] Chat table

- Docker:

  - [x] docker-compose.yml

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
