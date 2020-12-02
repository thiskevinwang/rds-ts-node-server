# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.5.0] - 2020-12-01

### Bye bye Postgres; Hello Dynamo

I'm done using TypeORM and Postgres.

### Added

- `process.env.TABLE_NAME`
  - this needs to be added in Vercel
- graphql-codegen
- update `updateUsername` to Dynamo logic

## [v0.4.0] - 2020-11-26

### BREAKING CHANGES

This change completely reworks the project structure, to avoid single gigantic GraphQL schemas/typedefs.

- previously: Things were divided by Query & Mutation
- new: Things are separated into "/modules" which more or less represent db entities or a certain domain, like AWS S3

This was a huge pain to figure out. One strange "duplicate Query.someField" error (that I did not see on another apollo-server project) was resolved by removing node_modules, and reinstalling.

I also deleted a ton of old resolvers, and removed PgTyped. As cool as it was to learn an write raw SQL queries for a bit... ain't nobody got time for that.

### Changed

- entire project structure to user 'modules' structure

### Removed

- many old queries / mutations

### Added

- getOrCreateUser (auth)
- getUsers

###

## [v0.3.1] - 2020-11-20

### Fixed

- secured `s3GetSignedPutObjectUrl` mutation with `@auth` directive

## [v0.3.0] - 2020-11-15

### BREAKING CHANGES

- removed all password-related things
  - Cognito will be the source for user auth
- removed old migrations;
- created new migrations;
- Entity Column types
  - ids -> `uuid`
  - Dates => `timestamptz`
- GraphQL Schema
  - removed fields
  - created `Base` interface
- updated PgTyped queries

### Packages

- prettier 2.1.2
- removed many others

## [v0.2.0] - 2020-10-08

### Added

- `axios`
- `jwks-rsa`
- Mutation: getToken
- cognito to resolver-context object
- `src/utils/decodeBearerToken.ts`

### Changed

- bump ts packages
- AuthDirective hits Cognito well-known JWKS
- split up /utils folder

## [v0.1.1] - 2020-08-06

### Added

- Added missing enum to `00001-Bootstrap.sql` migration
- Enabled absolute imports ✨
- Added `@auth` and `@development` GraphQL directives

### Changed

- Refactored resolvers to use PgTyped
  - `updatePassword`
  - `createComment`
  - `signup`

## [v0.1.0] - 2020-07-26

### Added

- ```diff
  "devDependencies": {
  - "@types/pg": "^7.11.2",
  + "@types/pg": "^7.14.4",
  }

  "dependencies": {
  + "@pgtyped/cli": "^0.8.1",

  + "@pgtyped/query": "^0.8.1",

  - "apollo-server": "^2.9.13",
  + "apollo-server": "^2.16.0",

  + "concurrently": "^5.2.0",

  - "graphql": "^14.5.8",
  + "graphql": "^15.3.0",

  - "pg": "^7.14.0",
  + "pg": "^8.3.0",
  }
  ```

### Changed

- Start deprecation of `TypeORM` 😭
- Start following [keep a changelog](https://keepachangelog.com/en/1.0.0/)
- Start thinking about [SemVer](https://semver.org)?
- Added + ran migrations on RDS instance
- refactored GraphQL Queries to PgTyped
  - `getAllUsers`
  - `getAttemptsByUserId`

## [v0.0.10] - 2020-04-03

### Changed

- `synchronize: false` & type ResolverFn (#14)
- prettier 2.0.2 & format script
- typescript 3.8.3
- export type ResolverFn
- type Query resolvers
- type Mutation resolvers
- pick type on getUserId

## [v0.0.9] - 2020-04-03

### Changed

## [v0.0.8] - 2020-04-03

### Added

sessions-and-attempts

## [v0.0.7] - 2020-04-03

### Added

add skip/take to getCommentsByUrl

## [v0.0.6] - 2020-04-03

### Changed

- Moved back to NOW V2 (no more websockets)

## [0.0.5] - 2019-12-29

### Added

- Add deleteCommentById mutation

## [v0.0.4] - 2019-12-26

### Added

- Add getCommentsByUrl https://github.com/thiskevinwang/rds-ts-node-server/commit/867b2b6e9276b7caaaaac97997bffed935f4e243
- Add CommentOrderByInput enum filter https://github.com/thiskevinwang/rds-ts-node-server/commit/e892cf9ea3b344b95d2fde0a36daf906a4cb9f4a
- reactToComment ID arg https://github.com/thiskevinwang/rds-ts-node-server/commit/4fb513ed05f3b0f5915ecb2add71cffca604a651

## [v0.0.3] - 2019-12-22

### Added

[v0.5.0]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.4.0...v0.5.0
[v0.4.0]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.3.1...v0.4.0
[v0.3.1]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.3.0...v0.3.1
[v0.3.0]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.2.0...v0.3.0
[v0.2.0]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.1.2...v0.2.0
[v0.1.2]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.1.1...v0.1.2
[v0.1.1]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.1.0...v0.1.1
[v0.1.0]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.10...v0.1.0
[v0.0.10]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.9...v0.0.10
[v0.0.9]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.8...v0.0.9
[v0.0.8]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.7...v0.0.8
[v0.0.7]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.6...v0.0.7
[v0.0.6]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.5...v0.0.6
[v0.0.5]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.4...v0.0.5
[v0.0.4]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.3...v0.0.4
[v0.0.3]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.2...v0.0.3
