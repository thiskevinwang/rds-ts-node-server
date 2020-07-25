/* @name GetUserById */
SELECT
  *
FROM
  users
WHERE
  id = :userId;


/* 
 @name InsertTestUser
 @param user -> (firstName, lastName, email, password, username)
 */
INSERT INTO users (first_name, last_name, email, "password", username)
  VALUES
    :user
  RETURNING
    *;

