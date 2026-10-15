// Définit (ou réinitialise) le mot de passe d'un utilisateur dans Supabase, haché avec bcryptjs
// (la même bibliothèque que /api/userlogin), puis teste la connexion sur l'API configurée.
// Usage, depuis le dossier basededonnee :  node scripts/set-password.mjs email@exemple.com
import { createRequire } from 'module';
import readline from 'readline';
const require = createRequire(import.meta.url);
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('='))
  .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; }));
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const email = (process.argv[2] || '').trim().toLowerCase();
if (!email) {
  console.error('Usage : node scripts/set-password.mjs email@exemple.com');
  process.exit(1);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const pwd = await new Promise((r) => rl.question('Nouveau mot de passe (6 caractères min.) : ', (a) => { rl.close(); r(a); }));
if (pwd.length < 6) {
  console.error('Mot de passe trop court.');
  process.exit(1);
}

const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY, { auth: { persistSession: false } });
const hash = bcrypt.hashSync(pwd, 10);

const { data: existing } = await sb.from('utilisateurs').select('id').eq('email', email).maybeSingle();
const { error } = existing
  ? await sb.from('utilisateurs').update({ mot_de_passe: hash }).eq('id', existing.id)
  : await sb.from('utilisateurs').insert([{ email, mot_de_passe: hash, created_at: new Date().toISOString() }]);
if (error) {
  console.error('Erreur Supabase :', error.message);
  process.exit(1);
}
console.log(existing ? 'Mot de passe mis à jour.' : 'Utilisateur créé.');

const res = await fetch(env.NEXT_PUBLIC_API_URL.trim() + '/api/userlogin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, mot_de_passe: pwd }),
});
const body = await res.json();
console.log('Test de connexion :', res.status, body.Message ?? body.message);
