import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;
export const supabase = createClient(env.SUPABASE_URL, supabaseKey);
