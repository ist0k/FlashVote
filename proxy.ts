import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  hasSupabaseConfig,
  supabaseAnonKey,
  supabaseUrl,
} from "@/lib/supabase/config";
import { proxiedFetch } from "@/lib/supabase/fetch";

export async function proxy(request: NextRequest) {
  // Missing configuration must not take the whole site down; pages that need
  // Supabase surface actionable errors themselves.
  if (!hasSupabaseConfig()) {
    console.warn("[proxy] Supabase environment variables are not set");
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    global: {
      fetch: proxiedFetch,
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
