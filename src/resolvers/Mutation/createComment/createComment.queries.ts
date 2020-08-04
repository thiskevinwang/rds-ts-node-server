/** Types generated for queries found in "src/resolvers/Mutation/createComment/createComment.sql" */
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

const getUserByIdIR: any = {"name":"getUserById","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":59,"b":64,"line":5,"col":12}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT * FROM users \nWHERE id = :userId\nLIMIT 1","loc":{"a":26,"b":72,"line":4,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM users 
 * WHERE id = :userId
 * LIMIT 1
 * ```
 */
export const getUserById = new PreparedQuery<IGetUserByIdParams,IGetUserByIdResult>(getUserByIdIR);


/** 'InsertCommentForUser' parameters type */
export interface IInsertCommentForUserParams {
  comment: {
    body: string | null | void,
    url: string | null | void,
    userId: string | null | void
  };
}

/** 'InsertCommentForUser' return type */
export interface IInsertCommentForUserResult {
  id: string;
  created: Date;
  updated: Date | null;
  deleted: Date | null;
  type: string;
  body: string;
  url: string;
  user_id: string;
}

/** 'InsertCommentForUser' query type */
export interface IInsertCommentForUserQuery {
  params: IInsertCommentForUserParams;
  result: IInsertCommentForUserResult;
}

const insertCommentForUserIR: any = {"name":"insertCommentForUser","params":[{"name":"comment","codeRefs":{"defined":{"a":115,"b":121,"line":10,"col":8},"used":[{"a":208,"b":214,"line":13,"col":8}]},"transform":{"type":"pick_tuple","keys":["body","url","userId"]}}],"usedParamSet":{"comment":true},"statement":{"body":"INSERT INTO \"comments\" (\"body\", \"url\", \"user_id\")\nVALUES :comment\nRETURNING *","loc":{"a":150,"b":226,"line":12,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "comments" ("body", "url", "user_id")
 * VALUES :comment
 * RETURNING *
 * ```
 */
export const insertCommentForUser = new PreparedQuery<IInsertCommentForUserParams,IInsertCommentForUserResult>(insertCommentForUserIR);


