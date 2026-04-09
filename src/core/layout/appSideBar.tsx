import * as UECA from "ueca-react";
import { Typography } from "@mui/material";
import { Col, Row, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase, IconButtonModel, useIconButton, NavLinkModel, useNavLink } from "@components";
import { AppMenuModel, useAppMenu } from "@core";
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import uecaLogo from "../../assets/ueca.png";

type AppSideBarStruct = UIBaseStruct<{
    props: {
        collapsed: boolean;
    };

    children: {
        menu: AppMenuModel;
        toggleButton: IconButtonModel;
        uecaLink: NavLinkModel;
    };

    methods: {
        toggleCollapse: () => void;
    };
}>;

type AppSideBarParams = UIBaseParams<AppSideBarStruct>;
type AppSideBarModel = UIBaseModel<AppSideBarStruct>;

function useAppSideBar(params?: AppSideBarParams): AppSideBarModel {
    const struct: AppSideBarStruct = {
        props: {
            id: useAppSideBar.name,
            collapsed: false
        },

        events: {
            onChangeCollapsed: async (collapsed: boolean) => {
                // Post a broadcast message to notify side bar state change
                await model.bus.broadcast("", "App.SideBarStateChanged", { collapsed });
            }
        },

        children: {
            menu: useAppMenu({
                collapsed: () => model.collapsed
            }),

            toggleButton: useIconButton({
                iconView: () => model.collapsed ? <MenuIcon /> : <MenuOpenIcon />,
                size: "small",
                onClick: () => model.toggleCollapse()
            }),

            uecaLink: useNavLink({
                route: { path: "https://cranesoft.net/", params: undefined },
                title: "UECA React Framework",
                underline: "none",
                newTab: true,
                linkView: () => <img src={uecaLogo} alt="UECA" style={{ width: 24, height: 24 }} />
            })
        },

        messages: {
            "App.GetSideBarState": async () => {
                return { collapsed: model.collapsed };
            },

            "App.SetSideBarState": async (params) => {
                model.collapsed = params.collapsed;
            },

            "App.ToggleSideBarState": async () => {
                model.toggleCollapse();
                return { collapsed: model.collapsed };
            }
        },

        methods: {
            toggleCollapse: () => {
                model.collapsed = !model.collapsed;
            }
        },

        View: () =>
            <Col id={model.htmlId()} width={model.collapsed ? 60 : 200}>
                <Row render={!model.collapsed} horizontalAlign={"spaceBetween"} verticalAlign={"center"} padding={{ leftRight: "small", top: "tiny" }}>
                    <Row spacing="small" verticalAlign={"center"}>
                        <model.uecaLink.View />
                        <Typography variant="subtitle1" fontWeight="bold">
                            Tutorial
                        </Typography>
                    </Row>
                    <model.toggleButton.View />
                </Row>
                <Row render={model.collapsed} horizontalAlign={"center"} verticalAlign={"center"} padding={{ top: "tiny" }}>
                    <model.toggleButton.View />
                </Row>
                <model.menu.View />
            </Col>
    }

    const model = useUIBase(struct, params);
    return model;
}

const AppSideBar = UECA.getFC(useAppSideBar);

export { AppSideBarParams, AppSideBarModel, useAppSideBar, AppSideBar }
