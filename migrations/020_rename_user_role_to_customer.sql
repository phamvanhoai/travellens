ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

UPDATE users
SET role = 'customer'
WHERE role = 'user';

ALTER TABLE users
    ADD CONSTRAINT users_role_check
    CHECK (role IN ('guest', 'customer', 'staff', 'admin'));
