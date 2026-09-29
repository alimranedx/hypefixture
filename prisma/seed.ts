import { seedDatabase } from '../src/lib/seed';

async function main() {
  await seedDatabase();
}

main()
  .then(() => {
    console.log('Seeding completed successfully.');
    process.exit(0);
  })
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  });
