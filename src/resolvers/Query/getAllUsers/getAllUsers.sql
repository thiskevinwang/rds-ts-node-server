/* 
 @name GetAllUsers
 */
SELECT
  *
FROM
  users;


/*
 @name GetAttemptsForUserId
 */
SELECT
  *
FROM
  attempts
WHERE
  user_id = :userId;


/*
 @name GetCommentsForUserId
 */
SELECT
  *
FROM
  comments
WHERE
  user_id = :userId;


/*
 @name GetReactionsForUserId
 */
SELECT
  *
FROM
  reactions
WHERE
  user_id = :userId;

