import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { sanitizeCmsHtml } from './sanitize';

// Copied verbatim from the published post "building-a-content-pipeline-with-claude-code-from-prs-to-blog-drafts"
const diagram = readFileSync(new URL('./__fixtures__/content-pipeline-diagram.html', import.meta.url), 'utf8').trim();

const tagCounts = (html: string) =>
  [...html.matchAll(/<([a-zA-Z][\w:-]*)/g)].reduce<Record<string, number>>((counts, [, tag]) => {
    counts[tag] = (counts[tag] ?? 0) + 1;
    return counts;
  }, {});

describe('sanitizeCmsHtml', () => {
  describe('inline SVG diagrams', () => {
    it('keeps a published diagram intact', () => {
      const output = sanitizeCmsHtml(diagram);

      expect(output).toContain('<svg viewBox="0 0 800 720" xmlns="http://www.w3.org/2000/svg"');
      expect(output).not.toContain('viewbox');
      expect(output).toContain(
        'style="width:100%;max-width:800px;margin:2rem auto;display:block;font-family:\'Inter\',system-ui,sans-serif"',
      );
      expect(tagCounts(output)).toEqual(tagCounts(diagram.replace(/<!--[\s\S]*?-->/g, '')));
      expect(output).toContain(
        '<text x="400" y="32" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="600">THE CONFIRMATION FLOW</text>',
      );
      expect(output).toContain('<circle cx="400" cy="80" r="15" fill="#10b981"></circle>');
      expect(output).toContain('<path d="M 660,522 C 690,522 690,480 660,480" fill="none"');
      expect(output).toContain('stroke-dasharray="4,3"');
    });

    it('does not leave diagram text outside <text> elements', () => {
      const output = sanitizeCmsHtml(`<p>Before</p>${diagram}<p>After</p>`);
      const outsideSvg = output.replace(/<svg\b[\s\S]*<\/svg>/, '');

      expect(outsideSvg).toBe('<p>Before</p><p>After</p>');
    });

    it('keeps titles, curved paths and case-sensitive SVG names', () => {
      const svg =
        '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Flow">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.5"></stop></linearGradient>' +
        '<marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7"></polygon></marker></defs>' +
        '<circle cx="50" cy="50" r="10" fill="url(#g)"><title>Step 1: gather</title></circle>' +
        '<path d="M 10,10 Q 50,0 90,10 L 90,90" fill="none" stroke="#10b981"></path>' +
        '<text x="50" y="95" dominant-baseline="middle"><tspan font-weight="700">Done</tspan></text>' +
        '</svg>';

      expect(sanitizeCmsHtml(svg)).toBe(svg);
    });
  });

  describe('malicious SVG', () => {
    it('strips event handlers from svg elements', () => {
      const output = sanitizeCmsHtml('<svg viewBox="0 0 10 10" onload="alert(1)"><rect onclick="alert(2)" onmouseover="alert(3)" width="5"></rect></svg>');

      expect(output).toBe('<svg viewBox="0 0 10 10"><rect width="5"></rect></svg>');
    });

    it('removes script inside svg, including its contents', () => {
      const output = sanitizeCmsHtml('<svg><script>alert(1)</script><script type="text/ecmascript">alert(2)</script></svg>');

      expect(output).toBe('<svg></svg>');
    });

    it('does not emit an upper-case SCRIPT element', () => {
      const output = sanitizeCmsHtml('<svg><SCRIPT>alert(1)</SCRIPT></svg>');

      expect(output).not.toMatch(/<script/i);
    });

    it('removes foreignObject and event handlers on its contents', () => {
      const output = sanitizeCmsHtml('<svg><foreignObject width="100" height="100"><img src="x" onerror="alert(1)"></foreignObject></svg>');

      expect(output).not.toContain('foreignObject');
      expect(output).not.toContain('onerror');
    });

    it('removes use elements pointing at javascript: URLs', () => {
      const output = sanitizeCmsHtml('<svg><use href="javascript:alert(1)"></use><use xlink:href="data:image/svg+xml;base64,PHN2Zz4="/></svg>');

      expect(output).toBe('<svg></svg>');
    });

    it('strips xlink:href from links inside svg', () => {
      const output = sanitizeCmsHtml('<svg><a xlink:href="javascript:alert(1)"><text x="0" y="10">Click</text></a></svg>');

      expect(output).not.toContain('xlink:href');
      expect(output).not.toContain('javascript:');
      expect(output).toContain('<text x="0" y="10">Click</text>');
    });

    it('removes animate and set elements that rewrite href', () => {
      const output = sanitizeCmsHtml(
        '<svg><a><animate attributeName="href" values="javascript:alert(1)"></animate>' +
          '<set attributeName="href" to="javascript:alert(2)"></set><text>Go</text></a></svg>',
      );

      expect(output).not.toMatch(/<animate|<set/);
      expect(output).not.toContain('attributeName');
      expect(output).not.toContain('javascript:');
    });

    it('removes style elements inside svg', () => {
      const output = sanitizeCmsHtml('<svg><style>@import url(https://evil.example/x.css);</style><rect width="1"></rect></svg>');

      expect(output).toBe('<svg><rect width="1"></rect></svg>');
    });
  });

  describe('existing HTML behaviour', () => {
    it('keeps normal prose markup unchanged', () => {
      const html =
        '<h2 id="intro">Intro</h2><p>Some <strong>bold</strong>, <em>italic</em> and <a href="https://example.com">linked</a> text.</p>' +
        '<ul><li>One</li><li>Two</li></ul><ol><li>First</li></ol><blockquote><p>Quote</p></blockquote>' +
        '<pre><code class="language-php">echo "hi";</code></pre><hr />' +
        '<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>' +
        '<p class="note" style="color:red">Styled</p>';

      expect(sanitizeCmsHtml(html)).toBe(html);
    });

    it('keeps images and figures with their allowed attributes', () => {
      const html =
        '<figure><img src="https://cdn.example.com/a.png" alt="Diagram" title="A" width="800" height="400" loading="lazy" class="rounded" />' +
        '<figcaption>Caption</figcaption></figure>';

      expect(sanitizeCmsHtml(html)).toBe(html);
    });

    it('strips event handlers and unknown attributes from images', () => {
      expect(sanitizeCmsHtml('<img src="https://cdn.example.com/a.png" onerror="alert(1)" data-x="1" />')).toBe(
        '<img src="https://cdn.example.com/a.png" />',
      );
    });

    it('allows YouTube and Vimeo iframes only', () => {
      const youtube = '<iframe src="https://www.youtube.com/embed/abc" width="560" height="315" allowfullscreen></iframe>';
      const vimeo = '<iframe src="https://player.vimeo.com/video/123"></iframe>';

      expect(sanitizeCmsHtml(youtube)).toBe(youtube);
      expect(sanitizeCmsHtml(vimeo)).toBe(vimeo);
      expect(sanitizeCmsHtml('<iframe src="https://evil.example/embed"></iframe>')).toBe('<iframe></iframe>');
    });

    it('still removes scripts and javascript: links', () => {
      expect(sanitizeCmsHtml('<p>Hi</p><script>alert(1)</script>')).toBe('<p>Hi</p>');
      expect(sanitizeCmsHtml('<a href="javascript:alert(1)">x</a>')).toBe('<a>x</a>');
      expect(sanitizeCmsHtml('<p onclick="alert(1)">x</p>')).toBe('<p>x</p>');
    });
  });
});
