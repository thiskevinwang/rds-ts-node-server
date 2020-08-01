/** Types generated for queries found in "src/resolvers/Mutation/updatePassword/updatePassword.sql" */
import { PreparedQuery } from '@pgtyped/query';

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

/** 'GetUserById' query type */
export interface IGetUserByIdQuery {
  params: IGetUserByIdParams;
  result: IGetUserByIdResult;
}

const getUserByIdIR: any = {"name":"getUserById","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":58,"b":63,"line":4,"col":32}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM users WHERE id = :userId","loc":{"a":26,"b":63,"line":4,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM users WHERE id = :userId
 * ```
 */
export const getUserById = new PreparedQuery<IGetUserByIdParams,IGetUserByIdResult>(getUserByIdIR);


/** 'UpdatePasswordForUserId' parameters type */
export interface IUpdatePasswordForUserIdParams {
  newHash: string | null | void;
  userId: string | null | void;
}

/** 'UpdatePasswordForUserId' return type */
export type IUpdatePasswordForUserIdResult = void;

/** 'UpdatePasswordForUserId' query type */
export interface IUpdatePasswordForUserIdQuery {
  params: IUpdatePasswordForUserIdParams;
  result: IUpdatePasswordForUserIdResult;
}

const updatePasswordForUserIdIR: any = {"name":"updatePasswordForUserId","params":[{"name":"newHash","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":137,"b":143,"line":10,"col":18}]}},{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":157,"b":162,"line":11,"col":12}]}}],"usedParamSet":{"newHash":true,"userId":true},"statement":{"body":"UPDATE users\nSET \"password\" = :newHash\nWHERE id = :userId","loc":{"a":106,"b":162,"line":9,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE users
 * SET "password" = :newHash
 * WHERE id = :userId
 * ```
 */
export const updatePasswordForUserId = new PreparedQuery<IUpdatePasswordForUserIdParams,IUpdatePasswordForUserIdResult>(updatePasswordForUserIdIR);


