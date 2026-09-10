/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare global {
  interface Window {
    __appVersion: string
    __envMode: string
    __serverUrl: string | null
  }

  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL?: string
    readonly VITE_SUPABASE_ANON_KEY?: string
  }

  declare const __appVersion: string
  declare const __envMode: string
  declare const __serverUrl: string
}

export {}
