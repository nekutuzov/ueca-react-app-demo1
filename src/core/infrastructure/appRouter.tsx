import * as UECA from "ueca-react";
import { AnyRoute, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import { AppRoute, OtherLayoutModel, AppLayoutModel, useAppLayout, useOtherLayout } from "@core";

type AppRouterStruct = UIBaseStruct<{
    props: {
        _activeLayout: AppLayoutModel | OtherLayoutModel;
    },

    children: {
        appLayout: AppLayoutModel;
        otherLayout: OtherLayoutModel;
    }
}>;

type AppRouterParams = UIBaseParams<AppRouterStruct>;
type AppRouterModel = UIBaseModel<AppRouterStruct>;

function useAppRouter(params?: AppRouterParams): AppRouterModel {
    const struct: AppRouterStruct = {
        props: {
            id: useAppRouter.name,
            _activeLayout: undefined
        },

        children: {
            appLayout: useAppLayout(),
            otherLayout: useOtherLayout()
        },

        messages: {
            "App.Router.GetRoute": async () => ({ ...model._activeLayout?.route }),

            "App.Router.GoToRoute": async (route) => await _goToRoute(route, true),

            "App.Router.SetRoute": async (route) => await _goToRoute(route, false),

            "App.Router.OpenNewTab": async (route) => await model.bus.unicast("App.BrowsingHistory.Open", { path: route, newTab: true }),

            "App.Router.SetRouteParams": async (p) => await _setRouteParams(p.params, p.patch),

            "App.BrowsingHistory.OnNavigate": async (path) => await _onNavigateBrowsingHistory(path)
        },

        init: async () => {
            await _syncCurrentRoute();
        },

        View: () => {
            return model._activeLayout ? <model._activeLayout.View /> : null
        }
    }

    const model = useUIBase(struct, params);
    return model;

    // Private methods
    async function _changeRoute(route: AppRoute, historyTrack: boolean) {
        route = UECA.clone(route); // Isolate the object to avoid side effects on outside updates

        let newLayout: typeof model._activeLayout;
        if (model.appLayout.lookupRoute(route?.path)) {
            newLayout = model.appLayout;
        } else if (model.otherLayout.lookupRoute(route?.path)) {
            newLayout = model.otherLayout;
        } else {
            // Setup the default screen
            newLayout = model.appLayout;
            route = { path: "/" }
        }

        // BROADCAST, not unicast. A route change is an announcement that any number of models may
        // answer — a CRUD screen vetoing on unsaved changes, another guarding its own state — and
        // unicast expects exactly one subscriber, throwing before it dispatches anything when a
        // second one appears (the app menu and any other AfterRouteChange listener, for one).
        //
        // Only an explicit `false` vetoes. A subscriber that returns nothing reacted to the
        // navigation rather than judging it, and must not block it.
        const answers = await model.bus.broadcast(null, "App.Router.BeforeRouteChange", route);
        if (answers.every((allow) => allow !== false)) {
            if (historyTrack) {
                await model.bus.unicast("App.BrowsingHistory.Open", { path: route });
            } else {
                await model.bus.unicast("App.BrowsingHistory.Replace", { path: route });
            }

            newLayout.route = route;
            model._activeLayout = newLayout;
            await model.bus.broadcast(null, "App.Router.AfterRouteChange", route);
            return true;
        }
        return false;
    }

    // A route the app asks for. An address on another origin opens in a new tab and the screen on
    // show stays: nothing is left, so nothing is asked or announced. Routed like any other, it made
    // OtherLayout — whose external routes draw nothing — the active layout while the address went to
    // a new tab, and the whole shell went blank. (Startup and Back/Forward read this page's own
    // address, which is never foreign.)
    async function _goToRoute(route: AppRoute, historyTrack: boolean) {
        if (_isForeign(route)) {
            await model.bus.unicast("App.BrowsingHistory.Open", { path: UECA.clone(route), newTab: true });
            return true;
        }
        return await _changeRoute(route, historyTrack);
    }

    async function _setRouteParams(params: Record<string, unknown>, patch: boolean) {
        // Generic method to update route params for the current active layout's route
        const route = UECA.clone(model._activeLayout.route as AnyRoute);
        if (!route) {
            return;
        }
        if (patch) {
            route.params = { ...route.params, ...params };
        } else {
            route.params = { ...params }; // TODO: unnecessery? remove?
        }
        (model._activeLayout.route as AnyRoute).params = route.params;
        await model.bus.unicast("App.BrowsingHistory.Replace", { path: route });
    }

    async function _onNavigateBrowsingHistory(path: string) {
        const route = model.appLayout.lookupRoute(path) || model.otherLayout.lookupRoute(path);
        if (!route) {
            await _changeRoute(undefined, true);
        }
        return await _changeRoute(route, true);
    }

    async function _syncCurrentRoute() {
        const activePath = await model.bus.unicast("App.BrowsingHistory.GetActivePath");
        const otherLayoutRoute = model.otherLayout.lookupRoute(activePath);
        if (otherLayoutRoute) {
            _changeRoute(otherLayoutRoute, true);
            return;
        }

        const appLayoutRoute = model.appLayout.lookupRoute(activePath);
        if (appLayoutRoute) {
            _changeRoute(appLayoutRoute, false);
            return;
        } else {
            _changeRoute(undefined, false);
        }
    }

    // An absolute address whose origin is not this one ("https://…" elsewhere, "mailto:…").
    // App-relative and origin-root paths start with "/".
    function _isForeign(route: AppRoute): boolean {
        const path = route?.path as string;
        if (!path || path.startsWith("/")) {
            return false;
        }
        try {
            return new URL(path).origin !== window.location.origin;
        } catch {
            return false;
        }
    }
}

const AppRouter = UECA.getFC(useAppRouter);

export { AppRouterParams, AppRouterModel, useAppRouter, AppRouter }
