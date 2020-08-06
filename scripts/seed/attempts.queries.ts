/** Types generated for queries found in "scripts/seed/attempts.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** Query 'GetAttemptsByUserId' is invalid, so its result is assigned type 'never' */
export type IGetAttemptsByUserIdResult = never;

/** Query 'GetAttemptsByUserId' is invalid, so its parameters are assigned type 'never' */
export type IGetAttemptsByUserIdParams = never;

const getAttemptsByUserIdIR: any = {"name":"GetAttemptsByUserId","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":78,"b":83,"line":7,"col":13}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT\n  *\nFROM\n  attempts\nWHERE\n  user_id = :userId","loc":{"a":32,"b":83,"line":2,"col":0}}};

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


/** Query 'InsertAttemptForUserId' is invalid, so its result is assigned type 'never' */
export type IInsertAttemptForUserIdResult = never;

/** Query 'InsertAttemptForUserId' is invalid, so its parameters are assigned type 'never' */
export type IInsertAttemptForUserIdParams = never;

const insertAttemptForUserIdIR: any = {"name":"InsertAttemptForUserId","params":[{"name":"attempt","codeRefs":{"defined":{"a":129,"b":135,"line":12,"col":8},"used":[{"a":240,"b":246,"line":16,"col":5}]},"transform":{"type":"pick_tuple","keys":["grade","send","date","userId"]}}],"usedParamSet":{"attempt":true},"statement":{"body":"INSERT INTO attempts (grade, \"send\", \"date\", user_id)\n  VALUES\n    :attempt\n  RETURNING\n    *","loc":{"a":172,"b":264,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO attempts (grade, "send", "date", user_id)
 *   VALUES
 *     :attempt
 *   RETURNING
 *     *
 * ```
 */
export const insertAttemptForUserId = new PreparedQuery<IInsertAttemptForUserIdParams,IInsertAttemptForUserIdResult>(insertAttemptForUserIdIR);


