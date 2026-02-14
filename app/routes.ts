import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("logout", "routes/logout.tsx"),
  route("auth/callback", "routes/auth.callback.tsx"),
  route("menu/:menuId", "routes/menu-viewer.tsx"), // Public menu viewer for QR codes
  route("setup", "routes/hostel-setup.tsx"), // Hostel setup wizard
  layout("routes/app-layout.tsx", [
    route("dashboard", "routes/dashboard-home.tsx"),
    route("dashboard/menus", "routes/menus.tsx"),
    route("dashboard/ar-builder", "routes/ar-menu-builder.tsx"),
    route("dashboard/qr-codes", "routes/qr-codes.tsx"),
    route("dashboard/analytics", "routes/analytics.tsx"),
    route("dashboard/settings", "routes/settings.tsx"),
  ]),
] satisfies RouteConfig;
