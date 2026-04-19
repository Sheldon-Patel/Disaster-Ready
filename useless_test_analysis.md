# Useless Test Analysis

The following files have been identified as non-essential utility scripts, temporary logs, or debugging tools that do not contribute to the core functionality of the Disaster Ready platform. 

## Category 1: Testing & Debugging Scripts (Total: 34)
These scripts were used for one-off checks, manual testing of API endpoints, or database verification.
- `check-leaderboard.js`
- `test-quiz.js`
- `check-student-names.js`
- `check-grade-leaderboard.js`
- `check-school-leaderboard.js`
- `check-null-badges.js`
- `check-teacher-users.js`
- `check-profile.js`
- `check-admin-users.js`
- `backend/test-api.js`
- `backend/test-progress.js`
- `backend/test-db.js`
- `backend/test-chat.ts`
- `backend/check-protect.js`
- `backend/check-sheldon.js`
- `backend/check-mongo2.js`
- `backend/check-admin-creds.js`
- `backend/server-auth.js`
- `backend/test-db-modules.js`
- `backend/check-db.js`
- `backend/testPopulate.js`
- `backend/test-db-lookup.js`
- `backend/check-mongo.js`
- `backend/testSeed.ts`
- `backend/testBadge.js`
- `backend/run_seeder.ts`
- `backend/testBadge.js` (Duplicate)
- `backend/testSeed.ts` (Duplicate)

## Category 2: Migration & Maintenance Scripts
Used for one-time database updates or cleanups.
- `backend/migrateDb.cjs`
- `backend/updateModuleContent.js`
- `backend/cleanup.js`
- `backend/migrateProgress.js`
- `backend/reset_db.js`
- `backend/trimQuestions.js`
- `backend/drop-punjab-alerts.js`
- `backend/fix_db.js`
- `backend/fix-progress.js`
- `backend/clear_modules.js`
- `backend/restoreUser.js`
- `backend/fixUsers.cjs`
- `backend/findOrphans.js`
- `backend/checkProgress.js`

## Category 3: Temporary Data & Logs
- `backend/backend.log`
- `backend/error.log`
- `parsed-format.txt`
- `parse-pdf.js`

## Testing User to be Removed
- **Name**: Test User
- **Email**: testuser456@test.com
- **Reason**: User was added for manual testing and does not represent a real student or teacher.

---
**Plan**: I will move all the above files into a new root directory named `useless_test` to keep the workspace clean while preserving the scripts for future reference if needed.
