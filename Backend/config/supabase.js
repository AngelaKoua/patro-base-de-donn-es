const { createClient } = require('@supabase/supabase-js');
const config = require('./database');

// Création du client Supabase
const supabase = createClient(config.supabase.url, config.supabase.key, config.supabase.options);

module.exports = supabase;