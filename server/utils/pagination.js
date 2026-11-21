/** Parse bounded pagination options and treat search text as a literal substring. */
function parseListQuery(query = {}) {
  const integer = (value, fallback, max) => {
    if (value === undefined) return fallback;
    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) > max) {
      throw Object.assign(new Error('Invalid pagination parameters'), { statusCode: 400 });
    }
    return Number(value);
  };
  if (query.search !== undefined && (typeof query.search !== 'string' || query.search.length > 200)) {
    throw Object.assign(new Error('Search must be text with at most 200 characters'), { statusCode: 400 });
  }
  return {
    page: integer(query.page, 1, 1000000),
    pageSize: integer(query.pageSize, 10, 100),
    search: (query.search || '').trim(),
  };
}

function searchRegex(search) {
  return new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}

function paginationMeta(total, page, pageSize) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return { total, page: Math.min(page, pageCount), pageSize, pageCount };
}

module.exports = { parseListQuery, searchRegex, paginationMeta };
