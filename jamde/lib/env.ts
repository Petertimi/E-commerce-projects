import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url().or(z.string().startsWith("postgres")),
  AUTH_SECRET: z.string().min(20),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const clientEnvSchema = z.object({});

const rawServerEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  NODE_ENV: process.env.NODE_ENV,
};

const parsedServer = serverEnvSchema.safeParse(rawServerEnv);
if (!parsedServer.success) {
  // Only throw on server during startup; list all issues clearly
  const formatted = parsedServer.error.format();
  throw new Error(`Invalid server environment variables.\n${JSON.stringify(formatted, null, 2)}`);
}

export const env = {
  ...parsedServer.data,
  // No client envs yet; add as needed and expose via next.config if required
  client: clientEnvSchema.parse({}),
};


