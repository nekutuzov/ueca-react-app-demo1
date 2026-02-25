import * as UECA from "ueca-react";
import {
    Block,
    CheckboxModel, Col, RouteScreenBaseModel, RouteScreenBaseParams, RouteScreenBaseStruct, Row, TextFieldModel, useCheckbox, useRouteScreenBase, useTextField
} from "@components";
import { AppRouteParams } from "@core";
import { CRUDScreenModel, useCRUDScreen } from "@screens";
import { User } from "@api";

type UserScreenStruct = RouteScreenBaseStruct<{
    props: {
        routeParams: AppRouteParams<"/users/:id">; // Define route params type or keep it as Record<string, unknown>
        user: User;
    };

    children: {
        crudScreen: CRUDScreenModel;
        nameInput: TextFieldModel;
        emailInput: TextFieldModel;
        avatarURLInput: TextFieldModel;
        activeCheckbox: CheckboxModel;
        streetInput: TextFieldModel;
        cityInput: TextFieldModel;
        stateInput: TextFieldModel;
        zipInput: TextFieldModel;
        countryInput: TextFieldModel;
    };

    methods: {
        doOnRefresh: () => Promise<void>;
        doOnValidate: () => Promise<boolean>;
        doOnSave: () => Promise<void>;
        doOnDelete: () => Promise<void>;
        doOnCancel: () => Promise<void>;
        _contentView: () => React.JSX.Element;
        _avatarView: () => React.JSX.Element;
    };
}>;

type UserScreenParams = RouteScreenBaseParams<UserScreenStruct>;
type UserScreenModel = RouteScreenBaseModel<UserScreenStruct>;

function useUserScreen(params?: UserScreenParams): UserScreenModel {
    const struct: UserScreenStruct = {
        props: {
            id: useUserScreen.name,
            user: undefined,
            modelsToValidate: () => [model.nameInput, model.emailInput, model.countryInput],
        },

        children: {
            crudScreen: useCRUDScreen({
                intent: "edit",
                breadcrumbs: () => [
                    {
                        route: { path: "/users" },
                        label: "Users"
                    },
                    {
                        route: { path: "/users/:id", params: { id: model.routeParams["id"] } },
                        label: model.user?.name || "User"
                    }
                ],
                contentView: () => model._contentView(),
                onRefresh: () => model.doOnRefresh(),
                onValidate: () => model.doOnValidate(),
                onSave: () => model.doOnSave(),
                onCancel: () => model.doOnCancel(),
                onDelete: () => model.doOnDelete(),
            }),

            nameInput: useTextField({
                labelView: "User Name",
                required: true,
                value: UECA.bind(() => model.user, "name"),
                onChange: _setToModified,
            }),

            emailInput: useTextField({
                labelView: "Email",
                required: true,
                value: UECA.bind(() => model.user, "email"),
                onChange: _setToModified,
            }),

            avatarURLInput: useTextField({
                labelView: "Avatar URL",
                value: UECA.bind(() => model.user, "avatarUrl"),
                onChange: _setToModified,
            }),

            activeCheckbox: useCheckbox({
                labelView: "Active User",
                checked: UECA.bind(() => model.user, "active"),
                onChange: _setToModified,
            }),

            streetInput: useTextField({
                labelView: "Street Address",
                value: UECA.bind(() => model.user?.address, "street"),
                onChange: _setToModified,
            }),

            cityInput: useTextField({
                labelView: "City",
                value: UECA.bind(() => model.user?.address, "city"),
                onChange: _setToModified,
            }),

            stateInput: useTextField({
                labelView: "State",
                value: UECA.bind(() => model.user?.address, "state"),
                onChange: _setToModified,
            }),

            zipInput: useTextField({
                labelView: "ZIP Code",
                value: UECA.bind(() => model.user?.address, "zip"),
                onChange: _setToModified,
            }),

            countryInput: useTextField({
                labelView: "Country",
                required: true,
                value: UECA.bind(() => model.user?.address, "country"),
                onChange: _setToModified,
            }),
        },

        methods: {
            doOnRefresh: async () => {
                if (model.routeParams["id"] === "0") {
                    // New user case
                    model.user = {
                        id: "",
                        name: "",
                        email: "",
                        active: true,
                        address: {
                            country: "",
                        },
                    };
                    model.crudScreen.setScreenState({ dataNew: true });
                    return;
                }

                // Existing user case
                model.user = await model.bus.unicast("Api.GetUser", { id: model.routeParams["id"] });

                if (!model.user) {
                    // Handle case where user is not found                    
                    await model.crudScreen.goToParentScreen(true);
                }
            },

            doOnValidate: async () => {
                await model.validate();
                return model.isValid();
            },

            doOnSave: async () => {
                if (model.crudScreen.getScreenState().dataNew) {
                    model.user = await model.bus.unicast("Api.CreateUser", model.user);
                    await model.updateRouteParams({ id: model.user.id }, true);
                } else {
                    model.user = await model.bus.unicast("Api.UpdateUser", model.user);
                }
            },

            doOnDelete: async () => {
                await model.bus.unicast("Api.DeleteUser", { id: model.user.id });
            },

            doOnCancel: async () => {
                await model.crudScreen.refresh();
            },

            _contentView: () => (   //backgroundColor="success.light"                
                <Block>
                    <Col horizontalAlign={"center"}>
                        <Col spacing={"large"}>
                            {/* User Info Section */}
                            <Col spacing={"large"}>
                                <h3 style={{ color: "#666" }}>User Information</h3>
                                <Row spacing={"massive"} overflow={"visible"}>
                                    <Col width={"500px"} spacing={"large"} overflow={"visible"}>
                                        <model.nameInput.View />
                                        <model.emailInput.View />
                                        <model.avatarURLInput.View />
                                    </Col>
                                    <model._avatarView />
                                </Row>
                                <model.activeCheckbox.View />
                            </Col>

                            {/* Address Section */}
                            <Col spacing={"large"}>
                                <h3 style={{ color: "#666" }}>Address Information</h3>
                                <model.streetInput.View />
                                <Row spacing={"medium"} overflow={"visible"}>
                                    <Col fill overflow={"visible"}>
                                        <model.cityInput.View />
                                    </Col>
                                    <Col width={"150px"} overflow={"visible"}>
                                        <model.stateInput.View />
                                    </Col>
                                    <Col width={"120px"} overflow={"visible"}>
                                        <model.zipInput.View />
                                    </Col>
                                </Row>
                                <model.countryInput.View />
                            </Col>
                        </Col>
                    </Col>
                </Block>
            ),

            _avatarView: () => {
                return (
                    <img
                        src={model.user?.avatarUrl ? model.user?.avatarUrl : undefined}
                        alt={model.user?.name}
                        loading={"lazy"}
                        style={{ width: "240px", height: "240px", borderRadius: "5%", objectFit: "cover" }}
                    />
                );
            }

        },

        init: async () => {
            await model.crudScreen.refresh();
        },

        View: () => <model.crudScreen.View />
    }

    const model = useRouteScreenBase(struct, params);
    return model;

    // Private methods
    function _setToModified() {
        model.crudScreen.setScreenState({ dataModified: true });
    }
}

const UserScreen = UECA.getFC(useUserScreen);

export { UserScreenParams, UserScreenModel, useUserScreen, UserScreen }
