/*
 @name getUserById
 */
SELECT * FROM users WHERE id = :userId; 

/*
 @name updatePasswordForUserId
 */
UPDATE users
SET "password" = :newHash
WHERE id = :userId;