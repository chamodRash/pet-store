import './loadEnv'; // Load environment variables

import { PrismaClient } from '@prisma/client';
import { productsList } from './productsList';

console.log(`DATABASE_URL from env: ${process.env.DATABASE_URL}`); // Added for debugging

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Check existing products
  const existingProducts = await prisma.product.findMany({
    select: { paymentPriceId: true },
  });

  console.log({ existingProducts });

  const existingPriceIds = new Set(
    existingProducts.map((p) => p.paymentPriceId)
  );

  console.log({ productsList });

  // Create only products that don't exist
  for (const product of productsList) {
    const { ...productData } = product;
    if (!existingPriceIds.has(productData.stripePriceId)) {
      await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image,
          paymentPriceId: productData.stripePriceId,
          isFeatured: productData.isFeatured,
          createdAt: productData.createdAt,
          updatedAt: productData.updatedAt,
        },
      });
      console.log(`Created product: ${productData.name}`);
    } else {
      console.log(`Skipping existing product: ${productData.name}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
