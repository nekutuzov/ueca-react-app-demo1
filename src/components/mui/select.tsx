import * as UECA from "ueca-react";
import {
    FormControl,
    InputLabel,
    Select as MUISelect,
    MenuItem,
    FormHelperText,
    SelectProps
} from "@mui/material";
import { MuiEditBaseModel, MuiEditBaseParams, MuiEditBaseStruct, useMuiEditBase } from "@components";
import { asyncSafe } from "@core";

type SelectOption = {
    value: string | number;
    label: string;
    disabled?: boolean;
};

type SelectStruct = MuiEditBaseStruct<{
    props: {
        labelView: React.ReactNode;
        value: string | number;
        options: SelectOption[];
        placeholder: string;
        disabled: boolean;
        helperTextView: string;
        variant: "filled" | "outlined" | "standard";
        size: "small" | "medium";
        required: boolean;
    };

    events: {
        onChange: (source: SelectModel) => UECA.MaybePromise;
    };

}, SelectProps>;

type SelectParams = MuiEditBaseParams<SelectStruct, SelectProps>;
type SelectModel = MuiEditBaseModel<SelectStruct, SelectProps>;

function useSelect(params?: SelectParams): SelectModel {
    const struct: SelectStruct = {
        props: {
            id: useSelect.name,
            value: "",
            labelView: undefined,
            options: [],
            placeholder: undefined,
            disabled: false,
            helperTextView: undefined,
            variant: undefined,
            size: undefined,
            required: false,
        },

        events: {
            onInternalValidate: async () => {
                if (model.required && !model.value) {
                    return `${UECA.isString(model.labelView) ? model.labelView : "This field"} cannot be empty`;
                }
            },

            onChangeValue: () => model.resetValidationErrors(),
        },

        View: () => (
            <FormControl
                id={model.htmlId()}
                variant={model.variant}
                size={model.size}
                fullWidth={true}
                error={!model.isValid()}
                disabled={model.disabled}
                required={model.required}
            >
                <InputLabel id={`${model.htmlId()}-label`}>
                    {model.labelView}
                </InputLabel>
                <MUISelect
                    labelId={`${model.htmlId()}-label`}
                    value={model.value}
                    label={model.labelView}
                    displayEmpty={!!model.placeholder}
                    variant={model.variant}
                    onChange={(e) => {
                        if (!model.disabled) {
                            model.value = e.target.value as string | number;
                            if (model.onChange) asyncSafe(() => model.onChange(model));
                        }
                    }}
                    {...model.mui}
                >
                    {model.placeholder && (
                        <MenuItem value="" disabled>
                            <em>{model.placeholder}</em>
                        </MenuItem>
                    )}
                    {model.options.map((option) => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </MUISelect>
                {(model.helperTextView || !model.isValid()) && (
                    <FormHelperText>
                        {!model.isValid() ? model.getValidationError() : model.helperTextView}
                    </FormHelperText>
                )}
            </FormControl>
        ),
    };

    const model = useMuiEditBase(struct, params);
    return model;
}

const Select = UECA.getFC(useSelect);

export { SelectModel, SelectOption, SelectParams, useSelect, Select };