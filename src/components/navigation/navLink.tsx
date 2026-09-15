import * as UECA from "ueca-react";
import { Link, LinkProps, Typography } from "@mui/material";
import { UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import { AppRoute, asyncSafe } from "@core";

type NavLinkStruct = UIBaseStruct<{
    props: {
        route: AppRoute;
        title: string;
        variant: LinkProps["variant"]
        color: LinkProps["color"];
        underline: "none" | "hover" | "always";
        disabled: boolean;
        newTab: boolean;
        linkView: React.ReactNode;
        // The route resolved to a real, copyable URL. Held on the model because resolution goes
        // over the bus and a View cannot await — so it is synchronized on route change instead.
        _routeURL: string;
    }

    methods: {
        click: () => Promise<void>;
    }

    events: {
        beforeNavigate: (route: AppRoute) => Promise<AppRoute>
    }
}>;

type NavLinkParams = UIBaseParams<NavLinkStruct>;
type NavLinkModel = UIBaseModel<NavLinkStruct>;

function useNavLink(params?: NavLinkParams): NavLinkModel {
    const struct: NavLinkStruct = {
        props: {
            id: useNavLink.name,
            route: undefined,
            variant: "inherit",
            color: "primary",
            underline: "hover",
            title: undefined,
            disabled: false,
            newTab: false,
            linkView: undefined,
            _routeURL: undefined
        },

        methods: {
            click: async () => {
                if (!model.route) {
                    return;
                }
                const route = model.beforeNavigate ? await model.beforeNavigate(model.route) : model.route;
                if (!route) {
                    return;
                }
                if (model.newTab) {
                    await model.openNewTab(route);
                } else {
                    await model.goToRoute(route);
                }
            }
        },

        events: {
            onChangeRoute: async () => {
                await _syncRouteURL();
            }
        },

        // Seeded on mount, not on init: a route reaching a NavItem is bound through to this child and
        // arrives while the model is still initializing, where change events are suppressed, so the
        // onChangeRoute above cannot cover the first one. By mount the route has landed.
        mount: async () => {
            await _syncRouteURL();
        },

        View: () => {
            if (model.disabled) return (
                <Typography
                    id={model.htmlId()}
                    variant={model.variant}
                    children={model.linkView || model.title}
                />
            );
            return (
                <Link
                    id={model.htmlId()}
                    children={model.linkView || model.title}
                    // A real URL rather than "#" + the route path, so the browser can open the link in
                    // a new tab (middle-click, Ctrl+click) and copy its address. "#/users/12" opened
                    // the app at its base, on the home screen.
                    href={model._routeURL}
                    title={model.title}
                    variant={model.variant}
                    color={model.color}
                    underline={model.underline}
                    target={model.newTab ? "_blank" : undefined}
                    rel={model.newTab ? "noopener noreferrer" : undefined}
                    onClick={(e) => asyncSafe(async () => await _onLinkClick(e))}
                />
            )
        }
    }

    const model = useUIBase(struct, params);
    return model;

    // Private methods
    async function _onLinkClick(e: React.MouseEvent) {
        e.stopPropagation();
        // A modified click belongs to the browser — with a real href it opens a new tab or window.
        // Preventing it unconditionally swallowed Ctrl/Cmd-click into an in-app navigation.
        // (Middle-click never reaches here: it raises auxclick, not click.)
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
            return;
        }
        e.preventDefault();
        return await model.click();
    }

    async function _syncRouteURL() {
        model._routeURL = model.route ? await model.resolveRoute(model.route) : undefined;
    }
}

const NavLink = UECA.getFC(useNavLink);

export { NavLinkModel, NavLinkParams, useNavLink, NavLink };
