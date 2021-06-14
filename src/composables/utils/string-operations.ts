export const pluralizeString = (
  string: string,
  count: number,
  includeCountInString: boolean = true
) => {
  if (includeCountInString)
    return count === 1 ? `${count} ${string}` : `${count} ${string}s`;
  else return count === 1 ? `${string}` : `${string}s`;
};
export const getNameInTitleCase = (name: string, delimiter = " ") => {
  return name
    .split(delimiter)
    .map(
      (word) => `${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()}`
    )
    .join(" ");
};
export const getNameInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};
