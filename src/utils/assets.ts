/**
 * Resolves static or uploaded asset URLs dynamically.
 * Works seamlessly across:
 * - Localhost (root domain '/')
 * - GitHub Pages (repository subpath '/<repo-name>/')
 * - Base64 data URLs & remote URLs
 */
export function getAssetUrl(path?: string | null): string {
  if (!path) return '';
  
  // Return untouched if already external or data-URI
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  
  return `${normalizedBase}${cleanPath}`;
}
