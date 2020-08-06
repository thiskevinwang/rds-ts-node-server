BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE "users" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "attempts" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "comments" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "reactions" ALTER COLUMN id SET DEFAULT gen_random_uuid();

DROP EXTENSION IF EXISTS "uuid-ossp";
COMMIT;