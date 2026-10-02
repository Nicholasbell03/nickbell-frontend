/**
 * Serialise a value for embedding inside an inline
 * `<script type="application/ld+json">` element.
 *
 * `JSON.stringify` does not escape `<`, so CMS-controlled strings such as a
 * post title of `</script><img src=x onerror=alert(1)>` would close the script
 * element early and inject markup (stored XSS). Escaping `<`, `>` and `&` as
 * JSON unicode escapes keeps the HTML parser inside the script element while
 * the payload still parses back to the identical value. U+2028/U+2029 are
 * escaped too, as they are line terminators in older JavaScript parsers.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
