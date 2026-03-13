import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config(); // .env
config({ path: ".env.local", override: true }); // .env.local (Next.js convention)

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
