import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = path.join(process.cwd(), 'public');
const WEBP_QUALITY = 90; // 0-100
const PARALLEL_LIMIT = 10;

async function convertPngToWebp(
  filePath: string,
  outputPath: string,
  quality: number,
) {
  try {
    await sharp(filePath).webp({ quality }).toFile(outputPath);

    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error);
    throw error;
  }
}

async function processDirectory(
  directory: string,
): Promise<{ converted: number; skipped: number; deleted: number }> {
  let converted = 0;
  let skipped = 0;
  let deleted = 0;
  const stats = { converted, skipped, deleted };

  try {
    const files = await fs.promises.readdir(directory);

    const tasks: Promise<void>[] = [];

    for (const file of files) {
      const filePath = path.join(directory, file);
      const fileStats = await fs.promises.stat(filePath);

      if (fileStats.isDirectory()) {
        const subStats = await processDirectory(filePath);
        stats.converted += subStats.converted;
        stats.skipped += subStats.skipped;
        stats.deleted += subStats.deleted;
      } else if (file.toLowerCase().endsWith('.png')) {
        const webpPath = filePath.replace(/\.png$/i, '.webp');

        if (fs.existsSync(webpPath)) {
          try {
            await fs.promises.unlink(filePath);
            stats.deleted++;
            if (stats.deleted % 50 === 0) {
              console.log(`Deleted ${stats.deleted} PNG files so far...`);
            }
          } catch (err) {
            console.error(`Error deleting ${filePath}:`, err);
          }
        } else {
          tasks.push(
            convertPngToWebp(filePath, webpPath, WEBP_QUALITY)
              .then(() => {
                stats.converted++;
                stats.deleted++;
                if ((stats.converted + stats.deleted) % 50 === 0) {
                  console.log(
                    `Processed ${stats.converted + stats.deleted} files so far...`,
                  );
                }
              })
              .catch(() => {
                stats.skipped++;
              }),
          );

          if (tasks.length >= PARALLEL_LIMIT) {
            await Promise.all(tasks);
            tasks.length = 0;
          }
        }
      }
    }

    if (tasks.length > 0) {
      await Promise.all(tasks);
    }

    return stats;
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
    return stats;
  }
}

async function main() {
  console.log(`Starting PNG to WebP conversion in ${SOURCE_DIR}`);
  console.log(`WebP quality: ${WEBP_QUALITY}`);
  console.log(`WARNING: Original PNG files will be deleted after conversion!`);

  const startTime = Date.now();
  const stats = await processDirectory(SOURCE_DIR);
  const endTime = Date.now();

  console.log('\nConversion complete!');
  console.log(`Converted: ${stats.converted} images`);
  console.log(`Deleted: ${stats.deleted} PNG files`);
  console.log(`Skipped: ${stats.skipped} images`);
  console.log(
    `Time taken: ${((endTime - startTime) / 1000).toFixed(2)} seconds`,
  );
}

main().catch((error) => {
  console.error('Conversion failed:', error);
  process.exit(1);
});
