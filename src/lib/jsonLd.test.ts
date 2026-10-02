import { describe, expect, it } from 'vitest';
import { serializeJsonLd } from './jsonLd';

describe('serializeJsonLd', () => {
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: '</script><img src=x onerror="alert(1)">',
    description: 'Tom & Jerry <!-- comment --> \u2028line\u2029para',
  };

  it('neutralises a </script> breakout payload', () => {
    const output = serializeJsonLd(payload);

    expect(output).not.toContain('<');
    expect(output).not.toContain('>');
    expect(output).not.toContain('&');
    expect(output).not.toContain('\u2028');
    expect(output).not.toContain('\u2029');
    expect(output.toLowerCase()).not.toContain('</script');
    expect(output).toContain('\\u003c/script\\u003e');
  });

  it('round-trips through JSON.parse to the original value', () => {
    expect(JSON.parse(serializeJsonLd(payload))).toEqual(payload);
  });

  it('leaves ordinary values unchanged', () => {
    const plain = { name: 'Nicholas Bell', sameAs: ['https://github.com/Nicholasbell03'] };

    expect(serializeJsonLd(plain)).toBe(JSON.stringify(plain));
  });
});
