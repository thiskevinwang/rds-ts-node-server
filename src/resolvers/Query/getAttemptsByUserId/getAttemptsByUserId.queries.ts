/** Types generated for queries found in "src/resolvers/Query/getAttemptsByUserId/getAttemptsByUserId.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetAttemptsByUserId' parameters type */
export interface IGetAttemptsByUserIdParams {
  userId: string | null | void;
}

/** 'GetAttemptsByUserId' return type */
export interface IGetAttemptsByUserIdResult {
  id: string;
  created: Date;
  updated: Date | null;
  deleted: Date | null;
  grade: number;
  send: boolean | null;
  flash: boolean | null;
  date: Date | null;
  user_id: string;
}

/** 'GetAttemptsByUserId' query type */
export interface IGetAttemptsByUserIdQuery {
  params: IGetAttemptsByUserIdParams;
  result: IGetAttemptsByUserIdResult;
}

const getAttemptsByUserIdIR: any = {"name":"GetAttemptsByUserId","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":81,"b":86,"line":9,"col":13}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT\n  *\nFROM\n  attempts\nWHERE\n  user_id = :userId","loc":{"a":35,"b":86,"line":4,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   *
 * FROM
 *   attempts
 * WHERE
 *   user_id = :userId
 * ```
 */
export const getAttemptsByUserId = new PreparedQuery<IGetAttemptsByUserIdParams,IGetAttemptsByUserIdResult>(getAttemptsByUserIdIR);


/** 'GetUserById' parameters type */
export interface IGetUserByIdParams {
  userId: string | null | void;
}

/** 'GetUserById' return type */
export interface IGetUserByIdResult {
  id: string;
  created: Date;
  updated: Date | null;
  deleted: Date | null;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  cognito_sub: string;
}

/** 'GetUserById' query type */
export interface IGetUserByIdQuery {
  params: IGetUserByIdParams;
  result: IGetUserByIdResult;
}

const getUserByIdIR: any = {"name":"GetUserById","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":155,"b":160,"line":20,"col":8}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT\n  *\nFROM\n  users\nWHERE\n  id = :userId","loc":{"a":117,"b":160,"line":15,"col":0}}};

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
export const getUserById = new PreparedQuery<IGetUserByIdParams,IGetUserByIdResult>(getUserByIdIR);


