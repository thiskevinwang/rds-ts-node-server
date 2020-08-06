/** Types generated for queries found in "scripts/seed/users.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** Query 'GetOrCreateUser' is invalid, so its result is assigned type 'never' */
export type IGetOrCreateUserResult = never;

/** Query 'GetOrCreateUser' is invalid, so its parameters are assigned type 'never' */
export type IGetOrCreateUserParams = never;

const getOrCreateUserIR: any = {"name":"GetOrCreateUser","params":[{"name":"user","codeRefs":{"defined":{"a":34,"b":37,"line":3,"col":8},"used":[{"a":188,"b":191,"line":7,"col":5}]},"transform":{"type":"pick_tuple","keys":["id","firstName","lastName","email","password","username"]}}],"usedParamSet":{"user":true},"statement":{"body":"INSERT INTO users (id, first_name, last_name, email, \"password\", username)\n  VALUES\n    :user\n  ON CONFLICT ON CONSTRAINT \"pk_users_id\"\n    DO UPDATE SET\n      id = users.id\n    RETURNING\n      *","loc":{"a":99,"b":293,"line":5,"col":0}}};

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
export const getOrCreateUser = new PreparedQuery<IGetOrCreateUserParams,IGetOrCreateUserResult>(getOrCreateUserIR);


