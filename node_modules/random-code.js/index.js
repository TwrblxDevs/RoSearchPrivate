function randomElementInStrOrArr(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function generateOne(config) {
  let len =
    (config === null || config === void 0 ? void 0 : config.length) || 8;
  let charset =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  if (config === null || config === void 0 ? void 0 : config.prefix) {
    code += config.prefix;
  }
  for (let i = 0; i < len; i++) {
    code += randomElementInStrOrArr(charset);
  }
  if (config === null || config === void 0 ? void 0 : config.postfix) {
    code += config.postfix;
  }
  return code;
}
exports.generateOne = generateOne;
