import * as UECA from "ueca-react";
import { createRestAPIClient, IRestApiClient, User, Chart } from "@api";
import { BaseModel, BaseStruct } from "@components";

const apiBaseUrl = `${window.location.origin}/ueca-react-app/api`;

type DemoServiceApiClientStruct = BaseStruct<{
    props: {
        __apiClient: IRestApiClient;
    };
}>;

type DemoServiceApiClientModel = BaseModel<DemoServiceApiClientStruct>;

function useDemoServiceApiClient(): DemoServiceApiClientModel {
    const struct: DemoServiceApiClientStruct = {
        props: {
            id: useDemoServiceApiClient.name,
        },

        messages: {
            "Api.Authorize": async ({ user, password }) => {
                return await model.__apiClient.post("/authorize", undefined, { user, password });
            },

            "Api.GetUsers": async () => {
                return await model.__apiClient.get<User[]>("/users");
            },

            "Api.GetUser": async ({ id }) => {
                return await model.__apiClient.get<User>("/users/:id", { id });
            },

            "Api.UpdateUser": async (updatedUser) => {
                return await model.__apiClient.post("/users/update", undefined, updatedUser);
            },

            "Api.CreateUser": async (newUser) => {
                return await model.__apiClient.post("/users/create", undefined, newUser);
            },

            "Api.DeleteUser": async ({ id }) => {
                await model.__apiClient.post("/users/delete/:id", { id });
            },

            "Api.GetCharts": async () => {
                return await model.__apiClient.get<Chart[]>("/charts");
            },

            "Api.GetChart": async ({ id }) => {
                return await model.__apiClient.get<Chart>("/charts/:id", { id });
            },

            "Api.UpdateChart": async (updatedChart) => {
                return await model.__apiClient.post("/charts/update", undefined, updatedChart);
            },

            "Api.CreateChart": async (newChart) => {
                return await model.__apiClient.post("/charts/create", undefined, newChart);
            },

            "Api.DeleteChart": async ({ id }) => {
                await model.__apiClient.post("/charts/delete/:id", { id });
            },
        },

        constr: () => {
            model.__apiClient = createRestAPIClient(apiBaseUrl, _onUnauthorized);
        }
    }

    const model = UECA.useComponent(struct) as DemoServiceApiClientModel;
    return model;

    // Private methods
    async function _onUnauthorized() {
        // Handle unauthorized response from API
        // E.g., log out the user and redirect to login page, automatically reauthorize using refresh token, etc.        
        await model.bus.unicast("App.Security.Unauthorize", undefined);
    }
};

const DemoServiceApiClient = UECA.getFC(useDemoServiceApiClient);

export { DemoServiceApiClientModel, useDemoServiceApiClient, DemoServiceApiClient, apiBaseUrl };
