import { db } from '@/lib/db';

export const POST = async () => {
  const { id } = await db.user.create({
    data: {
      email: 'cron-test-234094687230896709384673928476@test.com',
      name: 'cron-temp',
    },
    select: { id: true },
  });

  await db.user.delete({
    where: { id },
  });

  return new Response('OK', { status: 200 });
};
