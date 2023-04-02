.DEFAULT_GOAL := help
GCP_BUCKET := canvas-retro-games
GCP_PROJECT := canvas-retro-games


# ==================================================================================== #
# HELPERS
# ==================================================================================== #

check-modules:
ifeq ($(wildcard node_modules),)
	@yarn
endif

.PHONY: help
help: welcome
	@grep -E '^[a-zA-Z0-9 -]+:.*#'  Makefile | sort | while read -r l; do printf "\033[1;32m$$(echo $$l | cut -f 1 -d':')\033[00m:$$(echo $$l | cut -f 2- -d'#')\n"; done

define ART_CANVAS
 _____                            
/  __ \                           
| /  \/ __ _ _ ____   ____ _ ___  
| |    / _` | '_ \ \ / / _` / __| 
| \__/\ (_| | | | \ V / (_| \__ \ 
 \____/\__,_|_| |_|\_/ \__,_|___/

endef
export ART_CANVAS

define ART_RETRO
______     _                      
| ___ \   | |                     
| |_/ /___| |_ _ __ ___           
|    // _ \ __| '__/ _ \          
| |\ \  __/ |_| | | (_) |         
\_| \_\___|\__|_|  \___/          

endef
export ART_RETRO

define ART_GAMES
 _____                            
|  __ \                           
| |  \/ __ _ _ __ ___   ___  ___  
| | __ / _` | '_ ` _ \ / _ \/ __| 
| |_\ \ (_| | | | | | |  __/\__ \ 
 \____/\__,_|_| |_| |_|\___||___/ 


endef
export ART_GAMES

ART_CANVAS_COLOR := \e[31m
ART_RETRO_COLOR := \e[32m
ART_GAMES_COLOR := \e[34m
COLOR_RESET := \e[0m

.PHONY: welcome
welcome:
	@printf "$(ART_CANVAS_COLOR)$$ART_CANVAS"
	@printf "$(ART_RETRO_COLOR)$$ART_RETRO"
	@printf "$(ART_GAMES_COLOR)$$ART_GAMES"
	@printf "$(COLOR_RESET)"


# ==================================================================================== #
# Development
# ==================================================================================== #

.PHONY: dev
dev: welcome check-modules # Start the application in development mode
	@yarn webpack serve

# ==================================================================================== #
# Quality
# ==================================================================================== #

lint: # Lint all css and js files
	@yarn eslint './src' --fix
	@yarn stylelint 'src/**/*.css' --fix

format: # Format all files
	@yarn prettier --write 'src/**/*.{js,css,json,md,yml}'

tidy: welcome format lint # Lint and format all source files


# ==================================================================================== #
# Deploy
# ==================================================================================== #

build: welcome check-modules # Build the application
	@rm -rf ./build
	@yarn webpack build

deploy: build # Deploy the application to the Google Cloud Bucket set on Makefile
	@gcloud config set project ${GCP_PROJECT}
	@gcloud storage cp ./build/* gs://${GCP_BUCKET} --recursive
	@echo "You can try on https://storage.googleapis.com/${GCP_BUCKET}/index.html"
