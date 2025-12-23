import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Crea Shop
  const shop = await prisma.shop.create({
    data: {
      name: 'My Barbershop',
      slug: 'mybarbershop',
      settings: {
        openingTime: '09:00',
        closingTime: '19:00',
        timezone: 'Europe/Rome',
        slotDurationMinutes: 30,
        bookingAdvanceDays: 30,
      },
      isActive: true,
    },
  });

  console.log('✅ Shop created:', shop.name, '(', shop.slug, ')');

  // Crea Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'admin@barbershop.com',
      passwordHash,
      role: 'ADMIN',
      shopId: shop.id,
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', user.email);
  console.log('🔑 Password: admin123 (CHANGE THIS AFTER FIRST LOGIN!)');

  // Crea un Barber di esempio
  const barber = await prisma.barber.create({
    data: {
      shopId: shop.id,
      name: 'Mario Rossi',
      workSchedule: {
        monday: { start: '09:00', end: '18:00', isWorking: true },
        tuesday: { start: '09:00', end: '18:00', isWorking: true },
        wednesday: { start: '09:00', end: '18:00', isWorking: true },
        thursday: { start: '09:00', end: '18:00', isWorking: true },
        friday: { start: '09:00', end: '18:00', isWorking: true },
        saturday: { start: '09:00', end: '13:00', isWorking: true },
        sunday: { start: '09:00', end: '13:00', isWorking: false },
      },
      isActive: true,
    },
  });

  console.log('✅ Barber created:', barber.name);

  // Crea un Service di esempio
  const service = await prisma.service.create({
    data: {
      shopId: shop.id,
      name: 'Taglio Capelli',
      description: 'Taglio di capelli completo',
      durationMinutes: 30,
      priceAmount: 25.00,
      priceCurrency: 'EUR',
      isActive: true,
    },
  });

  console.log('✅ Service created:', service.name, '- €', service.priceAmount);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   Shop: ${shop.name} (slug: ${shop.slug})`);
  console.log(`   Admin: ${user.email} / admin123`);
  console.log(`   Barber: ${barber.name}`);
  console.log(`   Service: ${service.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

