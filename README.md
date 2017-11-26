# Usefulness API ExpressJs

[![Build Status](https://travis-ci.org/remithomas/usefulness-api-expressjs.svg?branch=master)](https://travis-ci.org/remithomas/usefulness-api-expressjs)
[![Coverage Status](https://coveralls.io/repos/github/remithomas/usefulness-api-expressjs/badge.svg?branch=master)](https://coveralls.io/github/remithomas/usefulness-api-expressjs)

This is a [Usefulness API](https://github.com/remithomas/usefulness-apis), using :

- [expressjs](http://expressjs.com)
- [JWT](https://jwt.io) with [passportjs](http://www.passportjs.org) so you can change strategies easily.
- [sequelizejs](http://docs.sequelizejs.com) to manage DBs (Postgres per example)

## What's a _starter project_

A _starter project_ is a basic project with some vital features:

- database access
- user connexion

## User stories

Current coded stories or next todos

- [X] As an User, I want to sign-in
- [ ] As an User, I want to sign-out
- [X] As an User, I want to be automatically reconnected (using refresh Token)

## Requirements

- node8
- yarn

## Environements variables

```bash
NODE_ENV="development"
DATABASE_URL=postgres://localhost:5432/my-app
SECRET="yolo"
TOKEN_EXPIRATION="10m"
REFRESH_TOKEN_EXPIRATION="2d"
```

## Starting App

### Without Migrations

```bash
yarn install
yarn run start
```

### With Migrations

```bash
yarn install
node_modules/.bin/sequelize db:migrate
yarn run start
```

## Urls

List of useful urls

- `/auth/sign-in` sign-in using _username_ and _password_
- `/me` user profile page

## Contributions

Don't hesitate to submit issues, comments and pull request. 
This has been developped in TDD.

## ToDOs / Plans

- [ ] Add reject token
- [ ] Add some seed to generate users (for example)
- [ ] Docker ready