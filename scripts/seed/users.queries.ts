/** Types generated for queries found in "scripts/seed/users.sql" */
import { PreparedQuery } from "@pgtyped/query"

/** 'GetUserById' parameters type */
export interface IGetUserByIdParams {
  userId: string | null | void
}

/** 'GetUserById' return type */
export interface IGetUserByIdResult {
  id: string
  created: Date
  updated: Date | null
  deleted: Date | null
  type: string
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  avatar_url: string | null
  last_password_request: Date | null
  verified_date: Date | null
  banned: boolean | null
}

/** 'GetUserById' query type */
export interface IGetUserByIdQuery {
  params: IGetUserByIdParams
  result: IGetUserByIdResult
}

const getUserByIdIR: any = {
  name: "GetUserById",
  params: [
    {
      name: "userId",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 62, b: 67, line: 7, col: 8 }] },
    },
  ],
  usedParamSet: { userId: true },
  statement: {
    body: "SELECT\n  *\nFROM\n  users\nWHERE\n  id = :userId",
    loc: { a: 24, b: 67, line: 2, col: 0 },
  },
}

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   *
 * FROM
 *   users
 * WHERE
 *   id = :userId
 * ```
 */
export const getUserById = new PreparedQuery<
  IGetUserByIdParams,
  IGetUserByIdResult
>(getUserByIdIR)

/** 'InsertTestUser' parameters type */
export interface IInsertTestUserParams {
  user: {
    firstName: string | null | void
    lastName: string | null | void
    email: string | null | void
    password: string | null | void
    username: string | null | void
  }
}

/** 'InsertTestUser' return type */
export interface IInsertTestUserResult {
  id: string
  created: Date
  updated: Date | null
  deleted: Date | null
  type: string
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  avatar_url: string | null
  last_password_request: Date | null
  verified_date: Date | null
  banned: boolean | null
}

/** 'InsertTestUser' query type */
export interface IInsertTestUserQuery {
  params: IInsertTestUserParams
  result: IInsertTestUserResult
}

const insertTestUserIR: any = {
  name: "InsertTestUser",
  params: [
    {
      name: "user",
      codeRefs: {
        defined: { a: 106, b: 109, line: 12, col: 8 },
        used: [{ a: 252, b: 255, line: 16, col: 5 }],
      },
      transform: {
        type: "pick_tuple",
        keys: ["firstName", "lastName", "email", "password", "username"],
      },
    },
  ],
  usedParamSet: { user: true },
  statement: {
    body:
      'INSERT INTO users (first_name, last_name, email, "password", username)\n  VALUES\n    :user\n  RETURNING\n    *',
    loc: { a: 167, b: 273, line: 14, col: 0 },
  },
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (first_name, last_name, email, "password", username)
 *   VALUES
 *     :user
 *   RETURNING
 *     *
 * ```
 */
export const insertTestUser = new PreparedQuery<
  IInsertTestUserParams,
  IInsertTestUserResult
>(insertTestUserIR)
