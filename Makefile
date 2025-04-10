run-local: build-server run-server-parallel build-client start-client

build-server:
	@echo "Building server..."
	cd server && go build

run-server-parallel:
	@echo "Running server..."
	cd server && ./MobileAppProject &

build-client:
	@echo "Building client..."
	cd client && npm install

start-client:
	@echo "Starting client..."
	cd client && npx expo start -c

run-container: build-client run-container-parallel

run-container-parallel:
	@echo "Running Docker Compose and Expo Client"
	cd server && docker compose up -d
	cd client && npx expo start

clean:
	@echo "Cleaning up..."
	cd server && rm -f MobileAppProject

.PHONY: dev build-server run-server build-client start-client clean