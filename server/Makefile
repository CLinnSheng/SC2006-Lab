all: MobileAppProject
	@echo running binary file of the project
	./MobileAppProject

MobileAppProject:
	@echo "Building Mobile App Project..."
	@echo "Running build command..."
	go build 

clean:
	@echo "Cleaning up..."
	@echo "Removing build artifacts..."
	rm -f MobileAppProject
	@echo "Cleaned up successfully."

.PHONY: all MobileAppProject clean