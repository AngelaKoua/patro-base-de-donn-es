import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('scolaire_evenement')
      .select('*')
      .order('date_debut', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, evenements: data || [] });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { evenement, date_debut, date_fin, cible, annee } = body;

    if (!evenement) {
      return NextResponse.json({ success: false, message: 'Nom de l\'évènement requis' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('scolaire_evenement')
      .insert([{ evenement, date_debut, date_fin, cible, annee }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, evenement: data }, { status: 201 });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
