/** Types generated for queries found in "src/resolvers/Mutation/signup/signup.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'CreateUser' parameters type */
export interface ICreateUserParams {
  user: {
    firstName: string | null | void,
    lastName: string | null | void,
    email: string | null | void,
    password: string | null | void,
    username: string | null | void
  };
}

/** 'CreateUser' return type */
export interface ICreateUserResult {
  id: string;
  created: Date;
  updated: Date | null;
  deleted: Date | null;
  type: string;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  last_password_request: Date | null;
  verified_date: Date | null;
  banned: boolean | null;
}

/** 'CreateUser' query type */
export interface ICreateUserQuery {
  params: ICreateUserParams;
  result: ICreateUserResult;
}

const createUserIR: any = {"name":"createUser","params":[{"name":"user","codeRefs":{"defined":{"a":29,"b":32,"line":3,"col":8},"used":[{"a":175,"b":178,"line":7,"col":5}]},"transform":{"type":"pick_tuple","keys":["firstName","lastName","email","password","username"]}}],"usedParamSet":{"user":true},"statement":{"body":"INSERT INTO users (first_name, last_name, email, \"password\", username)\n  VALUES\n    :user\n  ON CONFLICT ON CONSTRAINT \"pk_users_id\"\n    DO UPDATE SET\n      id = users.id\n    RETURNING\n      *","loc":{"a":90,"b":280,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (first_name, last_name, email, "password", username)
 *   VALUES
 *     :user
 *   ON CONFLICT ON CONSTRAINT "pk_users_id"
 *     DO UPDATE SET
 *       id = users.id
 *     RETURNING
 *       *
 * ```
 */
export const createUser = new PreparedQuery<ICreateUserParams,ICreateUserResult>(createUserIR);


