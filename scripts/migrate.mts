import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const migrationName = process.argv[2];
if (!migrationName) {
  console.error('Please provide a migration name. Example: pnpm migrate init');
  process.exit(1);
}

spawnSync('npx', ['prisma', 'migrate', 'dev', '--name', migrationName], {
  stdio: 'inherit',
});

const migrationsDir = join(process.cwd(), 'prisma', 'migrations');
const matchedDir = readdirSync(migrationsDir).find((dir) =>
  dir.endsWith(`_${migrationName}`),
);

if (!matchedDir) {
  console.error(`Could not find migration folder for '${migrationName}'.`);
  process.exit(1);
}

const migrationFile = join(migrationsDir, matchedDir, 'migration.sql');
spawnSync('sh', ['-c', `turso db shell db < "${migrationFile}"`], {
  stdio: 'inherit',
});

console.log('Migration complete.');
