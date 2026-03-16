if (!process.env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL is required in environment variables');
}

// ✅ Utiliser la SERVICE ROLE KEY pour bypasser les RLS policies côté backend
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY is required in environment variables');
}

module.exports = {
    supabase: {
        url: process.env.SUPABASE_URL,
        key: supabaseKey,
        options: {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            },
            db: {
                schema: 'public'
            },
            global: {
                headers: {
                    'Authorization': `Bearer ${supabaseKey}`
                }
            }
        }
    }
};
