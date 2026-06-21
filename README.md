Run Seeders

First run:
npm run seed:roles

Then:
npm run seed:admin

Migration file command
Then you can run:
npm run migrate
npm run migrate:undo
npm run migrate:status

Option 1:
npx sequelize-cli db:migrate --to 20260604153025-add-user-profile-fields.js
This will run all pending migrations up to and including that file.
Option 2: Undo a specific migration
npx sequelize-cli db:migrate:undo --name 20260604153025-add-user-profile-fields.js