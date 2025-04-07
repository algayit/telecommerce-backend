const login = require("./login");
const signup = require("./signup");
const checkToken = require("./check-token");
const refreshToken = require("./refresh-token");

module.exports = {
  "/auth/login": {
    ...login,
  },
  "/auth/signup": {
    ...signup,
  },
  "/auth/refresh-token": {
    ...refreshToken,
  },
  "/auth/check-token": {
    ...checkToken,
  }
};
