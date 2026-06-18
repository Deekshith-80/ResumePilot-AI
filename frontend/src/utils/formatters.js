export const formatCurrency = (value) => {
  if (!value) return '-';
  return value;
};

export const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
};

export const toReadableList = (items) => (Array.isArray(items) ? items.filter(Boolean).join(', ') : '');

