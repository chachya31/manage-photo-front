/* eslint-disable spellcheck/spell-checker */
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/forgot_password", "routes/auth/forgotPassword.tsx"),
  route("/confirm_forgot_password", "routes/auth/confirmForgotPassword.tsx"),
  route("/logout", "routes/logout.tsx"),
  route("/signup", "routes/auth/signup.tsx"),
  route("/verify_account", "routes/auth/verifyAccount.tsx")
] satisfies RouteConfig;
