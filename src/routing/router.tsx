import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { RootLayout } from "./RootLayout";
import { RangeTrackerView } from "../rangeTracker/RangeTrackerView";
import { HandHistoryView } from "../handHistories/HandHistoryView";
import { DashboardView } from "../dashboard/DashboardView";
import { DiagnosticsView } from "../diagnostics/DiagnosticsView";
import { AnalysisView } from "../analysis/AnalysisView";

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

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardView,
});

const diagnosticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/diagnostics",
  component: DiagnosticsView,
});

const analysisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analysis",
  component: AnalysisView,
});

const routeTree = rootRoute.addChildren([
  handHistoriesRoute,
  rangeTrackerRoute,
  dashboardRoute,
  diagnosticsRoute,
  analysisRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
