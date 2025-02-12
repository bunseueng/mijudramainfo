export const spaceToHyphen = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ /g, "-") // Replace spaces with hyphens
      .replace(/&/g, "%26"); // Encode ampersands
  };
  