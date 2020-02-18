# rds-ts-node-server

## Notes

This api is consumed by 
- https://github.com/thiskevinwang/coffee-code-climb
- https://github.com/thiskevinwang/you-suck-try-harder

## Prerequisites

### `ormconfig.(yml|json|js)`

You will need an `ormconfig` file in the root directory (next to `package.json`) in order to call TypeORM's `createConnection()` with no configuration passed.

- `.yml` is the nicest option since it allows inline comments, and you don't need to worry about module exports

###### example `ormconfig.yml`

```yml
default:
  type: "postgres"
  host: "<rds-database-endpoint>"     # update this
  port: 0000                          # update this
  username: "<rds-database-username>" # update this
  password: "<rds-database-password>" # update this
  database: "postgres"
  # --- synchronize ---
  # Indicates if database schema should be auto created
  # on every application launch. Be careful with this option
  # and don't use this in production - otherwise you can
  # lose production data. This option is useful during debug
  # and development. As an alternative to it, you can use
  # CLI and run schema:sync command. Note that for MongoDB
  # database it does not create schema, because MongoDB is
  # schemaless. Instead, it syncs just by creating indices.
  synchronize: true
  logging: false
  entities: ["src/entity/**/*.ts"]
  migrations: ["src/migration/**/*.ts"]
  subscribers: ["src/subscriber/**/*.ts"]
  cli:
    entitiesDir: "src/entity"
    migrationsDir: "src/migration"
    subscribersDir: "src/subscriber"
```
