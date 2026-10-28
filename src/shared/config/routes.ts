export const ROUTES = {
  FEED: "/feed",
  ADD: "/add",
  TILES: "/",
  LOGIN: "/login",
} as const;

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  FEED: "Лента",
  ADD: "Добавление",
  TILES: "Плитка",
  LOGIN: "Вход",
};
