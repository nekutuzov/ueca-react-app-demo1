import * as UECA from "ueca-react";
import { TextField as MUITextField, TextFieldProps } from "@mui/material";
import { MuiEditBaseModel, MuiEditBaseParams, MuiEditBaseStruct, useMuiEditBase } from "@components";
import { asyncSafe } from "@core";

// TextField component
type TextFieldStruct = MuiEditBaseStruct<{
    props: {
        labelView: React.ReactNode;
        multiline: boolean;
        value: unknown;
        placeholder: string;
        disabled: boolean;
        error: boolean;
        helperTextView: React.ReactNode;
        variant: "outlined" | "filled" | "standard";
        size: "small" | "medium";
        type: "color" | "date" | "datetime-local" | "email" | "month" | "number" | "password" | "range" | "tel" | "text" | "time" | "url" | "week";
        autoComplete: string;
        required: boolean;
    };

    events: {
        onChange: (source: TextFieldModel) => UECA.MaybePromise;
    };

}, TextFieldProps>;

type TextFieldParams = MuiEditBaseParams<TextFieldStruct, TextFieldProps>;
type TextFieldModel = MuiEditBaseModel<TextFieldStruct, TextFieldProps>;

function useTextField(params?: TextFieldParams): TextFieldModel {
    const struct: TextFieldStruct = {
        props: {
            id: useTextField.name,
            value: undefined,
            labelView: undefined,
            multiline: false,
            placeholder: undefined,
            disabled: false,
            error: false,
            helperTextView: undefined,
            variant: undefined,
            size: undefined,
            type: "text",
            autoComplete: undefined,
            required: false
        },

        events: {
            onInternalValidate: async () => {
                if (model.required && !model.value) {
                    return `${(model.labelView && UECA.isString(model.labelView)) || "This field"} cannot be empty`;
                }
            },

            onChangeValue: () => model.resetValidationErrors(),
        },

        View: () => (
            <MUITextField
                id={model.htmlId()}
                value={model.value}
                label={model.labelView}
                multiline={model.multiline}
                placeholder={model.placeholder}
                disabled={model.disabled}
                error={model.error || !model.isValid()}
                helperText={model.helperTextView}
                variant={model.variant}
                size={model.size}
                type={model.type}
                autoComplete={model.autoComplete}
                required={model.required}
                onChange={(e) => {
                    if (!model.disabled) {
                        const newValue = _convertInputValue(e.target.value, model.type);
                        model.value = newValue;
                        if (model.onChange) asyncSafe(() => model.onChange(model));
                    }
                }}
                {...model.mui}
            />
        ),
    };

    const model = useMuiEditBase(struct, params);
    return model;

    // Private methods
    function _convertInputValue(inputValue: string, inputType: string): string | number {
        switch (inputType) {
            case "number": {
                // Convert to number, but keep as string if invalid
                const numValue = parseFloat(inputValue);
                return isNaN(numValue) ? inputValue : numValue;
            }
            case "range": {
                // Range inputs should always be numbers
                return parseFloat(inputValue) || 0;
            }
            case "email":
            case "password":
            case "text":
            case "search":
            case "tel":
            case "url":
            default:
                // Keep as string for text-based inputs
                return inputValue;
        }
    }
}

const TextField = UECA.getFC(useTextField);

export { TextFieldModel, TextFieldParams, useTextField, TextField };
