import DOMPurify from 'isomorphic-dompurify';

/**
 * Enterprise HTML Sanitizer to eliminate Cross-Site Scripting (XSS)
 * and JavaScript injection across all articles, previews, and AI clusters.
 */
export function sanitizeArticleHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return '';
  }

  // Strict whitelist of allowed semantic markup elements
  const cleanHtml = DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'b',
      'i',
      'strong',
      'em',
      'strike',
      'code',
      'hr',
      'br',
      'div',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'pre',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'span',
      'blockquote',
    ],
    ALLOWED_ATTR: [
      'href',
      'target',
      'rel',
      'src',
      'alt',
      'class',
      'title',
      'id',
      'width',
      'height',
      'loading',
    ],
    // Strictly forbid javascript: and data: URIs
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|\/)/i,
    // Automatically add safe attributes to all links
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'link', 'style'],
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  });

  return cleanHtml;
}

/**
 * Sanitize plain text fields (Title, Summary, Keywords, Sport)
 * to remove any HTML tags or script markup completely.
 */
export function sanitizePlainText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/<[^>]*>?/gm, '').trim();
}
