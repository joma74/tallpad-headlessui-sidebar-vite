/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  // Only string type here to avoid hard to debug cast problems in your components!
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_BUILD_EPOCH?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

import "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    title?: string
  }
}

export {}
