BEGIN;
DO $$ BEGIN
	CREATE TYPE "Reactions_variant_enum"
		AS ENUM ('Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry', 'None');
EXCEPTION
	WHEN duplicate_object THEN
		RAISE NOTICE 'Reactions_variant_enum already exists. Skipping...';
END $$;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS "reactions" (
  "id" uuid DEFAULT uuid_generate_v4 (),
  "created" timestamp NOT NULL DEFAULT now(),
  "updated" timestamp DEFAULT now(),
  "deleted" timestamp,
  "type" character varying NOT NULL DEFAULT 'Reaction',
  "variant" "Reactions_variant_enum" NOT NULL DEFAULT 'None',
  "comment_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  CONSTRAINT "pk_reactions_id" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "comments" (
  "id" uuid DEFAULT uuid_generate_v4 (),
  "created" timestamp NOT NULL DEFAULT now(),
  "updated" timestamp DEFAULT now(),
  "deleted" timestamp,
  "type" character varying NOT NULL DEFAULT 'Comment',
  "body" character varying NOT NULL,
  "url" character varying NOT NULL,
  "user_id" uuid NOT NULL,
  CONSTRAINT "pk_comments_id" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid DEFAULT uuid_generate_v4 (),
  "created" timestamp NOT NULL DEFAULT now(),
  "updated" timestamp DEFAULT now(),
  "deleted" timestamp,
  "type" character varying NOT NULL DEFAULT 'User',
  "username" character varying(25) NOT NULL,
  "email" character varying(62) NOT NULL,
  "password" character varying NOT NULL DEFAULT 'password',
  "first_name" character varying(50) NOT NULL,
  "last_name" character varying(50) NOT NULL,
  "avatar_url" character varying(255),
  "last_password_request" timestamp,
  "verified_date" timestamp,
  "banned" boolean,
  CONSTRAINT "uq_users_username" UNIQUE ("username"),
  CONSTRAINT "uq_users_email" UNIQUE ("email"),
  CONSTRAINT "pk_users_id" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "attempts" (
  "id" uuid DEFAULT uuid_generate_v4 (),
  "created" timestamp NOT NULL DEFAULT now(),
  "updated" timestamp DEFAULT now(),
  "deleted" timestamp,
  "grade" integer NOT NULL,
  "send" boolean,
  "flash" boolean,
  "date" timestamp,
  "user_id" uuid NOT NULL,
  CONSTRAINT "pk_attempts_id" PRIMARY KEY ("id")
);
-- reactions
DO $$
BEGIN
  ALTER TABLE "reactions"
    ADD CONSTRAINT "fk_reactions_comment_id" FOREIGN KEY ("comment_id") REFERENCES "comments" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Constraint already exists. Ignoring...';
END
$$;
DO $$
BEGIN
  ALTER TABLE "reactions"
    ADD CONSTRAINT "fk_reactions_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Constraint already exists. Ignoring...';
END
$$;
-- comments
DO $$
BEGIN
  ALTER TABLE "comments"
    ADD CONSTRAINT "fk_comments_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Constraint already exists. Ignoring...';
END
$$;
-- Attempts
DO $$
BEGIN
  ALTER TABLE "attempts"
    ADD CONSTRAINT "fk_attemps_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Constraint already exists. Ignoring...';
END
$$;
COMMIT;

