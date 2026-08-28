import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email requis' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('utilisateurs')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, user: existing });
    }

    const { data: newUser, error } = await supabase
      .from('utilisateurs')
      .insert([{ email, mot_de_passe: '', created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
