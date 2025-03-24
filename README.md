# Candlezone

A website to analyze stocks.

npx prisma migrate dev --name init
turso db shell candlezone-db < ./prisma/migrations/20241103145733_init/migration.sql
