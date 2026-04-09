import * as UECA from "ueca-react";
import { Typography } from "@mui/material";
import {
    Col, Block, RouteScreenBaseModel, RouteScreenBaseParams, RouteScreenBaseStruct,
    useRouteScreenBase,
    Button,
    Markdown,
    LogViewerModel,
    useLogViewer,
    Row
} from "@components";
import { ScreenLayoutModel, useScreenLayout } from "@screens";
import { ToolbarPanelModel, useToolbarPanel } from "./toolbarPanel";
import toolbarExplanation from "./toolbarExplanation.md?raw";

// Toolbar Screen Component
type ToolbarScreenStruct = RouteScreenBaseStruct<{
    children: {
        screenLayout: ScreenLayoutModel;
        toolbar: ToolbarPanelModel;
        logViewer: LogViewerModel;
    };

    methods: {
        _screenContentView: () => React.JSX.Element;
    };
}>;

type ToolbarScreenParams = RouteScreenBaseParams<ToolbarScreenStruct>;
type ToolbarScreenModel = RouteScreenBaseModel<ToolbarScreenStruct>;

function useToolbarScreen(params?: ToolbarScreenParams): ToolbarScreenModel {
    const struct: ToolbarScreenStruct = {
        props: {
            id: useToolbarScreen.name,
        },

        children: {
            screenLayout: useScreenLayout({
                breadcrumbs: [
                    { route: { path: "/toolbar" }, label: "Toolbar Example" },
                ],
                toolsView: (
                    <Row>
                        <Button
                            contentView="Explain"
                            onClick={() => {
                                model.screenLayout.drawerPanel.titleView = "Example Explanation";
                                model.screenLayout.drawerPanel.contentView = <Markdown source={toolbarExplanation} />;
                                model.screenLayout.drawerPanel.open = true;
                            }}
                        />
                        <Button
                            contentView="Code"
                            onClick={async () => await model.openNewTab({ path: "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/tutorial/toolbar/toolbarScreen.tsx" })}
                        />
                    </Row>
                ),
                contentView: () => <model._screenContentView />
            }),

            toolbar: useToolbarPanel({
                onAction: async (action) => {
                    const timestamp = model.logViewer.addItem(`Action: ${action}`);
                    if (action === "hello") {
                        await model.alertInformation(`Hello from the Toolbar! (at ${timestamp})`);
                    }
                }
            }),

            logViewer: useLogViewer({
                title: "Action Log",
                description: "Recent button actions:",
                emptyMessage: "No actions yet. Click any button above."
            }),
        },

        methods: {
            _screenContentView: () => {
                return (
                    <Col fill spacing="large">
                        <Block>
                            <Typography variant="h6" gutterBottom>
                                Interactive Toolbar Demo
                            </Typography>
                            <Block padding={{ bottom: "tiny" }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Try the buttons below to see UECA principles in action.
                                </Typography>
                            </Block>
                            <model.toolbar.View />
                        </Block>
                        <model.logViewer.View />
                    </Col>
                );
            },
        },

        View: () => <model.screenLayout.View />
    };

    const model = useRouteScreenBase(struct, params);
    return model;
}

const ToolbarScreen = UECA.getFC(useToolbarScreen);

export { ToolbarScreenParams, ToolbarScreenModel, useToolbarScreen, ToolbarScreen };
