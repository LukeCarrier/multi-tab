function findBinary(platform, opts) {
  switch (platform) {
    case "darwin":
      return `/Applications/${opts.darwin.appBundle}.app/Contents/MacOS/${opts.darwin.binary}`;
    case "win32":
      return `\\Google\\Chrome\\Application\\chrome.exe`;
    default:
      return binary;
  }
}

module.exports = {
  findBinary,
};
