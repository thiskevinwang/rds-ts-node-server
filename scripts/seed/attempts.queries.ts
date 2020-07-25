/** Types generated for queries found in "scripts/seed/attempts.sql" */
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


/** 'InsertAttemptForUserId' parameters type */
export interface IInsertAttemptForUserIdParams {
  attempt: {
    grade: number | null | void,
    send: boolean | null | void,
    date: Date | null | void,
    userId: string | null | void
  };
}

/** 'InsertAttemptForUserId' return type */
export interface IInsertAttemptForUserIdResult {
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

/** 'InsertAttemptForUserId' query type */
export interface IInsertAttemptForUserIdQuery {
  params: IInsertAttemptForUserIdParams;
  result: IInsertAttemptForUserIdResult;
}

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


