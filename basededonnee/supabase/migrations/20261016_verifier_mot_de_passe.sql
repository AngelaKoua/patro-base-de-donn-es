-- Vérifie un mot de passe directement dans Postgres avec pgcrypto, pour que les mots de passe
-- définis depuis le SQL Editor (extensions.crypt(..., extensions.gen_salt('bf'))) soient toujours reconnus.
create extension if not exists pgcrypto with schema extensions;

create or replace function public.verifier_mot_de_passe(p_email text, p_mot_de_passe text)
returns boolean
language sql
stable
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1
    from utilisateurs
    where lower(email) = lower(trim(p_email))
      and mot_de_passe like '$2%'
      and mot_de_passe = extensions.crypt(p_mot_de_passe, mot_de_passe)
  );
$$;

revoke execute on function public.verifier_mot_de_passe(text, text) from public, anon, authenticated;
grant execute on function public.verifier_mot_de_passe(text, text) to service_role;
