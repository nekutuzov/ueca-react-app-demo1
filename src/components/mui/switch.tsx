import * as UECA from "ueca-react";
import { Switch as MUISwitch, SwitchProps, FormControlLabel } from "@mui/material";
import { MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase } from "@components";
import { asyncSafe } from "@core";

// Switch component
type SwitchStruct = MuiBaseStruct<{
    props: {
        checked: boolean;
        color: "primary" | "secondary" | "error" | "info" | "success" | "warning" | "default";
        disabled: boolean;
        labelView: React.ReactNode;
        labelPlacement: "end" | "start" | "top" | "bottom";
        size: "small" | "medium";
    };

    events: {
        onChange: (source: SwitchModel) => UECA.MaybePromise;
    };

    methods: {
        toggle: () => void;
        _switchView: () => React.ReactNode;
    };
}, SwitchProps>;

type SwitchParams = MuiBaseParams<SwitchStruct, SwitchProps>;
type SwitchModel = MuiBaseModel<SwitchStruct, SwitchProps>;

function useSwitch(params?: SwitchParams): SwitchModel {
    const struct: SwitchStruct = {
        props: {
            id: useSwitch.name,
            checked: false,
            color: "primary",
            disabled: false,
            labelView: undefined,
            labelPlacement: "end",
            size: "medium",
        },

        methods: {
            toggle: () => {
                if (model.disabled) return;
                model.checked = !model.checked;
                if (model.onChange) asyncSafe(() => model.onChange(model));
            },

            _switchView: () => (
                <MUISwitch
                    id={!model.labelView ? model.htmlId() : undefined}
                    checked={model.checked}
                    color={model.color}
                    disabled={model.disabled}
                    size={model.size}
                    onChange={model.toggle}
                    {...model.mui}
                />
            )
        },

        View: () => {
            if (!model.labelView) {
                return <model._switchView />
            }
            return (
                <FormControlLabel
                    id={model.htmlId()}
                    label={model.labelView}
                    labelPlacement={model.labelPlacement}
                    disabled={model.disabled}
                    control={<model._switchView />}
                />
            );
        }
    }

    const model = useMuiBase(struct, params);
    return model;
}

const Switch = UECA.getFC(useSwitch);

export { SwitchParams, SwitchModel, useSwitch, Switch };