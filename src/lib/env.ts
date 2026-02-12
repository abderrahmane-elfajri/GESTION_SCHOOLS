import { z } from "zod";

const serverSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional()
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1)
});

export const serverEnv = () => {
  try {
    return serverSchema.parse(process.env);
  } catch (error) {
    console.error("Server environment validation failed:", error);
    throw new Error("Missing required environment variables. Check your .env.local file.");
  }
};

export const clientEnv = () => {
  try {
    return clientSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });
  } catch (error) {
    console.error("Client environment validation failed:", error);
    throw new Error("Missing required client environment variables.");
  }
};
