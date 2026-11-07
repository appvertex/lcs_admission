import defaultContent from './content.json';

export { defaultContent };

export function mergeContent(saved) {
  if (!saved || saved.schemaVersion !== defaultContent.schemaVersion) return defaultContent;
  const merge = (base, value) => {
    if (Array.isArray(base)) return Array.isArray(value) ? value : base;
    if (base && typeof base === 'object') {
      return Object.fromEntries(Object.entries(base).map(([key, item]) => [key, merge(item, value?.[key])]));
    }
    return typeof value === typeof base ? value : base;
  };
  return merge(defaultContent, saved);
}
