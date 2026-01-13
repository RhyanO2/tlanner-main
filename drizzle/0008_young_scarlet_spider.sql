-- -- Adiciona a coluna com valor padrão
-- -- ALTER TABLE "Users" ADD COLUMN "ispremium" boolean DEFAULT false;

-- -- -- Atualiza registros existentes
-- -- UPDATE "Users" SET "ispremium" = false WHERE "ispremium" IS NULL;

-- -- -- Torna a coluna NOT NULL
-- -- ALTER TABLE "Users" ALTER COLUMN "ispremium" SET NOT NULL;

-- -- -- Remove o default (opcional)
-- -- ALTER TABLE "Users"  COLUMN "ispremium" DROP DEFAULT;
-- ALTER TABLE "Users" ADD COLUMN "provider" SET DEFAULT 'email';