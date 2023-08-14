import { prisma } from '~/utils/db.server.ts'
import { deleteAllData } from '~/utils/db.server.ts'

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time('🧹 Cleaned up the database...')
	deleteAllData()
	console.timeEnd('🧹 Cleaned up the database...')

	console.time(`🔄 Creating initial user...`)
	const initUser = await prisma.user.create({
    data: {
      email: "taylor@nkeylabs.com",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });
	console.timeEnd(`✅ Created initial user`)

	console.time(`🔄 Creating initial habits...`)
	await Promise.all(
    getHabits().map((habit) => {
      const data =  { userId: initUser.id, ...habit };
      return prisma.habit.create({ data });
    })
  );
	console.timeEnd(`✅ Created initial habits`)

	console.timeEnd(`🌱 Database has been seeded`)
}

seed()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})


function getHabits() {
  return [
    {
      slug: "pushups",
      name: "10 Pushups",
      description: "Do a minimum of 10 pushups every day",
    },
    {
      slug: "brushdog",
      name: "Brush Beckham",
      description: "Brush Beckham for at least 3 minutes per day",
    },
    {
      slug: "emails",
      name: "Emails",
      description: "Process Emails for at least 2 minutes per day",
    },
  ];
}
/*
eslint
	@typescript-eslint/no-unused-vars: "off",
*/

