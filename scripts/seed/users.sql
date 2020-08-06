/*
 @name GetOrCreateUser
 @param user -> (id, firstName, lastName, email, password, username)
 */
INSERT INTO users (id, first_name, last_name, email, "password", username)
  VALUES
    :user
  ON CONFLICT ON CONSTRAINT "pk_users_id"
    DO UPDATE SET
      id = users.id
    RETURNING
      *;

