import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting database initialization...\n');

  try {
    // Step 1: Crea struttura database con Prisma
    console.log('📦 Step 1: Creating database schema...');
    
    // Controlla se ci sono migration
    const fs = require('fs');
    const path = require('path');
    const migrationsPath = path.join('/app/backend', 'prisma', 'migrations');
    const hasMigrations = fs.existsSync(migrationsPath) && 
                          fs.readdirSync(migrationsPath).length > 0;
    
    if (hasMigrations) {
      console.log('   Found migrations, using prisma migrate deploy...');
      try {
        execSync('npx prisma migrate deploy', {
          stdio: 'inherit',
          cwd: '/app/backend',
          env: process.env,
        });
        console.log('✅ Migrations deployed successfully\n');
      } catch (migrateError: any) {
        console.error('⚠️  Migration deploy failed:', migrateError.message);
        console.log('   Falling back to db push...');
        // Fallback a db push
        execSync('npx prisma db push --accept-data-loss --skip-generate', {
          stdio: 'inherit',
          cwd: '/app/backend',
          env: process.env,
        });
        console.log('✅ Database schema created with db push\n');
      }
    } else {
      console.log('   No migrations found, using prisma db push...');
      try {
        // Usa db push per creare lo schema direttamente dal schema.prisma
        execSync('npx prisma db push --accept-data-loss --skip-generate', {
          stdio: 'inherit',
          cwd: '/app/backend',
          env: process.env,
        });
        console.log('✅ Database schema created with db push\n');
      } catch (pushError: any) {
        console.error('❌ Prisma db push failed!');
        console.error('   Error:', pushError.message);
        // Non facciamo exit, proviamo comunque a continuare
        console.log('⚠️  Continuing anyway, schema might already exist...\n');
      }
    }

    // Step 2: Verifica se esiste già uno shop con slug 'mybarbershop'
    console.log('🔍 Step 2: Checking for existing shop...');
    
    // Prima cerca per slug specifico
    let shop = await prisma.shop.findFirst({
      where: { slug: 'mybarbershop' },
    });
    
    // Se non trovato, cerca qualsiasi shop attivo
    if (!shop) {
      shop = await prisma.shop.findFirst({
        where: { isActive: true },
      });
    }

    if (!shop) {
      console.log('📝 Creating shop, admin user, and barber...');
      
      // Crea Shop con slug 'mybarbershop'
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
      console.log(`✅ Shop created: ${shop.name} (slug: ${shop.slug}, id: ${shop.id})`);
    } else {
      console.log(`✅ Using existing shop: ${shop.name} (slug: ${shop.slug}, id: ${shop.id})`);
      
      // Se lo shop esiste ma ha uno slug diverso, aggiornalo
      if (shop.slug !== 'mybarbershop') {
        console.log(`⚠️  Shop has different slug '${shop.slug}', updating to 'mybarbershop'...`);
        shop = await prisma.shop.update({
          where: { id: shop.id },
          data: { slug: 'mybarbershop' },
        });
        console.log(`✅ Shop slug updated to 'mybarbershop'`);
      }
    }

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
      console.log(`✅ Admin user created: ${user.email}`);
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
      console.log(`✅ Barber created: ${barber.name}\n`);
    } else {
      console.log(`✅ Using existing shop: ${shop.name} (slug: ${shop.slug})\n`);
    }

    // Step 3: Aggiungi servizi barbershop
    console.log('💇 Step 3: Adding barbershop services...');

    const barbershopServices = [
      {
        name: 'Taglio Capelli',
        description: 'Taglio di capelli completo con forbici e macchinetta',
        durationMinutes: 30,
        priceAmount: 25.0,
        priceCurrency: 'EUR',
      },
      {
        name: 'Taglio + Barba',
        description: 'Taglio capelli completo con rifinitura barba',
        durationMinutes: 45,
        priceAmount: 35.0,
        priceCurrency: 'EUR',
      },
      {
        name: 'Rifinitura Barba',
        description: 'Rifinitura e modellatura della barba',
        durationMinutes: 20,
        priceAmount: 15.0,
        priceCurrency: 'EUR',
      },
      {
        name: 'Taglio + Barba + Shampoo',
        description: 'Taglio completo, rifinitura barba e shampoo',
        durationMinutes: 50,
        priceAmount: 40.0,
        priceCurrency: 'EUR',
      },
      {
        name: 'Shampoo',
        description: 'Lavaggio e trattamento capelli',
        durationMinutes: 15,
        priceAmount: 10.0,
        priceCurrency: 'EUR',
      },
      {
        name: 'Styling',
        description: 'Acconciatura e styling dei capelli',
        durationMinutes: 20,
        priceAmount: 12.0,
        priceCurrency: 'EUR',
      },
      {
        name: 'Taglio Bambino',
        description: 'Taglio capelli per bambini (fino a 12 anni)',
        durationMinutes: 25,
        priceAmount: 18.0,
        priceCurrency: 'EUR',
      },
      {
        name: 'Trattamento Capelli',
        description: 'Trattamento idratante e nutriente per capelli',
        durationMinutes: 30,
        priceAmount: 20.0,
        priceCurrency: 'EUR',
      },
      {
        name: 'Rasatura Classica',
        description: 'Rasatura tradizionale con rasoio a mano',
        durationMinutes: 25,
        priceAmount: 20.0,
        priceCurrency: 'EUR',
      },
      {
        name: 'Taglio + Styling',
        description: 'Taglio capelli con styling finale',
        durationMinutes: 40,
        priceAmount: 30.0,
        priceCurrency: 'EUR',
      },
      {
        name: 'Sfumatura',
        description: 'Sfumatura e degradè',
        durationMinutes: 35,
        priceAmount: 28.0,
        priceCurrency: 'EUR',
      },
      {
        name: 'Pacchetto Completo',
        description: 'Taglio, barba, shampoo e styling',
        durationMinutes: 60,
        priceAmount: 50.0,
        priceCurrency: 'EUR',
      },
    ];

    let addedCount = 0;
    let skippedCount = 0;

    for (const serviceData of barbershopServices) {
      // Controlla se il servizio esiste già (per nome)
      const existing = await prisma.service.findFirst({
        where: {
          shopId: shop!.id,
          name: serviceData.name,
        },
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      try {
        await prisma.service.create({
          data: {
            shopId: shop!.id,
            name: serviceData.name,
            description: serviceData.description,
            durationMinutes: serviceData.durationMinutes,
            priceAmount: serviceData.priceAmount,
            priceCurrency: serviceData.priceCurrency,
            isActive: true,
          },
        });
        addedCount++;
      } catch (error: any) {
        console.error(`❌ Error creating ${serviceData.name}:`, error.message);
      }
    }

    console.log(`✅ Services: ${addedCount} added, ${skippedCount} skipped\n`);

    // Riepilogo finale
    const totalServices = await prisma.service.count({
      where: { shopId: shop!.id, isActive: true },
    });

    console.log('🎉 Database initialization completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Shop: ${shop!.name} (${shop!.slug})`);
    console.log(`   Total active services: ${totalServices}`);
    console.log('\n✨ Ready to start the application!');
  } catch (error: any) {
    console.error('❌ Database initialization failed:', error);
    // Non facciamo exit con errore per permettere all'app di partire comunque
    // in caso di problemi minori (es. servizi già esistenti)
    console.error('⚠️  Continuing anyway...');
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    // Exit con codice 0 per non bloccare l'avvio dell'app
    process.exit(0);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

