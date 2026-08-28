import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id: _id,
      evenement_id,
      nb_patronnes_attendus,
      nb_patronnes_presents,
      taux_participation_patronnes,
      nb_animateurs_attendus,
      nb_animateurs_presents,
      taux_participation_animateurs,
      ...rest
    } = body;

    const evenementIdNum = Number(evenement_id);
    if (!evenement_id || !Number.isFinite(evenementIdNum)) {
      return NextResponse.json({ success: false, message: 'evenement_id requis' }, { status: 400 });
    }

    const toNumOrNull = (value: unknown) => {
      if (value === '' || value === null || value === undefined) return null;
      const n = Number(value);
      return Number.isNaN(n) ? null : n;
    };
    // nb_* sont des colonnes entières (int32) : un nombre décimal saisi par erreur
    // ferait échouer l'insertion Postgres avec "invalid input syntax for type integer".
    const toIntOrNull = (value: unknown) => {
      const n = toNumOrNull(value);
      return n === null ? null : Math.round(n);
    };

    const { data, error } = await supabase
      .from('detail_evenement_vacance')
      .upsert([{
        evenement_id: evenementIdNum,
        ...rest,
        nb_patronnes_attendus: toIntOrNull(nb_patronnes_attendus),
        nb_patronnes_presents: toIntOrNull(nb_patronnes_presents),
        taux_participation_patronnes: toNumOrNull(taux_participation_patronnes),
        nb_animateurs_attendus: toIntOrNull(nb_animateurs_attendus),
        nb_animateurs_presents: toIntOrNull(nb_animateurs_presents),
        taux_participation_animateurs: toNumOrNull(taux_participation_animateurs),
      }], { onConflict: 'evenement_id' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, detail: data });
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === '23503') {
      return NextResponse.json({ success: false, message: 'Évènement non trouvé' }, { status: 404 });
    }
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
