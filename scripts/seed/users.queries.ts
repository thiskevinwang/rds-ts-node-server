/** Types generated for queries found in "scripts/seed/users.sql" */
import { PreparedQuery } from "@pgtyped/query"

/** 'GetOrCreateUser' parameters type */
export interface IGetOrCreateUserParams {
  user: {
    id: string | null | void
    firstName: string | null | void
    lastName: string | null | void
    email: string | null | void
    password: string | null | void
    username: string | null | void
  }
}

/** 'GetOrCreateUser' return type */
export interface IGetOrCreateUserResult {
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

/** 'GetOrCreateUser' query type */
export interface IGetOrCreateUserQuery {
  params: IGetOrCreateUserParams
  result: IGetOrCreateUserResult
}

const getOrCreateUserIR: any = {
  name: "GetOrCreateUser",
  params: [
    {
      name: "user",
      codeRefs: {
        defined: { a: 34, b: 37, line: 3, col: 8 },
        used: [{ a: 188, b: 191, line: 7, col: 5 }],
      },
      transform: {
        type: "pick_tuple",
        keys: ["id", "firstName", "lastName", "email", "password", "username"],
      },
    },
  ],
  usedParamSet: { user: true },
  statement: {
    body:
      'INSERT INTO users (id, first_name, last_name, email, "password", username)\n  VALUES\n    :user\n  ON CONFLICT ON CONSTRAINT "pk_users_id"\n    DO UPDATE SET\n      id = users.id\n    RETURNING\n      *',
    loc: { a: 99, b: 293, line: 5, col: 0 },
  },
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (id, first_name, last_name, email, "password", username)
 *   VALUES
 *     :user
 *   ON CONFLICT ON CONSTRAINT "pk_users_id"
 *     DO UPDATE SET
 *       id = users.id
 *     RETURNING
 *       *
 * ```
 */
export const getOrCreateUser = new PreparedQuery<
  IGetOrCreateUserParams,
  IGetOrCreateUserResult
>(getOrCreateUserIR)
