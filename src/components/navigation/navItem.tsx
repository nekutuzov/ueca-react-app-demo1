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
        // Shows the icon without the text, as a collapsed menu does. The text still names the link
        // (it is the link's title), so hiding it does not leave the link nameless.
        iconOnly: boolean;
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
            iconOnly: false,
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

        // The link around these is the control: it takes the focus and the click. The MUI button
        // inside is only its look, so it is neither focusable nor a button of its own — it used to be
        // both, which gave every item a second tab stop and put a button inside a link.
        methods: {
            _linkView: () => model.kind === "button" ? (
                <IconButton
                    component={"span"}
                    role={undefined}
                    tabIndex={-1}
                    size="small"
                    color={model.active ? "primary" : "default"}
                    disabled={model.disabled}
                    sx={{ height: model.extent?.height, width: model.extent?.width }}
                >
                    {model.icon}
                </IconButton>
            ) : (
                <ListItemButton
                    role={undefined}
                    tabIndex={-1}
                    selected={model.active}
                    disabled={model.disabled}
                    sx={{
                        height: model.extent?.height,
                        width: model.extent?.width,
                        // Keyboard focus is on the link around the item, so the item wears it the way
                        // MUI marks its own focus. The browser's ring on an inline link around a
                        // block is barely visible.
                        "a:focus-visible > &": { backgroundColor: "action.focus" }
                    }}
                >
                    {model.icon && <ListItemIcon>{model.icon}</ListItemIcon>}
                    {model.text && !model.iconOnly && <ListItemText primary={model.text} />}
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
