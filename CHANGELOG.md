# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2020-08-06

### Added

- Added missing enum to `00001-Bootstrap.sql` migration
- Enabled absolute imports ✨
- Added `@auth` and `@development` GraphQL directives

### Changed

- Refactored resolvers to use PgTyped
  - `updatePassword`
  - `createComment`
  - `signup`

## [0.1.0] - 2020-07-26

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

## [0.0.10] - 2020-04-03

### Changed

- `synchronize: false` & type ResolverFn (#14)
- prettier 2.0.2 & format script
- typescript 3.8.3
- export type ResolverFn
- type Query resolvers
- type Mutation resolvers
- pick type on getUserId

## [0.0.9] - 2020-04-03

### Changed

## [0.0.8] - 2020-04-03

### Added

sessions-and-attempts

## [0.0.7] - 2020-04-03

### Added

add skip/take to getCommentsByUrl

## [0.0.6] - 2020-04-03

### Changed

- Moved back to NOW V2 (no more websockets)

## [0.0.5] - 2019-12-29

### Added

- Add deleteCommentById mutation

## [0.0.4] - 2019-12-26

### Added

- Add getCommentsByUrl https://github.com/thiskevinwang/rds-ts-node-server/commit/867b2b6e9276b7caaaaac97997bffed935f4e243
- Add CommentOrderByInput enum filter https://github.com/thiskevinwang/rds-ts-node-server/commit/e892cf9ea3b344b95d2fde0a36daf906a4cb9f4a
- reactToComment ID arg https://github.com/thiskevinwang/rds-ts-node-server/commit/4fb513ed05f3b0f5915ecb2add71cffca604a651

## [0.0.3] - 2019-12-22

### Added

[0.1.1]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.10...v0.1.0
[0.0.10]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.9...v0.0.10
[0.0.9]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.8...v0.0.9
[0.0.8]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.7...v0.0.8
[0.0.7]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/thiskevinwang/rds-ts-node-server/compare/v0.0.2...v0.0.3
