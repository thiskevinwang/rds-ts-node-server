/** Types generated for queries found in "src/resolvers/Query/getAllUsers/getAllUsers.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Reactions_variant_enum = 'Like' | 'Love' | 'Haha' | 'Wow' | 'Sad' | 'Angry' | 'None';

/** 'GetAllUsers' parameters type */
export type IGetAllUsersParams = void;

/** 'GetAllUsers' return type */
export interface IGetAllUsersResult {
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

/** 'GetAllUsers' query type */
export interface IGetAllUsersQuery {
  params: IGetAllUsersParams;
  result: IGetAllUsersResult;
}

const getAllUsersIR: any = {"name":"GetAllUsers","params":[],"usedParamSet":{},"statement":{"body":"SELECT\n  *\nFROM\n  users","loc":{"a":27,"b":49,"line":4,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   *
 * FROM
 *   users
 * ```
 */
export const getAllUsers = new PreparedQuery<IGetAllUsersParams,IGetAllUsersResult>(getAllUsersIR);


/** 'GetAttemptsForUserId' parameters type */
export interface IGetAttemptsForUserIdParams {
  userId: string | null | void;
}

/** 'GetAttemptsForUserId' return type */
export interface IGetAttemptsForUserIdResult {
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

/** 'GetAttemptsForUserId' query type */
export interface IGetAttemptsForUserIdQuery {
  params: IGetAttemptsForUserIdParams;
  result: IGetAttemptsForUserIdResult;
}

const getAttemptsForUserIdIR: any = {"name":"GetAttemptsForUserId","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":135,"b":140,"line":18,"col":13}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT\n  *\nFROM\n  attempts\nWHERE\n  user_id = :userId","loc":{"a":89,"b":140,"line":13,"col":0}}};

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
export const getAttemptsForUserId = new PreparedQuery<IGetAttemptsForUserIdParams,IGetAttemptsForUserIdResult>(getAttemptsForUserIdIR);


/** 'GetCommentsForUserId' parameters type */
export interface IGetCommentsForUserIdParams {
  userId: string | null | void;
}

/** 'GetCommentsForUserId' return type */
export interface IGetCommentsForUserIdResult {
  id: string;
  created: Date;
  updated: Date | null;
  deleted: Date | null;
  type: string;
  body: string;
  url: string;
  user_id: string;
}

/** 'GetCommentsForUserId' query type */
export interface IGetCommentsForUserIdQuery {
  params: IGetCommentsForUserIdParams;
  result: IGetCommentsForUserIdResult;
}

const getCommentsForUserIdIR: any = {"name":"GetCommentsForUserId","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":226,"b":231,"line":29,"col":13}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT\n  *\nFROM\n  comments\nWHERE\n  user_id = :userId","loc":{"a":180,"b":231,"line":24,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   *
 * FROM
 *   comments
 * WHERE
 *   user_id = :userId
 * ```
 */
export const getCommentsForUserId = new PreparedQuery<IGetCommentsForUserIdParams,IGetCommentsForUserIdResult>(getCommentsForUserIdIR);


/** 'GetReactionsForUserId' parameters type */
export interface IGetReactionsForUserIdParams {
  userId: string | null | void;
}

/** 'GetReactionsForUserId' return type */
export interface IGetReactionsForUserIdResult {
  id: string;
  created: Date;
  updated: Date | null;
  deleted: Date | null;
  type: string;
  variant: Reactions_variant_enum;
  comment_id: string;
  user_id: string;
}

/** 'GetReactionsForUserId' query type */
export interface IGetReactionsForUserIdQuery {
  params: IGetReactionsForUserIdParams;
  result: IGetReactionsForUserIdResult;
}

const getReactionsForUserIdIR: any = {"name":"GetReactionsForUserId","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":319,"b":324,"line":40,"col":13}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT\n  *\nFROM\n  reactions\nWHERE\n  user_id = :userId","loc":{"a":272,"b":324,"line":35,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   *
 * FROM
 *   reactions
 * WHERE
 *   user_id = :userId
 * ```
 */
export const getReactionsForUserId = new PreparedQuery<IGetReactionsForUserIdParams,IGetReactionsForUserIdResult>(getReactionsForUserIdIR);


