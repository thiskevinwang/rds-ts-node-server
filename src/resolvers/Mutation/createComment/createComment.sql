/*
 @name getUserById
 */
SELECT * FROM users 
WHERE id = :userId
LIMIT 1;

/*
 @name insertCommentForUser
 @param comment -> (body, url, userId)
 */
INSERT INTO "comments" ("body", "url", "user_id")
VALUES :comment
RETURNING *;