import * as UECA from "ueca-react";
import { styled, Card, Typography } from "@mui/material";
import { Col, ButtonModel, CheckboxModel, TextFieldModel, UIBaseModel, UIBaseParams, UIBaseStruct, useButton, useCheckbox, useTextField, useUIBase } from "@components";

type AppLoginFormStruct = UIBaseStruct<{
    props: {
        user: string;
        password: string;
    },

    children: {
        userInput: TextFieldModel;
        passwordInput: TextFieldModel;
        rememberMeChekbox: CheckboxModel;
        signInButton: ButtonModel;
    },

    events: {
        onLogin: (user: string, password: string) => UECA.MaybePromise;
    }
}>;

type AppLoginFormParams = UIBaseParams<AppLoginFormStruct>;
type AppLoginFormModel = UIBaseModel<AppLoginFormStruct>;

function useAppLoginForm(params?: AppLoginFormParams): AppLoginFormModel {
    const struct: AppLoginFormStruct = {
        props: {
            id: useAppLoginForm.name,
            user: "",
            password: ""
        },

        children: {
            userInput: useTextField({
                labelView: "Email",
                value: UECA.bind(() => model, "user"),
                type: "email",
                placeholder: "your@email.com",
                required: true,
            }),

            passwordInput: useTextField({
                labelView: "Password",
                value: UECA.bind(() => model, "password"),
                type: "password",
                required: true,
            }),

            rememberMeChekbox: useCheckbox({
                labelView: "Remember me"
            }),

            signInButton: useButton({
                contentView: "Sign in",
                onClick: async () => await _nativeLogin(model.user, model.password),
            })
        },

        View: () => (
            <Col id={model.htmlId()} fill verticalAlign={"center"}>
                <LoginCard>
                    <Typography
                        component={"h1"}
                        variant={"h4"}
                    >
                        Sign in
                    </Typography>
                    <model.userInput.View />
                    <model.passwordInput.View />
                    <model.rememberMeChekbox.View />
                    <model.signInButton.View />
                </LoginCard>
            </Col>
        )
    }

    const model = useUIBase(struct, params);
    return model;

    // Private methods
    async function _nativeLogin(user: string, password: string) {
        try {
            await model.runWithBusyDisplay(async () => await model.bus.unicast("App.Security.AuthorizeNative", { user, password }));
            // Erase fields for security reason
            model.userInput.value = "";
            model.passwordInput.value = "";
        } catch (e) {
            await model.dialogError("Login Error", (e as Error).message);
        }
    }
}

const AppLoginForm = UECA.getFC(useAppLoginForm);

const LoginCard = styled(Card)(({ theme }) => ({
    variants: "outlined",
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

export { AppLoginFormParams, AppLoginFormModel, useAppLoginForm, AppLoginForm }
