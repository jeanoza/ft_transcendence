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

  - [ ] see refactoring : line 33 in auth.tsx

  - [ ] session

  - [ ] post page implement

- Backend:

  - [x] connect Postgresql with typeorm

  - [x] assemble .env => gitignore but how to partager with collaborator??

  - [x] auth

  - [ ] see refactoring - user.service, entities

  - [ ] add table for post

  - [ ] service and controller

- Database:

  - [x] config PostgreSQL and connect with nestJS server

  - [x] User table

  - [ ] Post table

  - [ ] Chat table

- Docker:

  - [x] docker-compose.yml

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
