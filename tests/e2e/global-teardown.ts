import { db } from '@/lib/db';

const globalTeardown = async () => {
  await db.$transaction(async (tx) => {
    await tx.user.deleteMany({
      where: {
        AND: [
          { email: { startsWith: 'playwright-test-' } },
          { email: { endsWith: '@candlezone.eu' } },
        ],
      },
    });
    await tx.portfolio.deleteMany({
      where: {
        user: {
          AND: [
            { email: { startsWith: 'playwright-test-' } },
            { email: { endsWith: '@candlezone.eu' } },
          ],
        },
      },
    });
  });

  await db.$disconnect();
};

export default globalTeardown;
