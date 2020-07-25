/* 
 @name GetAttemptsByUserId
 */
SELECT
  *
FROM
  attempts
WHERE
  user_id = :userId;


/*
 @name GetUserById
 */
SELECT
  *
FROM
  users
WHERE
  id = :userId;

