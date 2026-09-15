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
import { AppRoute, ScreenRoute } from "@core";
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
            homeMenuItem: useMenuItem("Home", <HomeRoundedIcon />, "/home"),
            toolbarMenuItem: useMenuItem("Toolbar", <BuildIcon />, "/toolbar"),
            bindingsMenuItem: useMenuItem("Bindings", <LinkIcon />, "/bindings"),
            messageBusMenuItem: useMenuItem("Message Bus", <MessageIcon />, "/messagebus"),
            autoEventsMenuItem: useMenuItem("Auto Events", <FlashOnIcon />, "/autoevents"),
            dashboardMenuItem: useMenuItem("Dashboard", <AnalyticsRoundedIcon />, "/dashboard"),
            usersMenuItem: useMenuItem("Users", <GroupIcon />, "/users"),
            chartsMenuItem: useMenuItem("Charts", <BarChartIcon />, "/charts"),
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

    // A menu entry. The text is always given: a collapsed menu hides it with iconOnly rather than by
    // dropping it, which left every collapsed link with no name for a screen reader or a hover hint.
    function useMenuItem(text: string, icon: React.ReactNode, path: ScreenRoute["path"]): NavItemModel {
        return useNavItem({
            text: text,
            iconOnly: () => model.collapsed,
            icon: icon,
            route: { path },
            kind: "list-item",
            extent: { height: 48 }
        });
    }

    // Private methods
    function _syncActiveMenu(route: AppRoute) {
        const menuItems = model.getChildrenModels("static")?.
            filter(c => c.id.endsWith("MenuItem")) as NavItemModel[];

        // "/" is the Home screen too (appRoutes.tsx), so it marks Home as the active entry.
        const path = route?.path === "/" ? "/home" : route?.path;
        menuItems.forEach(menuItem => {
            menuItem.active = path?.startsWith(menuItem.route?.path);
        });
    }
}

const AppMenu = UECA.getFC(useAppMenu);

export { AppMenuParams, AppMenuModel, useAppMenu, AppMenu };
