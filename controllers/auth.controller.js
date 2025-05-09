const authService = require("../services/auth.service");
const { ErrorHandler } = require("../helpers/error");

const createAccount = async (req, res) => {
  const { token, refreshToken, user } = await authService.signUp(req.body);
 
  res.header("auth-token", token);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? true : "none",
    secure: process.env.NODE_ENV === "development" ? false : true,
  });
  res.status(201).json({
    token,
    user,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { token, refreshToken, user } = await authService.login(
    email,
    password
  );

  res.header("auth-token", token);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? true : "none",
    secure: process.env.NODE_ENV === "development" ? false : true,
  });
  res.status(200).json({
    token,
    user,
  });
};

// verify password reset token
const verifyResetToken = async (req, res) => {
  const { token, email } = req.body;
  const isTokenValid = await authService.verifyResetToken(token, email);

  if (!isTokenValid) {
    res.json({
      message: "Token has expired. Please try password reset again.",
      showForm: false,
    });
  } else {
    res.json({
      showForm: true,
    });
  }
};

const refreshToken = async (req, res) => {
  if (!req.cookies.refreshToken) {
    throw new ErrorHandler(401, "Token missing");
  }
  const tokens = await authService.generateRefreshToken(
    req.cookies.refreshToken
  );
  res.header("auth-token", tokens.token);
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
  });
  res.json(tokens);
};


module.exports = {
  createAccount,
  loginUser,
  verifyResetToken,
  refreshToken,
};
