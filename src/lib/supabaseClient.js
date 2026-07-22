import { createClient } from '@supabase/supabase-js';

// Cole aqui a sua Project URL (começa com https://...)
const supabaseUrl = 'https://sygutowcrfxmbaybqzuu.supabase.co'; 

// Cole aqui a sua API Key anon/public
const supabaseKey = 'sb_publishable_GA3uX9MroYRnvmlqiyBepw_pGl6EKyy';

export const supabase = createClient(supabaseUrl, supabaseKey);