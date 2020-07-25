/* @name GetAttemptsByUserId */
SELECT
  *
FROM
  attempts
WHERE
  user_id = :userId;


/*
 @name InsertAttemptForUserId
 @param attempt -> (grade, send, date, userId)
 */
INSERT INTO attempts (grade, "send", "date", user_id)
  VALUES
    :attempt
  RETURNING
    *;

