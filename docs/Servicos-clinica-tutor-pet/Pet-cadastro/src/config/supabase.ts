import { createClient } from '@supabase/supabase-js'

// Substitua pelos seus dados reais do projeto no Supabase
const supabaseUrl = 'https://pevslqnuxclvqeorvlwx.supabase.co'
const supabaseAnonKey = 'sb_publishable_VQcPz4Ecg3V_iLwDplnn7g_Uc-nAA0z'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


