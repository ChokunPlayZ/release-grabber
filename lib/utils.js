function extractReleaseInformation(input) {
  const releaseStart = "[SubsPlease]";
  const urlPrefix = "https://";

  // Extract file name
  const fileNameStart = input.indexOf(releaseStart);
  const fileNameEnd = input.indexOf(".mkv", fileNameStart) + 4;
  const fileName = input.substring(fileNameStart, fileNameEnd).trim();

  // Extract resolution from the filename
  const resolutionRegex = /\((\d+p)\)/;
  const resolutionMatch = fileName.match(resolutionRegex);
  const resolution = resolutionMatch ? resolutionMatch[1] : null;

  // Extract torrent URL
  const urlStart = input.lastIndexOf(urlPrefix);
  const torrentUrl = input.substring(urlStart).trim();

  // Extract file size
  const fileSizeRegex = /\(([\d.]+[A-Z]+)\)/;
  const fileSizeMatch = input.match(fileSizeRegex);
  const fileSize = fileSizeMatch ? fileSizeMatch[1] : null;

  return {
    fileName,
    resolution,
    torrentUrl,
    fileSize,
  };
}

module.exports = { extractReleaseInformation };
