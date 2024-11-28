/* eslint-disable spellcheck/spell-checker */
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/logout", "routes/logout.tsx"),
  route("/signup", "routes/auth/signup.tsx"),
] satisfies RouteConfig;
