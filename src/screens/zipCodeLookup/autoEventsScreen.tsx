import * as UECA from "ueca-react";
import { Typography } from "@mui/material";
import {
    Col, Block, RouteScreenBaseModel, RouteScreenBaseParams, RouteScreenBaseStruct,
    useRouteScreenBase,
    ButtonModel,
    useButton,
    Row,
    Markdown,
    LogViewerModel,
    useLogViewer
} from "@components";
import { ScreenLayoutModel, useScreenLayout } from "@screens";
import { AutoEventsPanelModel, useAutoEventsPanel } from "./autoEventsPanel";
import autoEventsExplanation from "./autoEventsExplanation.md?raw";

// AutoEvents Screen Component
type AutoEventsScreenStruct = RouteScreenBaseStruct<{
    children: {
        screenLayout: ScreenLayoutModel;
        autoEventsPanel: AutoEventsPanelModel;
        explainButton: ButtonModel;
        logViewer: LogViewerModel;
    };

    methods: {
        _screenContentView: () => React.JSX.Element;
    };
}>;

type AutoEventsScreenParams = RouteScreenBaseParams<AutoEventsScreenStruct>;
type AutoEventsScreenModel = RouteScreenBaseModel<AutoEventsScreenStruct>;

function useAutoEventsScreen(params?: AutoEventsScreenParams): AutoEventsScreenModel {
    const struct: AutoEventsScreenStruct = {
        props: {
            id: useAutoEventsScreen.name,
        },

        children: {
            screenLayout: useScreenLayout({
                breadcrumbs: [
                    { route: { path: "/autoevents" }, label: "Auto Events Example" },
                ],
                contentView: () => <model._screenContentView />
            }),

            autoEventsPanel: useAutoEventsPanel({
                onActivityLog: (action) => {
                    model.logViewer.addItem(action);
                }
            }),

            explainButton: useButton({
                contentView: "Explain",
                color: "info",
                size: "small",
                onClick: () => {
                    model.screenLayout.drawerPanel.titleView = "Explanation";
                    model.screenLayout.drawerPanel.contentView = <Markdown source={autoEventsExplanation} />;
                    model.screenLayout.drawerPanel.open = true;
                }
            }),

            logViewer: useLogViewer({
                title: "Auto Events Activity Log",
                description: "Automatic property change events:",
                emptyMessage: "No events yet. Enter a zip code and click Apply."
            }),
        },

        methods: {
            _screenContentView: () => {
                return (
                    <Col fill spacing="large">
                        <Block width={"600px"}>
                            <Row padding={{ bottom: "small" }}>
                                <Typography variant="h6" gutterBottom>
                                    Interactive Auto Events Demo
                                </Typography>
                                <model.explainButton.View />
                            </Row>
                            <Block padding={{ bottom: "medium" }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Explore UECA's automatic event system for reactive programming.
                                </Typography>
                            </Block>
                            <model.autoEventsPanel.View />
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

const AutoEventsScreen = UECA.getFC(useAutoEventsScreen);

export { AutoEventsScreenParams, AutoEventsScreenModel, useAutoEventsScreen, AutoEventsScreen };
