import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getNextNumeroInscription } from '@/lib/next-numero';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('scolaire_animateur')
      .select('*')
      .order('annee', { ascending: false })
      .order('nom', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, animateurs: data || [] });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.annee) {
      return NextResponse.json({ success: false, message: 'Année requise' }, { status: 400 });
    }

    const numero_inscription = String(await getNextNumeroInscription('scolaire_animateur', body.annee));

    const { data, error } = await supabase
      .from('scolaire_animateur')
      .insert([{ ...body, numero_inscription }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, animateur: data }, { status: 201 });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
