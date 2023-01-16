up:
	docker-compose up --build 

clean: 
	docker-compose down

fclean: $(clean)
	docker container prune --force
	docker image prune --force --all
	docker network prune --force
	docker volume prune --force
