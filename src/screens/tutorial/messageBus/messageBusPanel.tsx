import * as UECA from "ueca-react";
import { Typography } from "@mui/material";
import {
    Col, Block, ButtonModel, useButton, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase
} from "@components";
import { JokerModel, useJoker } from "./joker";

// MessageBusPanel Component (demonstrates message bus communication)
type MessageBusPanelStruct = UIBaseStruct<{
    props: {
        // By the convention, the "_" prefix indicates it's for internal use only and not part of the public API.
        _appSideBarCollapsed: boolean; // Local state to track side bar state.
    };

    children: {
        toggleAppSideBarButton: ButtonModel;
        joker: JokerModel;
    };

    events: {
        onMessageBusInteraction: (action: string) => void; //For demonstration purposes, we use an event to log message bus interactions in the parent component.
    };
}>;

type MessageBusPanelParams = UIBaseParams<MessageBusPanelStruct>;
type MessageBusPanelModel = UIBaseModel<MessageBusPanelStruct>;

function useMessageBusPanel(params?: MessageBusPanelParams): MessageBusPanelModel {
    const struct: MessageBusPanelStruct = {
        props: {
            id: useMessageBusPanel.name,
            _appSideBarCollapsed: undefined,
        },

        children: {
            toggleAppSideBarButton: useButton({
                contentView: () => model._appSideBarCollapsed ? "Expand Side Bar" : "Collapse Side Bar",
                variant: "contained",
                color: "primary",
                onClick: async () => {
                    // Post a message to update the side bar state
                    model.onMessageBusInteraction?.("Toggling side bar state from message bus");
                    await model.bus.unicast("App.SetSideBarState", { collapsed: !model._appSideBarCollapsed });
                },
            }),

            joker: useJoker({
                onMessageBusInteraction: (action) => {
                    model.onMessageBusInteraction?.(action);
                }
            }),
        },

        messages: {
            // Listen to the side bar state changes outside of this component to update local state
            "App.SideBarStateChanged": async ({ collapsed }) => {
                model._appSideBarCollapsed = collapsed;
                model.onMessageBusInteraction?.("Received side bar state change from message bus: " + (collapsed ? "Collapsed" : "Expanded"));
            },
        },

        init: async () => {
            // Initialize side bar local state
            const state = await model.bus.unicast("App.GetSideBarState", undefined);
            model.onMessageBusInteraction?.("Initialized side bar state from message bus: " + (state.collapsed ? "Collapsed" : "Expanded"));
            model._appSideBarCollapsed = state.collapsed;
        },

        View: () => (
            <Col id={model.htmlId()} spacing="medium" fill>
                <Block>
                    <Typography variant="subtitle1" gutterBottom>
                        Side Bar Control Example
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component={"p"}>
                        Control the side bar state from anywhere using message bus.
                    </Typography>
                    <Block padding={{ top: "small" }}>
                        <model.toggleAppSideBarButton.View />
                    </Block>
                </Block>
                <Block padding={{ top: "medium" }}>
                    <Typography variant="subtitle1" gutterBottom>
                        API Call via Message Bus Example
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component={"p"}>
                        The joker component uses message bus to fetch jokes from an external API.
                    </Typography>
                    <model.joker.View />
                </Block>
            </Col>
        ),
    };

    const model = useUIBase(struct, params);
    return model;
}

const MessageBusPanel = UECA.getFC(useMessageBusPanel);

export { MessageBusPanelParams, MessageBusPanelModel, useMessageBusPanel, MessageBusPanel };
