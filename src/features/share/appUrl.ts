/** Address where the app is served: origin plus the deployment sub-path, resolved at runtime. */
export function getAppUrl(): string {
  return new URL(import.meta.env.BASE_URL, window.location.origin).href;
}
