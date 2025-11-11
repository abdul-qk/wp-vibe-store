/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WOOCOMMERCE_BASE_URL?: string
  readonly VITE_WOOCOMMERCE_CONSUMER_KEY?: string
  readonly VITE_WOOCOMMERCE_CONSUMER_SECRET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

