# Scripts di Seed per il Database

Questo documento spiega come eseguire gli script di seed per popolare il database.

## Script Disponibili

### 1. `seed.ts` - Seed Completo
Crea shop, admin user, barber e un servizio di esempio.

**Esecuzione locale:**
```bash
npm run seed
```

**Esecuzione su Railway:**
```bash
railway run --service backend npm run seed
```

### 2. `addServices.ts` - Aggiungi Servizi Barbershop
Aggiunge 12 servizi classici di un barbershop al database.

**Esecuzione locale:**
```bash
npm run seed:services
```

**Esecuzione su Railway:**
```bash
railway run --service backend npm run seed:services
```

## Servizi Inclusi

Lo script `addServices.ts` aggiunge i seguenti servizi:

1. **Taglio Capelli** - €25 (30 min)
2. **Taglio + Barba** - €35 (45 min)
3. **Rifinitura Barba** - €15 (20 min)
4. **Taglio + Barba + Shampoo** - €40 (50 min)
5. **Shampoo** - €10 (15 min)
6. **Styling** - €12 (20 min)
7. **Taglio Bambino** - €18 (25 min)
8. **Trattamento Capelli** - €20 (30 min)
9. **Rasatura Classica** - €20 (25 min)
10. **Taglio + Styling** - €30 (40 min)
11. **Sfumatura** - €28 (35 min)
12. **Pacchetto Completo** - €50 (60 min)

## Note

- Lo script `addServices.ts` trova automaticamente lo shop attivo esistente
- Se non trova uno shop, ne crea uno di default
- I servizi duplicati (stesso nome) vengono saltati
- Tutti i servizi vengono creati come attivi (`isActive: true`)

## Variabili d'Ambiente Richieste

Assicurati che `DATABASE_URL` sia configurata correttamente:

**Locale:**
```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

**Railway:**
La variabile `DATABASE_URL` viene configurata automaticamente quando si collega un database PostgreSQL al servizio.

