import * as UECA from "ueca-react";
import { Typography } from "@mui/material";
import {
    Col, Block, RouteScreenBaseModel, RouteScreenBaseParams, RouteScreenBaseStruct,
    useRouteScreenBase,
    Button,
    Markdown,
    LogViewerModel,
    useLogViewer
} from "@components";
import { ScreenLayoutModel, useScreenLayout } from "@screens";
import { BindingsPanelModel, useBindingsPanel } from "./bindingsPanel";
import bindingsExplanation from "./bindingsExplanation.md?raw";

// Bindings Screen Component
type BindingsScreenStruct = RouteScreenBaseStruct<{
    children: {
        screenLayout: ScreenLayoutModel;
        bindingsPanel: BindingsPanelModel;
        logViewer: LogViewerModel;
    };

    methods: {
        _screenContentView: () => React.JSX.Element;
    };
}>;

type BindingsScreenParams = RouteScreenBaseParams<BindingsScreenStruct>;
type BindingsScreenModel = RouteScreenBaseModel<BindingsScreenStruct>;

function useBindingsScreen(params?: BindingsScreenParams): BindingsScreenModel {
    const struct: BindingsScreenStruct = {
        props: {
            id: useBindingsScreen.name,
        },

        children: {
            screenLayout: useScreenLayout({
                breadcrumbs: [
                    { route: { path: "/bindings" }, label: "Bindings Example" },
                ],
                toolsView: (
                    <Button
                        contentView="Explain"
                        onClick={() => {
                            model.screenLayout.drawerPanel.titleView = "Example Explanation";
                            model.screenLayout.drawerPanel.contentView = <Markdown source={bindingsExplanation} />;
                            model.screenLayout.drawerPanel.open = true;
                        }}
                    />
                ),
                contentView: () => <model._screenContentView />
            }),

            bindingsPanel: useBindingsPanel({
                onSend: async (message) => {
                    const timestamp = model.logViewer.addItem(message);
                    await model.alertInformation(`Message sent at ${timestamp}: ${message}`);
                }
            }),

            logViewer: useLogViewer({
                title: "Message Log",
                description: "Sent messages:",
                emptyMessage: "No messages sent yet. Complete the form and click Send Message."
            }),
        },

        methods: {
            _screenContentView: () => {
                return (
                    <Col fill spacing="large">
                        <Block width={"500px"}>
                            <Typography variant="h6" gutterBottom>
                                Interactive Bindings Demo
                            </Typography>
                            <Block padding={{ bottom: "tiny" }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Explore different binding types in UECA by interacting with the form below.
                                </Typography>
                            </Block>
                            <model.bindingsPanel.View />
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

const BindingsScreen = UECA.getFC(useBindingsScreen);

export { BindingsScreenParams, BindingsScreenModel, useBindingsScreen, BindingsScreen };
