import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('patronier_scolaire')
      .select('*')
      .order('annee', { ascending: false })
      .order('nom', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, enfants: data || [] });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, prenom, date_naissance, sexe, classe, section, annee, telephone_parent, nom_parent } = body;

    if (!nom || !prenom || !annee) {
      return NextResponse.json({ success: false, message: 'Nom, prénom et année sont requis' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('patronier_scolaire')
      .insert([{ nom, prenom, date_naissance, sexe, classe, section, annee, telephone_parent, nom_parent }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, enfant: data }, { status: 201 });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
