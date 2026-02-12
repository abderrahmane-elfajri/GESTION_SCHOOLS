import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function TestPage() {
  let error: string | null = null;
  let success = false;
  let env = {};

  try {
    // Test environment variables
    env = {
      hasUrl: !!process.env.SUPABASE_URL,
      hasAnon: !!process.env.SUPABASE_ANON_KEY,
      hasPublicUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasPublicAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };

    // Test Supabase connection
    const supabase = createServerSupabaseClient();
    const { data, error: dbError } = await supabase.from("schools").select("id").limit(1);
    
    if (dbError) {
      error = dbError.message;
    } else {
      success = true;
    }
  } catch (err: any) {
    error = err.message || String(err);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Supabase Connection Test</h1>
        
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">Environment Variables</h2>
            <pre className="mt-2 text-sm text-slate-600">{JSON.stringify(env, null, 2)}</pre>
          </div>

          <div className={`rounded-lg border p-4 ${success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <h2 className={`font-semibold ${success ? 'text-green-900' : 'text-red-900'}`}>
              Connection Status: {success ? '✅ Success' : '❌ Failed'}
            </h2>
            {error && (
              <p className="mt-2 text-sm text-red-600">Error: {error}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <a href="/dashboard" className="text-sm text-primaire-600 hover:underline">← Back to Dashboard</a>
        </div>
      </div>
    </div>
  );
}
