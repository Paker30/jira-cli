FROM node:18-alpine

WORKDIR /app

COPY ./ .

RUN npm install && npm link

ENTRYPOINT ["/usr/local/bin/cli-jira"]