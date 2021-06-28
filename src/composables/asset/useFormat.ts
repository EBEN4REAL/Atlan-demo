export const getRowCountString = (rowCount) => {
  if (rowCount === 0 || !rowCount) {
    return "~";
  }
  return `~${rowCount.toLocaleString()}`;
};
