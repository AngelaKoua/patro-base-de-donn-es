import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  let queryResult: unknown = null;
  let queryError: unknown = null;

  try {
    const { data, error } = await supabase.from('patronier_scolaire').select('count').limit(1);
    queryResult = data;
    queryError = error ? JSON.stringify(error) : null;
  } catch (err: unknown) {
    queryError = err instanceof Error
      ? { message: err.message, stack: err.stack?.slice(0, 500) }
      : JSON.stringify(err);
  }

  return NextResponse.json({
    supabaseUrl: process.env.SUPABASE_URL ? 'SET (' + process.env.SUPABASE_URL.slice(0, 30) + '...)' : 'NOT SET',
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    nodeVersion: process.version,
    tlsRejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED,
    queryResult,
    queryError,
  });
}
