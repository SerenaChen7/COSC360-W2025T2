export function createMockRes() {
  const res = {};
  res.statusCode = 200;
  res.body = null;

  res.status = function (code) {
    this.statusCode = code;
    return this;
  };

  res.json = function (payload) {
    this.body = payload;
    return this;
  };

  res.download = function (filePath, fileName) {
    this.downloadArgs = { filePath, fileName };
    return this;
  };

  return res;
}