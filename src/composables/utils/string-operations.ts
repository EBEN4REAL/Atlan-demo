export const pluralizeString = (
  string: string,
  count: number,
  includeCountInString: boolean = true
) => {
  if (string) {
    if (includeCountInString)
      return count === 1 ? `${count} ${string}` : `${count} ${string}s`;
    return count === 1 ? `${string}` : `${string}s`;
  }
};
export const getNameInTitleCase = (name: string, delimiter = " ") => {
  if (name) {
    return name
      .split(delimiter)
      .map(
        (word) =>
          `${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()}`
      )
      .join(" ");
  }
};
export const getNameInitials = (name: string) => {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  }
};
