import * as UECA from "ueca-react";
import { UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import { AppURL } from "@core";

type RouterStruct = UIBaseStruct<{
    props: {
        routes: Routing;
        route: AnyRoute;
        _currentView: React.ReactNode;
        __regExRoutes: { regExPath: RegExp, path: string, params: Record<string, unknown>; component: RouteComp }[];
    },

    methods: {
        setPath: (path: string) => boolean;
        lookupRoute: (path: string) => AnyRoute;
    }
}>;

//type RouteComp = (p?: Record<string, any>) => React.ReactNode;
type RouteComp = (params?: Record<string, unknown>) => UECA.ReactElement;

type Routing = Record<string, RouteComp>;

type Route<R extends Routing> = {
    [K in keyof R]: { path: K, params?: Parameters<R[K]>[0] }
}[keyof R];

type AnyRoute = Route<Routing>;

type RouterParams = UIBaseParams<RouterStruct>;
type RouterModel = UIBaseModel<RouterStruct>;

function useRouter(params?: RouterParams): RouterModel {
    const struct: RouterStruct = {
        props: {
            id: useRouter.name,
            routes: undefined,
            route: undefined,
            _currentView: undefined
        },

        methods: {
            lookupRoute: (path) => {
                if (!path) {
                    return;
                }
                const routeMeta = _getRegExRoute(path);
                return routeMeta.regExRoute ? routeMeta.matchedRoute : undefined;
            },

            setPath: (path) => {
                const route = model.lookupRoute(path)
                if (!route) {
                    return false;
                }
                model.route = route;
                return !!model.route;
            }
        },

        events: {
            onChangeRoutes: () => {
                model.__regExRoutes = undefined; // reset routes cache
                if (model.route && !Reflect.has(model.routes, model.route.path)) {
                    model.route = undefined
                }
            },

            onChangingRoute: (newRoute, oldRoute) => {
                if (newRoute && Reflect.has(model.routes, newRoute.path)) {
                    return newRoute;
                }
                if (oldRoute && Reflect.has(model.routes, oldRoute.path)) {
                    return oldRoute;
                }
                return undefined;
            },

            onChangeRoute: () => {
                const RouteView: RouteComp = model.routes[model.route.path];
                model._currentView = RouteView(model.route.params);
                //model._currentView = <RouteView p={model.route.params} />;
            }
        },

        View: () => <>{model._currentView}</>
    }

    const _rootURLTag = "/841408C0-C813-4CE9-9CD4-56968B735962/"; // Fake URL base for routes replacing the base. See routes starting with "//"

    const model = useUIBase(struct, params);
    return model;

    // Private methods
    function _prepareRegExRoutes() {
        if (model.__regExRoutes?.length > 0) {
            return;
        }
        const res: typeof model.__regExRoutes = [];

        for (const r of Object.keys(model.routes)) {
            let url = r;
            if (url.startsWith("//")) {
                url = url.replace("//", _rootURLTag);
            }
            const routeUrl = new AppURL(url);
            // "^": a route names the whole path, not its tail. Unanchored, "/users" also answered
            // "/retired/users" and "/charts?from=/users", and an app-relative route answered the
            // tagged form of an origin-root path.
            let regEx = "^";
            const rootParams: Record<string, null | undefined> = {};
            if (!routeUrl.host && !routeUrl.pathname.startsWith("/")) {
                // An address with no host, such as mailto:, is its whole path, matched as written.
                // Built like a URL with a host, the address was dropped as the empty segment before a
                // leading slash, and every mailto: route became /^mailto:\/\/(?:\?|$)/.
                regEx += _escapeRegExp(routeUrl.protocol + routeUrl.pathname);
            } else {
                regEx += routeUrl.host === "_" ? "" : (routeUrl.protocol + "\\/\\/" + routeUrl.host);
                const pathParts = routeUrl.pathname.split("/");
                pathParts.splice(0, 1);
                pathParts.map(pathPart => {
                    const p = pathPart.split(":");
                    if (p.length > 1) {
                        pathPart = p[0] + "([^/?]+)";
                        rootParams[p[1]] = null; // use null for tagging a dynamic path parameter
                    }
                    regEx += "\\/" + pathPart;
                });
                if (routeUrl.host !== "_" && routeUrl.pathname === "/" && !r.split("?")[0].endsWith("/")) {
                    // An origin-only address ("https://cranesoft.net") parses with the path "/", which
                    // its key does not have, so the slash is optional — required, the key did not
                    // match itself.
                    regEx += "?";
                }
            }
            regEx += "(?:\\?|$)";

            routeUrl.searchParams.forEach((_, key) => {
                if (key.startsWith(":")) {
                    rootParams[key.slice(1)] = undefined;  // a search param
                }
            });

            res.push({ regExPath: new RegExp(regEx, "i"), path: r, params: rootParams, component: model.routes[r] });
        }
        model.__regExRoutes = res;
    }

    function _escapeRegExp(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function _getRegExRoute(path: string) {
        _prepareRegExRoutes();

        const matchedRoute: AnyRoute = {
            path: path,
            params: undefined
        };

        // Match the route and assign param values
        let regExPath = path;
        if (regExPath.startsWith("//")) {
            regExPath = regExPath.replace("//", _rootURLTag);
        }
        const regExRoute = model.__regExRoutes.find(r => r.regExPath.test(regExPath));
        if (regExRoute) {
            if (regExRoute.params) {
                // Assign values to dynamic path params.
                const dynPathValues: Array<string> = regExRoute.regExPath.exec(regExPath);
                dynPathValues.splice(0, 1);

                // The parameters mached by their position detected by regExPath
                matchedRoute.params = {};
                Object.keys(regExRoute.params).filter(x => regExRoute.params[x] === null).forEach((p, i) => matchedRoute.params[p] = dynPathValues[i]);

                // Read and assign URL search params     
                const url = new AppURL(regExPath);
                Object.keys(regExRoute.params).filter(x => regExRoute.params[x] === undefined).forEach(p => url.searchParams.has(p) && (matchedRoute.params[p] = url.searchParams.get(p)));
            }
            matchedRoute.path = regExRoute.path;
            if (matchedRoute.path.startsWith(_rootURLTag)) {
                matchedRoute.path = matchedRoute.path.replace(_rootURLTag, "//");
            }
        }

        return { regExRoute, matchedRoute };
    }
}

const Router = UECA.getFC(useRouter);

export { Routing, Route, AnyRoute, RouterModel, useRouter, Router }
