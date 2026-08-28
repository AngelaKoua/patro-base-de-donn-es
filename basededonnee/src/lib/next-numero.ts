import { supabase } from '@/lib/supabase';

type NumeroTable =
  | 'patronier_scolaire'
  | 'enfants_vacance'
  | 'scolaire_animateur'
  | 'vacance_animateur'
  | 'scolaire_directeur'
  | 'vacance_directeur'
  | 'scolaire_aumonier'
  | 'vacance_aumonier';

export async function getNextNumeroInscription(table: NumeroTable, annee: number): Promise<number> {
  const { data, error } = await supabase
    .from(table)
    .select('numero_inscription')
    .eq('annee', annee);

  if (error) throw error;

  const max = (data || []).reduce((acc, row) => {
    const n = parseInt(row.numero_inscription, 10);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);

  return max + 1;
}
