// Supabase client helper for authentication, project asset storage, and remote metadata

export interface SupabaseConfig {
  url?: string;
  anonKey?: string;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
};

export const isSupabaseConfigured = (): boolean => {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.anonKey);
};

export async function uploadAssetToSupabase(file: Blob, path: string): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }
  // If configured, upload to Supabase storage bucket
  return null;
}
