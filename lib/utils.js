function extractReleaseInformation(input) {
  const releaseRegex = /\[Release\] (.*(SubsPlease).*?)\.?(mkv)? \((\d+.?\d*[KMGTP]?B)\) - .* - (.*)/;
  const releaseMatch = input.match(releaseRegex);

  if (releaseMatch) {
    const [, torrentName, releaseGroup, , torrentSize, torrentUrl] = releaseMatch;
    const resolutionRegex = /\((\d+p)\)/;
    const resolutionMatch = torrentName.match(resolutionRegex);
    const resolution = resolutionMatch ? resolutionMatch[1] : null;

    return {
      fileName,
      releaseGroup,
      resolution,
      fileSize,
      torrentUrl,
    };
  }

  return null;
}

module.exports = { extractReleaseInformation };
