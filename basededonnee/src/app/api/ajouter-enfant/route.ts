import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getNextNumeroInscription } from '@/lib/next-numero';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, prenom, naissance, sexe, classe, section, religion, annee } = body;

    if (!nom || !prenom || !annee) {
      return NextResponse.json({ success: false, message: 'Nom, prénom et année sont requis' }, { status: 400 });
    }

    const numero_inscription = String(await getNextNumeroInscription('patronier_scolaire', annee));

    const { data, error } = await supabase
      .from('patronier_scolaire')
      .insert([{ numero_inscription, nom, prenom, naissance, sexe, classe, section, religion, annee }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, enfant: data }, { status: 201 });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
