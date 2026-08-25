/**
 * Resolves the Supabase project configuration across naming conventions.
 *
 * The Vercel Marketplace integration provisions `NEXT_PUBLIC_SUPABASE_URL`
 * and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (new key format), while manual
 * setups commonly use `NEXT_PUBLIC_SUPABASE_ANON_KEY`. All are supported.
 *
 * Note: only `NEXT_PUBLIC_*` values reach the browser bundle (inlined at
 * build time); the unprefixed variants serve as a server-side fallback.
 */

function resolveUrl(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? undefined
  );
}

function resolveAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    undefined
  );
}

export const supabaseUrl = resolveUrl();
export const supabaseAnonKey = resolveAnonKey();

export function hasSupabaseConfig(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
