const sanitizeHtml = require('sanitize-html');

const options = {
  allowedTags: [
    'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'blockquote', 'pre', 'code',
    'ul', 'ol', 'li', 'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    '*': ['class'],
    a: ['href', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    th: ['colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    img: ['http', 'https'],
  },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => {
      if (attribs.target === '_blank') {
        attribs.rel = 'noopener noreferrer';
      }
      return { tagName, attribs };
    },
    img: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, loading: 'lazy' },
    }),
  },
};

const sanitize = (content) => {
  if (content === null || content === undefined || content === '') return content;
  return sanitizeHtml(content, options);
};

const extractImageUrls = (sanitizedContent) => {
  if (!sanitizedContent) return [];

  const urls = [];
  sanitizeHtml(sanitizedContent, {
    ...options,
    transformTags: {
      ...options.transformTags,
      img: (tagName, attribs) => {
        if (attribs.src) urls.push(attribs.src);
        return { tagName, attribs };
      },
    },
  });

  return [...new Set(urls)];
};

module.exports = {
  sanitize,
  extractImageUrls,
};
