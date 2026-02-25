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
import { AutoEventsPanel2Model, useAutoEventsPanel2 } from "./autoEventsPanel2";
import autoEventsExplanation2 from "./autoEventsExplanation2.md?raw";

// AutoEvents2 Screen Component
type AutoEventsScreen2Struct = RouteScreenBaseStruct<{
    children: {
        screenLayout: ScreenLayoutModel;
        autoEventsPanel: AutoEventsPanel2Model;
        logViewer: LogViewerModel;
    };

    methods: {
        _screenContentView: () => React.JSX.Element;
    };
}>;

type AutoEventsScreen2Params = RouteScreenBaseParams<AutoEventsScreen2Struct>;
type AutoEventsScreen2Model = RouteScreenBaseModel<AutoEventsScreen2Struct>;

function useAutoEventsScreen2(params?: AutoEventsScreen2Params): AutoEventsScreen2Model {
    const struct: AutoEventsScreen2Struct = {
        props: {
            id: useAutoEventsScreen2.name,
        },

        children: {
            screenLayout: useScreenLayout({
                breadcrumbs: [
                    { route: { path: "/autoevents" }, label: "Auto Events Tutorial" },
                ],
                toolsView: (
                    <Button
                        contentView="Explain"
                        onClick={() => {
                            model.screenLayout.drawerPanel.titleView = "Example Explanation";
                            model.screenLayout.drawerPanel.contentView = <Markdown source={autoEventsExplanation2} />;
                            model.screenLayout.drawerPanel.open = true;
                        }}
                    />
                ),
                contentView: () => <model._screenContentView />
            }),

            autoEventsPanel: useAutoEventsPanel2({
                // Demonstrate passing event handlers from parent
                // These will chain with the panel's own event handlers
                onChangeFirstName: (newVal, oldVal) => {
                    model.logViewer.addItem(`[Screen Handler] onChangeFirstName: "${oldVal}" → "${newVal}"`);
                },

                onPropChange: (propName, newValue, oldValue) => {
                    model.logViewer.addItem(`[Screen Handler] onPropChange: property="${propName}" value="${oldValue}" → "${newValue}"`);
                },

                onActivityLog: (message) => {
                    model.logViewer.addItem(message);
                }
            }),

            logViewer: useLogViewer({
                title: "Auto Events Activity Log",
                description: "Watch the event chain in real-time:",
                emptyMessage: "No events yet. Start typing in the input fields above."
            }),
        },

        methods: {
            _screenContentView: () => {
                return (
                    <Col fill spacing="large">
                        <Block width={"700px"}>
                            <Typography variant="h6" gutterBottom>
                                UECA Auto Events System
                            </Typography>
                            <Block padding={{ bottom: "medium" }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Demonstrates all automatic event types and event chaining.
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

const AutoEventsScreen2 = UECA.getFC(useAutoEventsScreen2);

export { AutoEventsScreen2Params, AutoEventsScreen2Model, useAutoEventsScreen2, AutoEventsScreen2 };
