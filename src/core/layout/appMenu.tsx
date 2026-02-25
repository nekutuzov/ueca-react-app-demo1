import * as UECA from "ueca-react";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import BuildIcon from '@mui/icons-material/Build';
import LinkIcon from '@mui/icons-material/Link';
import MessageIcon from '@mui/icons-material/Message';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { Col, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase, NavItemModel, useNavItem } from "@components";
import { AppRoute } from "@core";
import { List } from "@mui/material";

type AppMenuStruct = UIBaseStruct<{
    props: {
        collapsed: boolean;
    };

    children: {
        homeMenuItem: NavItemModel;
        toolbarMenuItem: NavItemModel;
        bindingsMenuItem: NavItemModel;
        messageBusMenuItem: NavItemModel;
        autoEventsMenuItem: NavItemModel;
        dashboardMenuItem: NavItemModel;
        usersMenuItem: NavItemModel;
        chartsMenuItem: NavItemModel;
    }
}>;

type AppMenuParams = UIBaseParams<AppMenuStruct>;
type AppMenuModel = UIBaseModel<AppMenuStruct>;

function useAppMenu(params?: AppMenuParams): AppMenuModel {
    const struct: AppMenuStruct = {
        props: {
            id: useAppMenu.name,
            collapsed: false
        },

        children: {
            homeMenuItem: useNavItem({
                text: () => model.collapsed ? undefined : "Home",
                icon: <HomeRoundedIcon />,
                route: { path: "/home" },
                kind: "list-item",
                extent: { height: 48 }
            }),

            toolbarMenuItem: useNavItem({
                text: () => model.collapsed ? undefined : "Toolbar",
                icon: <BuildIcon />,
                route: { path: "/toolbar" },
                kind: "list-item",
                extent: { height: 48 }
            }),
            bindingsMenuItem: useNavItem({
                text: () => model.collapsed ? undefined : "Bindings",
                icon: <LinkIcon />,
                route: { path: "/bindings" },
                kind: "list-item",
                extent: { height: 48 }
            }),

            messageBusMenuItem: useNavItem({
                text: () => model.collapsed ? undefined : "Message Bus",
                icon: <MessageIcon />,
                route: { path: "/messagebus" },
                kind: "list-item",
                extent: { height: 48 }
            }),

            autoEventsMenuItem: useNavItem({
                text: () => model.collapsed ? undefined : "Auto Events",
                icon: <FlashOnIcon />,
                route: { path: "/autoevents" },
                kind: "list-item",
                extent: { height: 48 }
            }),

            dashboardMenuItem: useNavItem({
                text: () => model.collapsed ? undefined : "Dashboard",
                icon: <AnalyticsRoundedIcon />,
                route: { path: "/dashboard" },
                kind: "list-item",
                extent: { height: 48 }
            }),

            usersMenuItem: useNavItem({
                text: () => model.collapsed ? undefined : "Users",
                icon: <GroupIcon />,
                route: { path: "/users" },
                kind: "list-item",
                extent: { height: 48 }
            }),

            chartsMenuItem: useNavItem({
                text: () => model.collapsed ? undefined : "Charts",
                icon: <BarChartIcon />,
                route: { path: "/charts" },
                kind: "list-item",
                extent: { height: 48 }
            }),
        },

        messages: {
            "App.Router.AfterRouteChange": async (route) => _syncActiveMenu(route),            
        },

        init: async () => {
            const route = await model.getRoute();
            _syncActiveMenu(route);
        },

        View: () =>
            <Col id={model.htmlId()} overflow={"auto"}>
                <List dense>
                    <model.homeMenuItem.View />
                    <model.toolbarMenuItem.View />
                    <model.bindingsMenuItem.View />
                    <model.messageBusMenuItem.View />
                    <model.autoEventsMenuItem.View />
                    <model.dashboardMenuItem.View />
                    <model.usersMenuItem.View />
                    <model.chartsMenuItem.View />
                </List>
            </Col>
    }

    const model = useUIBase(struct, params);
    return model;

    // Private methods
    function _syncActiveMenu(route: AppRoute) {
        const menuItems = model.getChildrenModels("static")?.
            filter(c => c.id.endsWith("MenuItem")) as NavItemModel[];

        menuItems.forEach(menuItem => {
            menuItem.active = route?.path?.startsWith(menuItem.route?.path);
        });
    }
}

const AppMenu = UECA.getFC(useAppMenu);

export { AppMenuParams, AppMenuModel, useAppMenu, AppMenu };
