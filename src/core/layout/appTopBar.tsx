import * as UECA from "ueca-react";
import { Typography } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import AdbIcon from '@mui/icons-material/Adb';
import GitHubIcon from '@mui/icons-material/GitHub';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Row, AppBarModel, ToolbarModel, UIBaseModel, UIBaseParams, UIBaseStruct, useAppBar, useToolbar, useUIBase, SwitchModel, useSwitch, IconButtonModel, useIconButton } from "@components";

type AppTopBarStruct = UIBaseStruct<{
    children: {
        appBar: AppBarModel;
        toolbar: ToolbarModel;
        themeToggle: SwitchModel;
        youtubeIconButton: IconButtonModel;
        githubIconButton: IconButtonModel;
        npmIconButton: IconButtonModel;
        userIconButton: IconButtonModel;
    }
}>;

type AppBarParams = UIBaseParams<AppTopBarStruct>;
type AppTopBarModel = UIBaseModel<AppTopBarStruct>;

function useAppTopBar(params?: AppBarParams): AppTopBarModel {
    const struct: AppTopBarStruct = {
        props: {
            id: useAppTopBar.name,
        },

        children: {
            appBar: useAppBar({
                childrenView: () => <model.toolbar.View />
            }),

            toolbar: useToolbar({
                disableGutters: true,
                childrenView: <_toolbarView />
            }),

            themeToggle: useSwitch({
                color: "default",
                onChange: async () => {
                    await model.bus.unicast("App.Theme.SetMode", model.themeToggle.checked ? "dark" : "light");
                },
            }),
            youtubeIconButton: useIconButton({
                iconView: <YouTubeIcon />,
                color: "inherit",
                onClick: async () => await model.openNewTab({path: "https://youtu.be/SQl8f-qGxwU?si=-YTWPpPB7ExBZ6L0"})
            }),
            githubIconButton: useIconButton({
                iconView: <GitHubIcon />,
                color: "inherit",
                onClick: async () => await model.openNewTab({path: "https://github.com/nekutuzov/ueca-react-app-demo1"})
            }),
            npmIconButton: useIconButton({
                iconView: <Inventory2Icon />,
                color: "inherit",
                onClick: async () => await model.openNewTab({path: "https://www.npmjs.com/package/ueca-react"})
            }),
            userIconButton: useIconButton({
                iconView: <AccountCircle />,
                color: "inherit",
                onClick: async () => await model.bus.unicast("App.Security.Unauthorize", undefined)
            }),
        },

        init: async () => {
            // Sync switch state with current theme mode
            const currentTheme = await model.bus.unicast("App.Theme.GetMode", undefined);
            model.themeToggle.checked = currentTheme === "dark";
        },

        View: () => <model.appBar.View />
    }

    const model = useUIBase(struct, params);
    return model;

    // Private methods
    function _toolbarView() {
        return (
            <Row fill verticalAlign={"center"} horizontalAlign={"spaceBetween"}>
                <Row verticalAlign={"center"}>
                    <AdbIcon />
                    <Typography variant={"h6"}>
                        UECA React Application Demo
                    </Typography>
                </Row>
                <Row verticalAlign={"center"}>
                    <model.themeToggle.View />
                    <model.youtubeIconButton.View />
                    <model.githubIconButton.View />
                    <model.npmIconButton.View />
                    <model.userIconButton.View />
                </Row>
            </Row>
        );
    }
}

const AppTopBar = UECA.getFC(useAppTopBar);

export { AppBarParams, AppTopBarModel, useAppTopBar, AppTopBar }
