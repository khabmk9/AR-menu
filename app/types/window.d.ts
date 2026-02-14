declare global {
  interface Window {
    ENV: {
      SUPABASE_PROJECT_URL: string;
      SUPABASE_API_KEY: string;
    };
  }
}

export {};
