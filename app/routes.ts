/* eslint-disable spellcheck/spell-checker */
import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/home.tsx", [
    index("routes/auth/userList.tsx"),
  ]),
  route("/login", "routes/login.tsx"),
  route("/forgot_password", "routes/auth/forgotPassword.tsx"),
  route("/confirm_forgot_password", "routes/auth/confirmForgotPassword.tsx"),
  route("/logout", "routes/logout.tsx"),
  route("/signup", "routes/auth/signup.tsx"),
  route("/verify_account", "routes/auth/verifyAccount.tsx"),
  route("/refresh_token", "routes/auth/refreshToken.tsx"),
  layout("routes/movie/layout/sidebar.tsx", [
    route("/movies/:year", "routes/movie/movieList.tsx"),
    // route("/movies/:year/edit", "routes/movie/createMovie.tsx")
  ]),
  route("/movies/create", "routes/movie/createMovie.tsx")
] satisfies RouteConfig;
