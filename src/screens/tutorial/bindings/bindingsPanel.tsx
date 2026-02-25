import * as UECA from "ueca-react";
import { Col, TextFieldModel, useTextField, ButtonModel, useButton, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";

// BindingsPanel Component (demonstrates UECA binding patterns)
type BindingsPanelStruct = UIBaseStruct<{
    props: {
        userName: { firstName?: string; lastName?: string };
    };

    events: {
        onSend: (message: string) => void;
    };

    children: {
        firstNameInput: TextFieldModel;
        lastNameInput: TextFieldModel;
        fullNameInput: TextFieldModel;
        messageInput: TextFieldModel;
        sendButton: ButtonModel;
    };
}>;

type BindingsPanelParams = UIBaseParams<BindingsPanelStruct>;
type BindingsPanelModel = UIBaseModel<BindingsPanelStruct>;

function useBindingsPanel(params?: BindingsPanelParams): BindingsPanelModel {
    const struct: BindingsPanelStruct = {
        props: {
            id: useBindingsPanel.name,
            userName: {},
        },

        children: {
            firstNameInput: useTextField({
                labelView: "First Name",
                placeholder: "Enter first name",
                // Bidirectional binding (read-write) - changes sync automatically
                value: UECA.bind(() => model.userName, "firstName"),
            }),

            lastNameInput: useTextField({
                labelView: "Last Name",
                placeholder: "Enter last name",
                // Bidirectional binding (read-write) - changes sync automatically
                value: UECA.bind(() => model.userName, "lastName"),
            }),

            fullNameInput: useTextField({
                labelView: "Full Name",
                placeholder: "First and last name combined",
                // Custom bidirectional binding (read-write) with transformation logic
                value: UECA.bind(
                    () => {
                        // Getter: Combine first and last name
                        let fullName = model.userName?.firstName || "";
                        if (model.userName?.lastName?.trim()) {
                            fullName = fullName.trim() + " " + model.userName.lastName.trim();
                        }
                        return fullName;
                    },
                    (value) => {
                        // Setter: Split full name into parts
                        const nameParts = (value || "").split(" ");
                        if (nameParts.length === 2 && !nameParts[1]) {
                            model.userName.firstName = nameParts[0].trim() + " ";
                        } else {
                            model.userName.firstName = nameParts[0]?.trim() ?? "";
                        }
                        model.userName.lastName = nameParts[1]?.trim() ?? "";
                    }
                ),
            }),

            messageInput: useTextField({
                labelView: "Message",
                disabled: true,
                placeholder: "Provide your name",
                // Unidirectional binding (read-only) as arrow function
                value: () =>
                    model.firstNameInput.value
                        ? `Hello ${model.fullNameInput.value.toString().toUpperCase().trim()}!`
                        : "",
            }),

            sendButton: useButton({
                contentView: "Send Message",
                variant: "contained",
                color: "primary",
                // Unidirectional binding (read-only) - button disabled when no message
                disabled: UECA.bind(() => !model.messageInput.value, undefined),
                onClick: () => {
                    const message = model.messageInput.value as string;
                    model.onSend?.(message);
                },
            }),
        },

        View: () => (
            <Col id={model.htmlId()} spacing="small" padding={{ top: "small" }} fill>
                <model.firstNameInput.View />
                <model.lastNameInput.View />
                <model.fullNameInput.View />
                <Col padding={{ top: "large" }}>
                    <model.messageInput.View />
                    <model.sendButton.View />
                </Col>
            </Col>
        ),
    };

    const model = useUIBase(struct, params);
    return model;
}

const BindingsPanel = UECA.getFC(useBindingsPanel);

export { BindingsPanelParams, BindingsPanelModel, useBindingsPanel, BindingsPanel };
