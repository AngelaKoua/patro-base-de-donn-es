import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const annee = request.nextUrl.searchParams.get('annee');
    if (!annee) return NextResponse.json({ success: false, message: 'Année requise' }, { status: 400 });

    const { data: enfants, error: enfantsError } = await supabase
      .from('enfants_vacance')
      .select('id, section')
      .eq('annee', annee);

    if (enfantsError) throw enfantsError;
    if (!enfants || enfants.length === 0) return NextResponse.json({ success: true, data: [] });

    const enfantIds = enfants.map((e: { id: number }) => e.id);
    const { data: details, error: detailsError } = await supabase
      .from('details_enfant_vacance')
      .select('enfant_id, nombre_presence, nombre_presence_totale')
      .in('enfant_id', enfantIds);

    if (detailsError) throw detailsError;

    const detailsMap: Record<number, { nombre_presence: number; nombre_presence_totale: number }> = {};
    (details || []).forEach((d: { enfant_id: number; nombre_presence: number; nombre_presence_totale: number }) => {
      detailsMap[d.enfant_id] = d;
    });

    const sectionRates: Record<string, { totalRate: number; count: number }> = {};
    enfants.forEach((e: { id: number; section: string }) => {
      const section = e.section || 'Non défini';
      if (!sectionRates[section]) sectionRates[section] = { totalRate: 0, count: 0 };
      const detail = detailsMap[e.id];
      if (detail && detail.nombre_presence_totale > 0) {
        sectionRates[section].totalRate += detail.nombre_presence / detail.nombre_presence_totale;
        sectionRates[section].count++;
      }
    });

    const formattedData = Object.entries(sectionRates)
      .map(([section, d]) => ({
        section,
        taux: d.count > 0 ? Number(((d.totalRate / d.count) * 100).toFixed(2)) : 0,
        count: d.count,
      }))
      .filter((item) => item.count > 0);

    return NextResponse.json({ success: true, data: formattedData });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as {message?: string})?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
