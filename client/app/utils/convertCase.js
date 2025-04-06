const formatAddressToTitleCase = (address) => {
  if (!address) {
    return "";
  }

  return address
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (word.length <= 3) {
        return word.toUpperCase();
      } else if (word.match(/[a-zA-Z]\d+|\d+[a-zA-Z]/)) {
        // If the word contains a letter directly connected to a number
        return word.toUpperCase();
      } else {
        // Otherwise, apply title case
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    })
    .join(" ");
};

export default formatAddressToTitleCase;