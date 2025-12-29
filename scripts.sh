#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

check_docker() {
    if ! docker info > /dev/null 2>&1; then
        printf "${RED}Error: Docker is not running. Please start Docker first.${NC}\n"
        exit 1
    fi
}

show_docker_status() {
    echo -e "${CYAN}--- Docker Status ---${NC}"
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "personal-site-strapi" > /dev/null 2>&1; then
        docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "personal-site-strapi"
    else
        echo -e "${YELLOW}No personal-site-strapi containers currently running${NC}"
    fi
    echo ""
}

confirm_action() {
    local message="$1"
    echo -e "${YELLOW}$message${NC}"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Operation cancelled.${NC}"
        exit 0
    fi
}

clear
echo -e "${PURPLE}Personal Site Strapi Development Toolkit${NC}"
echo ""

check_docker
show_docker_status

echo -e "${GREEN}--- Options ---${NC}"
echo -e " ${BLUE}(1)${NC}  Fresh build & start development server"
echo -e " ${BLUE}(2)${NC}  Stop containers"
echo -e " ${BLUE}(3)${NC}  Show Docker container status"
echo -e " ${BLUE}(4)${NC}  Check for npm updates"
echo ""
echo -e "${YELLOW}Choose an option:${NC} "
read OPTION

case $OPTION in

    1)
    confirm_action "This will rebuild and recreate the development container."
    echo -e "${GREEN}Building and starting development server with fresh build...${NC}"
    if yarn build:docker; then
        echo -e "${GREEN}✅ Development server built and started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to build and start development server${NC}"
        exit 1
    fi
    ;;

    2)
    confirm_action "This will stop personal-site-strapi containers."
    echo -e "${YELLOW}Stopping containers...${NC}"
    if docker compose stop personal-site-strapi personal-site-strapiDB personal-site-strapiAdminer; then
        echo -e "${GREEN}✅ Containers stopped${NC}"
    else
        echo -e "${YELLOW}⚠️  No containers were running${NC}"
    fi
    ;;

    3)
    show_docker_status
    ;;

    4)
    echo -e "${CYAN}Checking for npm updates...${NC}"
    npx npm-check-updates
    ;;

    *)
    echo -e "${RED}❌ Unknown option: $OPTION${NC}"
    echo -e "${YELLOW}Please choose a valid option (1-4)${NC}"
    exit 1
    ;;
esac

echo -e "${GREEN}Operation completed!${NC}"
