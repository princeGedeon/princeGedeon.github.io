/**
 * The address never appears in clear text in the HTML: the two halves from
 * profile.json are joined at build time, reversed and base64-encoded, then
 * decoded in the browser. Enough to defeat naive scrapers.
 */
export function encodeEmail(user: string, domain: string): string {
  const reversed = `${user}@${domain}`.split('').reverse().join('');
  return typeof btoa === 'function' ? btoa(reversed) : Buffer.from(reversed).toString('base64');
}

export function decodeEmail(encoded: string): string {
  return atob(encoded).split('').reverse().join('');
}
