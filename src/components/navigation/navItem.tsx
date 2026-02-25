import * as UECA from "ueca-react";
import { IconButton, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Block, NavLinkModel, UIBaseModel, UIBaseParams, UIBaseStruct, useNavLink, useUIBase } from "@components";
import { AppRoute } from "@core";

type NavItemStruct = UIBaseStruct<{
    props: {
        kind: "list-item" | "button";
        active: boolean;
        route: AppRoute;
        disabled: boolean;
        newTab: boolean;
        icon: React.ReactNode;
        text: string;
    },

    children: {
        navLink: NavLinkModel;
    },

    methods: {
        _linkView: () => React.JSX.Element;
    }
}>;

type NavItemParams = UIBaseParams<NavItemStruct>;
type NavItemModel = UIBaseModel<NavItemStruct>;

function useNavItem(params?: NavItemParams): NavItemModel {
    const struct: NavItemStruct = {
        props: {
            id: useNavItem.name,
            kind: "list-item",
            active: false,
            route: UECA.bind(() => model.navLink, "route"),
            disabled: UECA.bind(() => model.navLink, "disabled"),
            newTab: UECA.bind(() => model.navLink, "newTab"),
            icon: undefined,
            text: undefined,
        },

        children: {
            navLink: useNavLink({
                title: () => model.text,
                underline: "none",
                linkView: () => <model._linkView />,
                beforeNavigate: async (route) => {
                    const currentRoute = await model.getRoute();
                    if (currentRoute.path != route.path) {
                        return route;
                    }
                }
            })
        },

        methods: {
            _linkView: () => model.kind === "button" ? (
                <IconButton
                    size="small"
                    color={model.active ? "primary" : "default"}
                    disabled={model.disabled}
                    sx={{ height: model.extent?.height, width: model.extent?.width }}
                >
                    {model.icon}
                </IconButton>
            ) : (
                <ListItemButton
                    selected={model.active}
                    disabled={model.disabled}
                    sx={{ height: model.extent?.height, width: model.extent?.width }}
                >
                    {model.icon && <ListItemIcon>{model.icon}</ListItemIcon>}
                    {model.text && <ListItemText primary={model.text} />}
                </ListItemButton>
            )
        },

        View: () => (
            <Block id={model.htmlId()} fill overflow={"hidden"}>
                <model.navLink.View />
            </Block>
        )
    }

    const model = useUIBase(struct, params);
    return model;
}

const NavItem = UECA.getFC(useNavItem);

export { NavItemParams, NavItemModel, useNavItem, NavItem };
