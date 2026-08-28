import { NextRequest, NextResponse } from 'next/server';
import { getNextNumeroInscription } from '@/lib/next-numero';

export async function GET(request: NextRequest) {
  try {
    const annee = parseInt(request.nextUrl.searchParams.get('annee') || '', 10);
    if (!Number.isFinite(annee)) {
      return NextResponse.json({ success: false, message: 'Année requise' }, { status: 400 });
    }

    const next = await getNextNumeroInscription('enfants_vacance', annee);
    return NextResponse.json({ success: true, next });
  } catch (err: unknown) {
    const message = (err instanceof Error ? err.message : (err as { message?: string })?.message) || 'Erreur serveur';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
