import * as UECA from "ueca-react";
import { AnyRoute, BaseModel, BaseParams, BaseStruct, useBase } from "@components";
import { asyncSafe, runAsync } from "@core";
// Navigation resolves routes through routeURL.ts. It used to keep a private copy of the rules, which
// threw a TypeError for a null parameter and decoded a query value twice.
import { routeToURL } from "./routeURL";

type AppBrowsingHistoryStruct = BaseStruct<{
    props: {
        __activePath: string;
        __baseURL: string;
        __appTitle: string;
        __currentHistoryIndex: number;
        // Held so the popstate listener can be detached: syncWithBrowser is callable more than
        // once, and a listener left behind by an unmounted model kept answering Back and Forward.
        __popstateHandler: (event: PopStateEvent) => void;
    },

    methods: {
        getActivePath: () => string;
        syncWithBrowser: () => void;
        open: (route: AnyRoute | string, newTab?: boolean) => Promise<void>;
        replace: (route: AnyRoute | string) => Promise<void>;
    }
}>;

type AppBrowsingHistoryModel = BaseModel<AppBrowsingHistoryStruct>;

function useAppBrowsingHistory(params?: BaseParams<AppBrowsingHistoryStruct>): AppBrowsingHistoryModel {
    const struct: AppBrowsingHistoryStruct = {
        props: {
            id: useAppBrowsingHistory.name
        },

        methods: {
            getActivePath: () => model.__activePath,

            syncWithBrowser: () => {
                // A reload keeps the index its entry was given. Otherwise the page has just been
                // opened as the newest entry, so its index is its position: history.length - 1. A
                // fixed 1 was right only for a tab's second entry; anywhere else a vetoed Back to
                // this entry rolled forward by the wrong distance.
                model.__currentHistoryIndex = window.history.state?.index ?? history.length - 1;
                history.replaceState({ index: model.__currentHistoryIndex }, "", window.location.href);

                // Setup the browser's navigation interceptor
                const baseElement = document.getElementsByTagName("base")[0];
                if (baseElement) {
                    let baseURL = baseElement.getAttribute("href");
                    if (baseURL?.endsWith("/")) {
                        baseURL = baseURL.slice(0, -1);
                    }
                    model.__baseURL = baseURL;
                } else {
                    console.info("<base> element is missing in index.html. Using empty string as base URL.");  
                    model.__baseURL = "";
                }  
                // Detach any listener a previous call left behind before adding this one. Without
                // it a second syncWithBrowser() leaves two interceptors racing over one popstate,
                // each rolling back against its own idea of the current index.
                _detachPopstate();
                model.__popstateHandler = () => asyncSafe(async () => await _browserNavigation());
                window.addEventListener("popstate", model.__popstateHandler);
                _syncCurrentPath();
            },

            open: async (route, newTab) => {
                // A string route is resolved too: only its app-relative form gains the base, and
                // routeURL.ts leaves every other form as it is. Handed to window.open as it was,
                // "/home" opened at the origin root, outside the app.
                const url = routeToURL(UECA.isObject(route) ? route : { path: route }, model.__baseURL);
                if (newTab) {
                    _openInNewTab(url);
                    return;
                }
                await _navigate(url);
            },

            replace: async (route) => {
                // Resolved like Open's. Used as it was, an app-relative string went into the address
                // as it was, which put it at the origin root, outside the app.
                const url = routeToURL(UECA.isObject(route) ? route : { path: route }, model.__baseURL);
                if (_divertCrossOrigin(url)) {
                    return;
                }
                // A hash-only or externally pushed entry carries no index, so read it defensively
                // and fall back to the one we are already on.
                const index = history.state?.index ?? model.__currentHistoryIndex;
                history.replaceState({ index }, "", url);
                // history.state isn't ready yet due to async logic
                runAsync(() => { model.__currentHistoryIndex = history.state?.index ?? index });
                _syncCurrentPath();
            }
        },

        messages: {
            "App.BrowsingHistory.GetActivePath": async () => model.getActivePath(),

            "App.BrowsingHistory.Open": async (p) => await model.open(p.path, p.newTab),

            "App.BrowsingHistory.Replace": async (p) => await model.replace(p.path)
        },

        // The active path is derived from window.location alone, so it is established here, in the
        // one-time synchronous constr hook. AppRouter reads it from its own init to resolve the
        // startup route, and init hooks are not ordered between models: doing this in init instead
        // left the router asking for a path that had not been computed yet, which dropped every
        // deep link onto the default screen.
        constr: () => {
            model.syncWithBrowser();
        },

        init: async () => {
            // Brought back from the model cache, the model has had its listener detached by deinit,
            // and constr — the only other place it is attached — does not run again: Back and
            // Forward went unheard. Syncing again also catches up with an address that moved while
            // it was parked. On first activation constr has just done this, so it is skipped.
            if (!model.__popstateHandler) {
                model.syncWithBrowser();
            }
            const appInfo = await model.bus.unicast("App.GetInfo");
            model.__appTitle = appInfo?.appName;
            _syncDocumentTitle();
        },

        // Paired with the listener syncWithBrowser installs. deinit is a DEACTIVATION hook rather
        // than destruction - it can be followed by another init, which re-attaches it.
        deinit: () => {
            _detachPopstate();
        }
    }

    const model = useBase(struct, params);
    return model;

    // Private methods
    function _syncCurrentPath() {
        if (!window.location.pathname.startsWith(model.__baseURL)) {
            model.__activePath = "";
            return;
        }
        const path = window.location.pathname.substring(model.__baseURL.length);
        model.__activePath = path + decodeURIComponent(window.location.search);
        _syncDocumentTitle();
    }

    function _syncDocumentTitle() {
        // The app title arrives asynchronously in init, after the first path sync. Leave the title
        // from index.html alone until it is known, then apply it.
        if (!model.__appTitle) {
            return;
        }
        const path = window.location.pathname.startsWith(model.__baseURL)
            ? window.location.pathname.substring(model.__baseURL.length)
            : "";
        window.document.title = path ? `${model.__appTitle}: ${path}` : model.__appTitle;
    }

    function _detachPopstate() {
        if (!model.__popstateHandler) {
            return;
        }
        window.removeEventListener("popstate", model.__popstateHandler);
        model.__popstateHandler = undefined;
    }

    // noopener closes the reverse-tabnabbing hole: without it the opened page gets a live
    // window.opener and can navigate this one. Unlike <a target="_blank">, window.open does not
    // imply it. Passing only these two features still yields a tab rather than a popup.
    function _openInNewTab(url: string) {
        window.open(url, "_blank", "noopener,noreferrer");
    }

    // Cross-site history is prohibited: neither pushState nor replaceState can move the document
    // to another origin - they throw a SecurityError - so a foreign URL always becomes a new tab.
    // Returns true when it took the navigation.
    function _divertCrossOrigin(url: string): boolean {
        // "" is what an empty route resolves to, and means "the current URL" to both history calls.
        if (!url || new URL(url).origin === window.location.origin) {
            return false;
        }
        _openInNewTab(url);
        return true;
    }

    async function _browserNavigation() {
        // Only entries this app pushed carry an index. A hash-only navigation, or one pushed from
        // outside the app, lands here unstamped - adopt the index we are already on, the same
        // repair syncWithBrowser() makes at load, rather than reading `index` off null.
        if (!history.state) {
            history.replaceState({ index: model.__currentHistoryIndex }, "", window.location.href);
        }
        const state_index = history.state.index;
        if (model.__currentHistoryIndex === state_index) {
            let path = window.location.pathname.substring(model.__baseURL.length);
            path = path + decodeURIComponent(window.location.search);
            if (path === model.__activePath) {
                return;
            }
            console.warn("Unexpected condition: AppBrowsingHistory._browserNavigation()");
        }

        let path = window.location.pathname.substring(model.__baseURL.length);
        path = path + decodeURIComponent(window.location.search);
        const allowThisPath = await model.bus.unicast("App.BrowsingHistory.OnNavigate", path);
        if (UECA.isUndefined(allowThisPath) || allowThisPath) {
            model.__currentHistoryIndex = state_index;
            _syncCurrentPath();
        } else {
            const rollbackDelta = model.__currentHistoryIndex - state_index;
            if (rollbackDelta !== 0) {
                history.go(rollbackDelta);
            } else {
                // No distance to travel back, which is always the case for an entry that arrived
                // without an index of its own (stamped with the current one above). history.go(0)
                // would reload the page and discard the very unsaved state the veto protects, so
                // restore the URL in place instead.
                const restored = new URL(model.__baseURL + model.__activePath, window.location.origin);
                history.replaceState({ index: model.__currentHistoryIndex }, "", restored.href);
            }
        }
    }

    async function _navigate(url: string) {
        if (url === window.location.href) {
            return;
        }

        if (_divertCrossOrigin(url)) {
            return;
        }

        // The new entry comes straight after the one the browser is on, so its index is one more.
        // Counting from history.length instead broke whenever the push dropped entries: the ones
        // ahead of the current entry after a Back, or the oldest once the browser's history is full.
        model.__currentHistoryIndex = (history.state?.index ?? model.__currentHistoryIndex) + 1;
        history.pushState({ index: model.__currentHistoryIndex }, "", url);
        _syncCurrentPath();
    }
}

const AppBrowsingHistory = UECA.getFC(useAppBrowsingHistory);

export { AppBrowsingHistoryModel, useAppBrowsingHistory, AppBrowsingHistory }
