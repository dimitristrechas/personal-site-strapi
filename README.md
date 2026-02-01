The code behind [my personal site/blog backend strapi app](https://www.dimitristrechas.com).

# INSTALLATION NOTES

1. Clone the repository `git clone https://github.com/dimitristrechas/personal-site-strapi.git`
2. Copy `.env.example` to `.env` and set the environment variables
3. Set required MCP env variables: `LINEAR_MCP_TOKEN`, `GITHUB_MCP_TOKEN`, reload terminal if needed
4. `yarn` to install dependencies
5. `docker compose up --remove-orphans --build --force-recreate -d` to build the docker image (or use `./scripts.sh` for automated setup)
