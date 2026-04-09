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
    "https://cranesoft.net/": () => null,
    "https://youtu.be/SQl8f-qGxwU?si=-YTWPpPB7ExBZ6L0": () => null,
    "https://github.com/nekutuzov/ueca-react-app-demo1": () => null,
    "https://www.npmjs.com/package/ueca-react": () => null,
    "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/home/homeScreen.tsx": () => null,
    "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/demo/dashboard/dashboardScreen.tsx": () => null,
    "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/demo/user/userListScreen.tsx": () => null,
    "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/demo/user/userScreen.tsx": () => null,
    "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/demo/chart/chartListScreen.tsx": () => null,
    "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/demo/chart/chartScreen.tsx": () => null,
    "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/tutorial/toolbar/toolbarScreen.tsx": () => null,
    "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/tutorial/bindings/bindingsScreen.tsx": () => null,
    "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/tutorial/messageBus/messageBusScreen.tsx": () => null,
    "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/tutorial/autoEvents/autoEventsScreen2.tsx": () => null,

    // "https://www.google.com/search?:q": (p: { q?: string }) => p && null,
}

type OtherRoutes = typeof otherRoutes;
type OtherRoute = Route<OtherRoutes>;

type ScreenRoutes = typeof screenRoutes;
type ScreenRoute = Route<ScreenRoutes>;

type AppRoute = ScreenRoute | OtherRoute;

type AppRouteParams<T extends AppRoute["path"]> = Extract<AppRoute, { path: T }>["params"];

export { otherRoutes, screenRoutes, OtherRoute, ScreenRoute, AppRoute, AppRouteParams }
