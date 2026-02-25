import * as UECA from "ueca-react";
import { Typography, Paper } from "@mui/material";
import {
    Col, Row, Block, TextFieldModel, useTextField,
    UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase
} from "@components";

// Simple Form Panel (demonstrates all automatic events)
type AutoEventsPanel2Struct = UIBaseStruct<{
    props: {
        firstName: string;
        lastName: string;
        email: string;
        fullName: string;  // Computed property updated via events
    };

    events: {
        onActivityLog?: (message: string) => void;
    };

    children: {
        firstNameInput: TextFieldModel;
        lastNameInput: TextFieldModel;
        emailInput: TextFieldModel;
    };

    methods: {
        _fullNameView: () => React.JSX.Element;
    }
}>;

type AutoEventsPanel2Params = UIBaseParams<AutoEventsPanel2Struct>;
type AutoEventsPanel2Model = UIBaseModel<AutoEventsPanel2Struct>;

function useAutoEventsPanel2(params?: AutoEventsPanel2Params): AutoEventsPanel2Model {
    const struct: AutoEventsPanel2Struct = {
        props: {
            id: useAutoEventsPanel2.name,
            firstName: "",
            lastName: "",
            email: "",
            fullName: "",
        },

        children: {
            firstNameInput: useTextField({
                labelView: "First Name",
                placeholder: "Enter first name",
                size: "small",
                value: UECA.bind(() => model, "firstName"),
            }),

            lastNameInput: useTextField({
                labelView: "Last Name",
                placeholder: "Enter last name",
                size: "small",
                value: UECA.bind(() => model, "lastName"),
            }),

            emailInput: useTextField({
                labelView: "Email",
                placeholder: "Enter email address",
                size: "small",
                value: UECA.bind(() => model, "email"),
            }),
        },

        events: {
            onChangingFirstName: (newValue, oldValue) => {
                // Automatic event onChanging<PropName>
                // This fires BEFORE the value is actually changed, allowing you to transform or validate the new value.                
                model.onActivityLog?.(`[Panel Handler] onChangingFirstName: "${oldValue}" → "${newValue}"`);
                return _trimAndcapitalize(newValue);
            },

            onChangeFirstName: (newVal, oldVal) => {
                // Automatic event onChange<PropName>
                // This fires AFTER the property has changed. You can perform side effects here.
                model.onActivityLog?.(`[Panel Handler] onChangeFirstName: "${oldVal}" → "${newVal}"`);
                _updateFullName();
            },

            onChangingLastName: (newValue, oldValue) => {
                // Automatic event onChanging<PropName>
                // This fires BEFORE the value is actually changed, allowing you to transform or validate the new value.
                model.onActivityLog?.(`[Panel Handler] onChangingLastName: "${oldValue}" → "${newValue}"`);
                return _trimAndcapitalize(newValue);
            },

            onChangeLastName: (newVal, oldVal) => {
                // Automatic event onChange<PropName>
                // This fires AFTER the property has changed. You can perform side effects here.
                model.onActivityLog?.(`[Panel Handler] onChangeLastName: "${oldVal}" → "${newVal}"`);
                _updateFullName();
            },

            onChangingEmail: (newVal, oldVal) => {
                // Automatic event onChanging<PropName>                
                // This fires BEFORE the value is actually changed, allowing you to transform or validate the new value.
                model.onActivityLog?.(`[Panel Handler] onChangingEmail: "${oldVal}" → "${newVal}"`);
                return _sanitizeEmail(newVal);
            },

            onChangeEmail: (newVal, oldVal) => {
                // Automatic event onChange<PropName>
                // This fires AFTER the property has changed. You can perform side effects here.                
                model.onActivityLog?.(`[Panel Handler] onChangeEmail: "${oldVal}" → "${newVal}"`);
            },

            onChangeFullName: (newVal, oldVal) => {
                // Automatic event onChange<PropName>
                // This fires AFTER the property has changed. You can perform side effects here.
                model.onActivityLog?.(`[Panel Handler] onChangeFullName: "${oldVal}" → "${newVal}"`);
            }
        },

        methods: {
            _fullNameView: () => (
                // Workaroud for MUI text field loosing focus on re-rendering while still in onChange context.        
                // Actually this is even better for rendering performance and readability.
                // Only the full name view will re-render when fullName changes, not the entire panel.
                <Row spacing="small" verticalAlign="center">
                    <Typography variant="body2" color="textSecondary">
                        Computed Full Name:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                        {model.fullName || "(empty)"}
                    </Typography>
                </Row>
            ),
        },

        View: () => (
            <Paper id={model.htmlId()} sx={{ p: 3 }} elevation={2}>
                <Typography variant="h6" gutterBottom>
                    Interactive Form Demo
                </Typography>
                <Typography variant="body2" color="textSecondary" component={"p"}>
                    Type in the fields below. Watch the activity log to see automatic events firing in sequence.
                </Typography>
                <Col spacing="medium" padding={{ top: "medium" }}>
                    <model.firstNameInput.View />
                    <model.lastNameInput.View />
                    <model.emailInput.View />
                    <Block padding={{ top: "medium" }}>
                        <model._fullNameView />
                    </Block>
                </Col>
            </Paper>
        ),
    };

    const model = useUIBase(struct, params);
    return model;

    // Private methods
    function _trimAndcapitalize(text: string): string {
        text = (text || "").trim();
        if (text.length > 0) {
            text = text.charAt(0).toUpperCase() + text.slice(1);
        }
        return text;
    }

    function _sanitizeEmail(text: string): string {
        // Remove spaces and invalid characters, only allow: letters, numbers, @, ., -, _
        return String(text || "").replace(/[^a-zA-Z0-9@._-]/g, "").toLowerCase();
    }

    function _updateFullName() {
        model.fullName = `${model.firstName} ${model.lastName}`.trim();
    }
}

const AutoEventsPanel2 = UECA.getFC(useAutoEventsPanel2);

export { AutoEventsPanel2Model, AutoEventsPanel2Params, useAutoEventsPanel2, AutoEventsPanel2 };
