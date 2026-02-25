import * as UECA from "ueca-react";
import { Button as MUIButton, ButtonProps } from "@mui/material";
import { MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase } from "@components";
import { asyncSafe } from "@core";

// Button component
type ButtonStruct = MuiBaseStruct<{
    props: {
        color: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
        disabled: boolean;
        contentView: React.ReactNode;
        endIconView: React.ReactNode;
        size: "small" | "medium" | "large";
        startIconView: React.ReactNode;
        variant: "text" | "outlined" | "contained";
    };

    events: {
        onClick: (source: ButtonModel) => UECA.MaybePromise;
    };

    methods: {
        click: () => void;
    };
}, ButtonProps>;

type ButtonParams = MuiBaseParams<ButtonStruct, ButtonProps>;
type ButtonModel = MuiBaseModel<ButtonStruct, ButtonProps>;

function useButton(params?: ButtonParams): ButtonModel {
    const struct: ButtonStruct = {
        props: {
            id: useButton.name,
            color: "primary",
            disabled: false,
            endIconView: undefined,
            size: "medium",
            startIconView: undefined,
            contentView: undefined,
            variant: "text",
        },

        methods: {
            click: () => {
                if (!model.disabled && model.onClick) {
                    asyncSafe(() => model.onClick(model));
                }
            }
        },

        View: () => (
            <MUIButton
                id={model.htmlId()}
                children={model.contentView}
                variant={model.variant}
                size={model.size}
                color={model.color}
                disabled={model.disabled}
                startIcon={model.startIconView}
                endIcon={model.endIconView}
                onClick={model.click}
                {...model.mui}
            />
        )
    };

    const model = useMuiBase(struct, params);
    return model;
}

const Button = UECA.getFC(useButton);

export { ButtonModel, ButtonParams, useButton, Button };
