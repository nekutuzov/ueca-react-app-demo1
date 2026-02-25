import { Route } from "@components";
import { HomeScreen, DashboardScreen, UserScreen, UserListScreen, ChartScreen, ChartListScreen, ToolbarScreen, BindingsScreen, MessageBusScreen, AutoEventsScreen2 } from "@screens";

const screenRoutes = {
    // Add routes withing the app layout like screens
    "/": () => <HomeScreen id={"homeScreen"} />,
    "/home": () => <HomeScreen id={"homeScreen"} />,
    "/dashboard": () => <DashboardScreen id={"dashboardScreen"} />,
    "/users": () => <UserListScreen id={"userListScreen"} />,
    "/users/:id": (p: { id?: string }) => <UserScreen id={"userScreen"} routeParams={p} />,
    "/charts": () => <ChartListScreen id={"chartListScreen"} />,
    "/charts/:id": (p: { id?: string }) => <ChartScreen id={"chartScreen"} routeParams={p} />,
    "/toolbar": () => <ToolbarScreen id={"toolbarScreen"} />,
    "/bindings": () => <BindingsScreen id={"bindingsScreen"} />,
    "/messagebus": () => <MessageBusScreen id={"messageBusScreen"} />,
    "/autoevents": () => <AutoEventsScreen2 id={"autoEventsScreen2"} />,
}

const otherRoutes = {
    // Add routes without the app layout like documents viewers and external links
    "https://github.com/nekutuzov/ueca-react-app.git": () => null,
    "https://www.google.com/search?:q": (p: { q?: string }) => p && null,
}

type OtherRoutes = typeof otherRoutes;
type OtherRoute = Route<OtherRoutes>;

type ScreenRoutes = typeof screenRoutes;
type ScreenRoute = Route<ScreenRoutes>;

type AppRoute = ScreenRoute | OtherRoute;

type AppRouteParams<T extends AppRoute["path"]> = Extract<AppRoute, { path: T }>["params"];

export { otherRoutes, screenRoutes, OtherRoute, ScreenRoute, AppRoute, AppRouteParams }
