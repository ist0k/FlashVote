let dispatcherPromise: Promise<unknown> | null = null;

function hasProxyEnv(): boolean {
  return Boolean(
    process.env.HTTPS_PROXY ??
      process.env.https_proxy ??
      process.env.HTTP_PROXY ??
      process.env.http_proxy,
  );
}

type FetchInput = Parameters<typeof fetch>[0];
type FetchInit = Parameters<typeof fetch>[1];

/**
 * Node's global fetch ignores HTTP(S)_PROXY environment variables, which breaks
 * server-side Supabase calls on machines behind a corporate proxy. Installing
 * undici's EnvHttpProxyAgent once fixes this; in environments without proxy
 * variables it is a no-op, so production behavior is unchanged.
 */
export async function proxiedFetch(
  input: FetchInput,
  init?: FetchInit,
): Promise<Response> {
  if (hasProxyEnv()) {
    dispatcherPromise ??= import("undici").then(({ EnvHttpProxyAgent, setGlobalDispatcher }) =>
      setGlobalDispatcher(new EnvHttpProxyAgent()),
    );
    await dispatcherPromise;
  }
  return fetch(input, init);
}
