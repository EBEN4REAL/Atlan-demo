export const getIsLoadMore = (
  length: number,
  offset: any,
  limit: number,
  totalCount: number
) => {
  if (
    totalCount >= limit &&
    length < totalCount &&
    offset + limit <= totalCount &&
    offset + limit < 10000
  ) {
    return true;
  }
  return false;
};
