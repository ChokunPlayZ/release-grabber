function extractReleaseInformation(input) {
  const releaseRegex = /\[([a-zA-Z)]+ - [a-zA-Z-]+)\] - (.*) - \((\d+.?\d* [KMGTP]?iB)\) - (https:\/\/nyaa\.si\/view\/\d+\/torrent)/;
  const releaseMatch = input.match(releaseRegex);

  if (releaseMatch) {
    const [, category, fileName, fileSize, torrentUrl] = releaseMatch;
    const resolutionRegex = /\((\d+p)\)/;
    const resolutionMatch = fileName.match(resolutionRegex);
    const resolution = resolutionMatch ? resolutionMatch[1] : null;

    return {
      category,
      fileName,
      resolution,
      torrentUrl,
      fileSize,
    };
  }

  return null; // Return null if the input does not match the pattern
}

module.exports = { extractReleaseInformation };
