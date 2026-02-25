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
    }

    events: {
        beforeNavigate: (route: AppRoute) => Promise<AppRoute>
    }

    methods: {
        click: () => Promise<void>;
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
            linkView: undefined
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
                    href={(model.route?.path.startsWith("/") ? "#" : "") + model.route?.path}
                    title={model.title}
                    variant={model.variant}
                    color={model.color}
                    underline={model.underline}
                    target={model.newTab ? "_blank" : undefined}
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
        e.preventDefault();
        return await model.click();
    }
}

const NavLink = UECA.getFC(useNavLink);

export { NavLinkModel, useNavLink, NavLink };
