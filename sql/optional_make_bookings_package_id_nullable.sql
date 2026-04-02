-- Run once if POST /admin/bookings fails with:
--   Field 'package_id' doesn't have a default value
-- Drop FK first if present: SHOW CREATE TABLE bookings;
--   then ALTER TABLE bookings DROP FOREIGN KEY `<constraint_name>`;

ALTER TABLE bookings
  MODIFY COLUMN package_id INT NULL DEFAULT NULL;

-- Or remove the column entirely if you no longer need it:
-- ALTER TABLE bookings DROP COLUMN package_id;
