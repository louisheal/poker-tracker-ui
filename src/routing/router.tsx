import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { RootLayout } from "./RootLayout";
import { RangeTrackerView } from "../rangeTracker/RangeTrackerView";
import { HandHistoryView } from "../handHistories/HandHistoryView";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const handHistoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HandHistoryView,
});

const rangeTrackerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/range-tracker",
  component: RangeTrackerView,
});

const routeTree = rootRoute.addChildren([handHistoriesRoute, rangeTrackerRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
