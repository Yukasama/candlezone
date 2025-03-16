import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import * as os from 'node:os';
import { join } from 'node:path';

const isWindows = os.platform() === 'win32';

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

if (isWindows) {
  const sqlContent = readFileSync(migrationFile, 'utf8');

  const tempFile = join(os.tmpdir(), `turso_migration_${Date.now()}.sql`);
  const fs = require('fs');
  fs.writeFileSync(tempFile, sqlContent);

  spawnSync(
    'powershell',
    ['-Command', `Get-Content "${tempFile}" | turso db shell db`],
    {
      stdio: 'inherit',
    },
  );

  try {
    fs.unlinkSync(tempFile);
  } catch (err) {
    console.warn('Warning: Could not remove temporary file:', tempFile);
  }
} else {
  console.log('Applying migration to Turso on macOS/Linux...');

  spawnSync('sh', ['-c', `turso db shell db < "${migrationFile}"`], {
    stdio: 'inherit',
  });
}

console.log('Migration complete.');
