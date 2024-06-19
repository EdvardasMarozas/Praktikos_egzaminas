# Praktikos_egzaminas

Žignsniai pasileisti projektą

1.  Klonavimas iš GitHub
Susisraskite tuščia katalogą ir jame atidarykite terminalą.

Iveskite komanda 'git clone git@github.com:EdvardasMarozas/Praktikos_egzaminas.git' Svarbu paskiau įeiti į ta katalogą, kurį sukūrė git'as.

2. Frontend'o (Vite React) paleidimas
cd FrontEnd
npm install
npm run dev

3. Sukonfigūruokite duomenų bazę:
cd BackEnd
npm install

4. BackEnd'e pridėkite .env failą kuriame yra:
DATABASE_URL="mysql://vartotojas:slaptazodis@localhost:port'as/db_pavadinimas"
susikonfiguruokite teisingai DATABASE_URL kad duomenu baze butu susieta

5. Sukurkite ir migruokite duomenų bazę naudodami Prisma:
npx prisma migrate dev --name initial_migration

Jei reikia, sukurkite Prisma klientą:
npx prisma generate

6. Paleiskite backend serverį:
npm run start

Tada belieka tik nueiti į pačia svetaine. Sveitainės adresas yra: http://localhost:5173/