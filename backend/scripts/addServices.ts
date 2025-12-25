import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Servizi classici di un barbershop
const barbershopServices = [
  {
    name: 'Taglio Capelli',
    description: 'Taglio di capelli completo con forbici e macchinetta',
    durationMinutes: 30,
    priceAmount: 25.00,
    priceCurrency: 'EUR',
  },
  {
    name: 'Taglio + Barba',
    description: 'Taglio capelli completo con rifinitura barba',
    durationMinutes: 45,
    priceAmount: 35.00,
    priceCurrency: 'EUR',
  },
  {
    name: 'Rifinitura Barba',
    description: 'Rifinitura e modellatura della barba',
    durationMinutes: 20,
    priceAmount: 15.00,
    priceCurrency: 'EUR',
  },
  {
    name: 'Taglio + Barba + Shampoo',
    description: 'Taglio completo, rifinitura barba e shampoo',
    durationMinutes: 50,
    priceAmount: 40.00,
    priceCurrency: 'EUR',
  },
  {
    name: 'Shampoo',
    description: 'Lavaggio e trattamento capelli',
    durationMinutes: 15,
    priceAmount: 10.00,
    priceCurrency: 'EUR',
  },
  {
    name: 'Styling',
    description: 'Acconciatura e styling dei capelli',
    durationMinutes: 20,
    priceAmount: 12.00,
    priceCurrency: 'EUR',
  },
  {
    name: 'Taglio Bambino',
    description: 'Taglio capelli per bambini (fino a 12 anni)',
    durationMinutes: 25,
    priceAmount: 18.00,
    priceCurrency: 'EUR',
  },
  {
    name: 'Trattamento Capelli',
    description: 'Trattamento idratante e nutriente per capelli',
    durationMinutes: 30,
    priceAmount: 20.00,
    priceCurrency: 'EUR',
  },
  {
    name: 'Rasatura Classica',
    description: 'Rasatura tradizionale con rasoio a mano',
    durationMinutes: 25,
    priceAmount: 20.00,
    priceCurrency: 'EUR',
  },
  {
    name: 'Taglio + Styling',
    description: 'Taglio capelli con styling finale',
    durationMinutes: 40,
    priceAmount: 30.00,
    priceCurrency: 'EUR',
  },
  {
    name: 'Sfumatura',
    description: 'Sfumatura e degradè',
    durationMinutes: 35,
    priceAmount: 28.00,
    priceCurrency: 'EUR',
  },
  {
    name: 'Pacchetto Completo',
    description: 'Taglio, barba, shampoo e styling',
    durationMinutes: 60,
    priceAmount: 50.00,
    priceCurrency: 'EUR',
  },
];

async function main() {
  console.log('🌱 Starting services seed...\n');

  // Cerca lo shop esistente (usa il primo shop attivo o crea uno di default)
  let shop = await prisma.shop.findFirst({
    where: { isActive: true },
  });

  if (!shop) {
    console.log('⚠️  No active shop found. Creating default shop...');
    shop = await prisma.shop.create({
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
    console.log(`✅ Created shop: ${shop.name} (slug: ${shop.slug})\n`);
  } else {
    console.log(`✅ Using existing shop: ${shop.name} (slug: ${shop.slug})\n`);
  }

  // Controlla se ci sono già servizi
  const existingServices = await prisma.service.findMany({
    where: { shopId: shop.id },
  });

  if (existingServices.length > 0) {
    console.log(`ℹ️  Found ${existingServices.length} existing service(s).`);
    console.log('   Adding new services (skipping duplicates by name)...\n');
  }

  // Aggiungi servizi
  let addedCount = 0;
  let skippedCount = 0;

  for (const serviceData of barbershopServices) {
    // Controlla se il servizio esiste già (per nome)
    const existing = await prisma.service.findFirst({
      where: {
        shopId: shop.id,
        name: serviceData.name,
      },
    });

    if (existing) {
      console.log(`⏭️  Skipped: ${serviceData.name} (already exists)`);
      skippedCount++;
      continue;
    }

    try {
      const service = await prisma.service.create({
        data: {
          shopId: shop.id,
          name: serviceData.name,
          description: serviceData.description,
          durationMinutes: serviceData.durationMinutes,
          priceAmount: serviceData.priceAmount,
          priceCurrency: serviceData.priceCurrency,
          isActive: true,
        },
      });

      console.log(
        `✅ Created: ${service.name} - €${service.priceAmount} (${service.durationMinutes} min)`,
      );
      addedCount++;
    } catch (error: any) {
      console.error(`❌ Error creating ${serviceData.name}:`, error.message);
    }
  }

  console.log('\n🎉 Services seed completed!');
  console.log(`\n📊 Summary:`);
  console.log(`   Shop: ${shop.name} (${shop.slug})`);
  console.log(`   Services added: ${addedCount}`);
  console.log(`   Services skipped: ${skippedCount}`);
  console.log(`   Total services: ${existingServices.length + addedCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

