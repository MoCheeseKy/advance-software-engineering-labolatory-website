import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Menggunakan DATABASE_URL lokal dengan fallback dummy string agar aman saat build time Docker
    url: process.env.DATABASE_URL || "postgresql://ase_admin:ase_password_super_rahasia@localhost:5432/ase_laboratory_db",
  },
});