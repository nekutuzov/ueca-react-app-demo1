import * as UECA from "ueca-react";
import { Row, ButtonModel, useButton, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";

// ToolbarPanel Component (demonstrates UECA principles)
type ToolbarPanelStruct = UIBaseStruct<{
    props: {
        buttonsLocked: boolean;
        pressButtonActive: boolean;
    };

    events: {
        onAction: (actionKind: ToolbarPanelAction) => void;
    };

    children: {
        helloButton: ButtonModel;
        pressButton: ButtonModel;
        lockButton: ButtonModel;
    };
}>;

type ToolbarPanelAction = "hello" | "press" | "unpress" | "lock" | "unlock";

type ToolbarPanelParams = UIBaseParams<ToolbarPanelStruct>;
type ToolbarPanelModel = UIBaseModel<ToolbarPanelStruct>;

function useToolbarPanel(params?: ToolbarPanelParams): ToolbarPanelModel {
    const struct: ToolbarPanelStruct = {
        props: {
            id: useToolbarPanel.name,
            buttonsLocked: true,
            pressButtonActive: false,
        },

        children: {
            helloButton: useButton({
                contentView: "Say Hello",
                disabled: () => model.buttonsLocked, // read-only binding
                variant: "contained",
                color: "primary",
                onClick: () => model.onAction?.("hello"),
            }),

            pressButton: useButton({
                contentView: () => (model.pressButtonActive ? "Unpress me" : "Press me"), // read-only binding
                disabled: () => model.buttonsLocked, // read-only binding
                variant: "outlined",
                color: "secondary",
                onClick: () => {
                    model.pressButtonActive = !model.pressButtonActive;
                    model.onAction?.(model.pressButtonActive ? "press" : "unpress");
                },
            }),

            lockButton: useButton({
                contentView: () => (model.buttonsLocked ? "Unlock" : "Lock"), // read-only binding
                variant: "contained",
                color: "warning",
                onClick: () => {
                    model.buttonsLocked = !model.buttonsLocked;
                    model.onAction?.(model.buttonsLocked ? "lock" : "unlock");
                },
            }),
        },

        View: () => (
            <Row id={model.htmlId()} spacing="small" padding={{top: "small" }} fill>
                <model.helloButton.View />
                <model.pressButton.View />
                <model.lockButton.View />
            </Row>
        ),
    };

    const model = useUIBase(struct, params);
    return model;
}

const ToolbarPanel = UECA.getFC(useToolbarPanel);

export { ToolbarPanelParams, ToolbarPanelModel, useToolbarPanel, ToolbarPanel, ToolbarPanelAction };
