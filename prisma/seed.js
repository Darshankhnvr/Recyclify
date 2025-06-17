// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- seed.js: Start seeding ---');
  // --- Seed Recycling Centers ---
  console.log(`Seeding recycling centers ...`);
  const centersData = [
    {
      name: "Community Recycling Drop-off",
      address: "789 Park Ave, Anytown, USA",
      city: "Anytown",
      postalCode: "12345",
      latitude: 34.0522, // Replace with actual lat
      longitude: -118.2437, // Replace with actual lng
      acceptedMaterials: JSON.stringify(["Cardboard", "Newspapers", "Glass Bottles"]),
      operatingHours: "Mon, Wed, Fri 8am-4pm",
    },
    {
      name: "Metro Waste Solutions",
      address: "101 Industrial Rd, Anytown, USA",
      city: "Anytown",
      postalCode: "12346",
      latitude: 34.0580, // Replace with actual lat
      longitude: -118.2330, // Replace with actual lng
      acceptedMaterials: JSON.stringify(["All Plastics #1-#7", "Aluminum Cans", "Tin Cans"]),
      operatingHours: "Mon-Sat 7am-6pm",
    },
    // Add 1-2 more if you like
  ];

  for (const center of centersData) {
    const existingCenter = await prisma.recyclingCenter.findFirst({
      where: { name: center.name, address: center.address },
    });
    if (!existingCenter) {
      await prisma.recyclingCenter.create({ data: center });
      console.log(`Created recycling center: "${center.name}"`);
    } else {
      console.log(`Recycling center "${center.name}" already exists, skipping.`);
    }
  }

  const guidesToSeed = [
    {
      slugToFind: 'understanding-plastic-recycling', // SLUG FOR WHERE CLAUSE
      updateData: { imageUrl: '/images/guides/plastic-recycling.avif' },
      createData: {
        title: 'Understanding Plastic Recycling: A Beginner\'s Guide',
        slug: 'understanding-plastic-recycling', // SLUG FOR CREATE
        category: 'Plastics',
        content: `... markdown ...`,
        imageUrl: '/images/guides/plastic-recycling.avif',
        published: true,
        publishedAt: new Date(),
      },
    },
    {
      slugToFind: 'paper-recycling-dos-and-donts',
      updateData: { imageUrl: '/images/guides/paper-recycling.avif' },
      createData: {
        title: 'Paper Recycling: Do\'s and Don\'ts',
        slug: 'paper-recycling-dos-and-donts',
        category: 'Paper',
        content: `... markdown ...`,
        imageUrl: '/images/guides/paper-recycling.avif',
        published: true,
        publishedAt: new Date(),
      },
    },
    {
      slugToFind: 'e-waste-recycling-essentials',
      updateData: { imageUrl: '/images/guides/ewaste-recycling.avif' },
      createData: {
        title: 'E-Waste Recycling Essentials',
        slug: 'e-waste-recycling-essentials',
        category: 'Electronics',
        content: `... markdown ...`,
        imageUrl: '/images/guides/ewaste-recycling.avif',
        published: true,
        publishedAt: new Date(),
      },
    }
  ];

  for (const guideData of guidesToSeed) {
    console.log(`--- seed.js: Processing slug: ${guideData.slugToFind} ---`);
    try {
      const result = await prisma.recyclingGuide.upsert({
        where: { slug: guideData.slugToFind },
        update: guideData.updateData,
        create: guideData.createData,
      });
      console.log(`--- seed.js: Upsert result for ${guideData.slugToFind}:`, result.id, result.imageUrl);
    } catch (error) {
      console.error(`--- seed.js: Error upserting ${guideData.slugToFind}:`, error);
    }
  }

  console.log('--- seed.js: Seeding finished. ---');
}

main()
  .catch((e) => {
    console.error('--- seed.js: MAIN CATCH ERROR ---', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('--- seed.js: Disconnecting Prisma ---');
    await prisma.$disconnect();
  });