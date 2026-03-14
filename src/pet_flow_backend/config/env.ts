import { z } from "zod";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const envSchema = z.object({
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
    PORT: z.string().default("3000").transform(Number),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    process.exit(1);
}

export const env = _env.data;
