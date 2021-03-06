# Usefulness API ExpressJs

[![Build Status](https://travis-ci.org/remithomas/usefulness-api-expressjs.svg?branch=master)](https://travis-ci.org/remithomas/usefulness-api-expressjs)
[![Coverage Status](https://coveralls.io/repos/github/remithomas/usefulness-api-expressjs/badge.svg?branch=master)](https://coveralls.io/github/remithomas/usefulness-api-expressjs)

This is a [Usefulness API](https://github.com/remithomas/usefulness-apis), using :

- [expressjs](http://expressjs.com)
- [JWT](https://jwt.io) with [passportjs](http://www.passportjs.org) so you can change strategies easily.
- [sequelizejs](http://docs.sequelizejs.com) to manage DBs (Postgres per example)

## What's a _starter project_

A _starter project_ is a basic project with some vital features:

- Database access
- User connexion
- Docker ready
- Set development environement (travis, code-coverage)

More informations on [Usefulness API](https://github.com/remithomas/usefulness-apis) project.

## User stories

Current coded stories or next todos

- [X] As an User, I want to sign-in
- [X] As an User, I want to sign-out (and blacklist authToken)
- [X] As an User, I want to be automatically reconnected (using refresh Token)

## Requirements

- node8
- yarn (or npm)
- Docker (if using Docker)

## Environements variables

```bash
NODE_ENV=development
DATABASE_URL=postgres://localhost:5432/my-app
SECRET=YourSecretToken
TOKEN_EXPIRATION=10m
REFRESH_TOKEN_EXPIRATION=2d
```

## Starting App

### Without Migrations

```bash
# Yarn install
yarn install
yarn run start

# Or using Npm :
npm install
npm start
```

### With Migrations

```bash
# Yarn install
yarn install
# Or using Npm :
npm install

# Database migration
node_modules/.bin/sequelize db:migrate

# In production mode
yarn run start

# In developement mode (this does the migrations)
yarn run start-dev
```

### With docker

You should have docker installed on your dev environement.

```bash
docker-compose build
docker-compose up
```

## Code coverage

Using [coveralls.io](https://coveralls.io), create a file named `.coveralls.yml` with your `repo_token`

```yml
service_name: travis-pro
repo_token: yourRepoToken
```

## Urls

List of useful urls

- `/auth/sign-in` sign-in using _username_ and _password_
- `/auth/token` refresh the auth token using the _refresh token_
- `/auth/reject` reject the _refresh token_ for the user
- `/me` user profile page

## Contributions

Don't hesitate to submit issues, comments and pull request.
This has been developped in TDD.

## ToDos / Plans

- [ ] Blacklist refresh tokens
- [ ] Register user
- [ ] Add some seeds (to generate users for example)