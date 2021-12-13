export const filterMethod = (data, query, field = "name") => {
  return data.filter((item) => {
    return query
      .toLowerCase()
      .split(" ")
      .every((v) => item[field].toLowerCase().includes(v));
  });
};