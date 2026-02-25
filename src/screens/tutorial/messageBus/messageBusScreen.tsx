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
import { MessageBusPanelModel, useMessageBusPanel } from "./messageBusPanel";
import messageBusExplanation from "./messageBusExplanation.md?raw";

// MessageBus Screen Component
type MessageBusScreenStruct = RouteScreenBaseStruct<{
    children: {
        screenLayout: ScreenLayoutModel;
        messageBusPanel: MessageBusPanelModel;
        logViewer: LogViewerModel;
    };

    methods: {
        _screenContentView: () => React.JSX.Element;
    };
}>;

type MessageBusScreenParams = RouteScreenBaseParams<MessageBusScreenStruct>;
type MessageBusScreenModel = RouteScreenBaseModel<MessageBusScreenStruct>;

function useMessageBusScreen(params?: MessageBusScreenParams): MessageBusScreenModel {
    const struct: MessageBusScreenStruct = {
        props: {
            id: useMessageBusScreen.name,
        },

        children: {
            screenLayout: useScreenLayout({
                breadcrumbs: [
                    { route: { path: "/messagebus" }, label: "Message Bus Example" },
                ],
                toolsView: (
                    <Button
                        contentView="Explain"
                        onClick={() => {
                            model.screenLayout.drawerPanel.titleView = "Example Explanation";
                            model.screenLayout.drawerPanel.contentView = <Markdown source={messageBusExplanation} />;
                            model.screenLayout.drawerPanel.open = true;
                        }}
                    />
                ),
                contentView: () => <model._screenContentView />
            }),

            messageBusPanel: useMessageBusPanel({
                onMessageBusInteraction: (action) => {
                    model.logViewer.addItem(action);
                }
            }),

            logViewer: useLogViewer({
                title: "Message Bus Activity Log",
                description: "Recent message bus interactions:",
                emptyMessage: "No messages posted yet. Try the examples above."
            }),
        },

        methods: {
            _screenContentView: () => {
                return (
                    <Col fill spacing="large">
                        <Block width={"650px"}>
                            <Typography variant="h6" gutterBottom>
                                Interactive Message Bus Demo
                            </Typography>
                            <Block padding={{ bottom: "medium" }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Explore UECA's message bus for decoupled component communication.
                                </Typography>
                            </Block>
                            <model.messageBusPanel.View />
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

const MessageBusScreen = UECA.getFC(useMessageBusScreen);

export { MessageBusScreenParams, MessageBusScreenModel, useMessageBusScreen, MessageBusScreen };
