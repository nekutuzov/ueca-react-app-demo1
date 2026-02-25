import * as UECA from "ueca-react";
import { Checkbox as MUICheckbox, CheckboxProps, FormControlLabel } from "@mui/material";
import { MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase } from "@components";
import { asyncSafe } from "@core";

// Checkbox component
type CheckboxStruct = MuiBaseStruct<{
    props: {
        checked: boolean;
        disabled: boolean;
        labelView: React.ReactNode;
        required: boolean;
        size: "small" | "medium" | "large";
    };

    events: {
        onChange: (source: CheckboxModel) => UECA.MaybePromise;
    };

    methods: {
        toggle: () => void;
        _checkBoxView: () => React.ReactNode;
    };
}, CheckboxProps>;

type CheckboxParams = MuiBaseParams<CheckboxStruct, CheckboxProps>;
type CheckboxModel = MuiBaseModel<CheckboxStruct, CheckboxProps>;

function useCheckbox(params?: CheckboxParams): CheckboxModel {
    const struct: CheckboxStruct = {
        props: {
            id: useCheckbox.name,
            checked: false,
            labelView: undefined,
            required: false,
            size: "medium",
        },

        methods: {
            toggle: () => {
                if (model.disabled) return;
                model.checked = !model.checked;
                if (model.onChange) asyncSafe(() => model.onChange(model));
            },

            _checkBoxView: () => (
                <MUICheckbox
                    id={!model.labelView ? model.htmlId() : undefined}
                    checked={model.checked}
                    disabled={model.disabled}
                    size={model.size}
                    onChange={model.toggle}
                    {...model.mui}
                />
            )
        },

        View: () => {
            if (!model.labelView) {
                return <model._checkBoxView />
            }
            return (
                <FormControlLabel
                    id={model.htmlId()}
                    label={model.labelView}
                    disabled={model.disabled}
                    required={model.required}
                    control={<model._checkBoxView />}
                />
            )
        },
    };

    const model = useMuiBase(struct, params);
    return model;
}

const Checkbox = UECA.getFC(useCheckbox);

export { CheckboxModel, CheckboxParams, useCheckbox, Checkbox };
