import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home/index.tsx"),

  layout("routes/auth/protected.tsx", [
    route("/anunciar", "routes/publish.tsx"),
  ]),

  layout("routes/auth/guest.tsx", [
    route("/login", "routes/auth/login.tsx"),
    route("/signup", "routes/auth/signup.tsx"),
  ]),

  route("/api/auth/*", "routes/auth/api.auth.$.ts"),
] satisfies RouteConfig;
