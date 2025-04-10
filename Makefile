# Define some variables for better readability and maintainability
SERVER_DIR = server
CLIENT_DIR = client
DOCKER_IMAGE_NAME = sweetspot

# Define the default target
run-local: build-server run-server-parallel build-client start-client

# Build the server
build-server:
	@echo "Building server..."
	cd $(SERVER_DIR) && go build -o MobileAppProject

# Run the server in parallel
run-server-parallel:
	@echo "Running server..."
	cd $(SERVER_DIR) && ./MobileAppProject &

# Build the client
build-client:
	@echo "Building client..."
	cd $(CLIENT_DIR) && npm install

# Start the client
start-client:
	@echo "Starting client..."
	cd $(CLIENT_DIR) && npx expo start -c

r# Run the container
run-container: build-client run-container-parallel

# Run the container in parallel
run-container-parallel:
	@echo "Running Docker Compose and Expo Client"
	cd $(SERVER_DIR) && docker compose up -d
	cd $(CLIENT_DIR) && npx expo start

# Build the Docker image
build-container:
	@echo "Building Docker image"
	cd $(SERVER_DIR) && docker build -t $(DOCKER_IMAGE_NAME) .

clean:
	@echo "Cleaning up..."
	cd server && rm -f MobileAppProject

.PHONY: dev build-server run-server build-client start-client clean build-container run-container