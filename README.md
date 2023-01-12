This is a boiler plate to use generally at my futur web application.

## Stacks

- Frontend: React JS, Next JS

- Backend: Node JS, Nest JS

- Database: PostgreSQL

- Docker

## Features

- Frontend:
  - one
- Backend:
  - connect Postgresql with typeorm
  - assemble .env => gitignore but how to partager with collaborator??
- Database:
  - one

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
