import { NextResponse } from "next/server";

import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

/**
 * Deployment diagnostic: reports whether the Supabase environment variables
 * resolved successfully (never exposes their values).
 */
export function GET() {
  return NextResponse.json({
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasSupabaseKey: Boolean(supabaseAnonKey),
  });
}
