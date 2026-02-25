import * as UECA from "ueca-react";
import { UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import { UserContext } from "@core";

type AppSecurityStruct = UIBaseStruct<{
    props: {
        _userContext: UserContext;
    }

    methods: {
        isAuthorized: () => boolean;
        authorize: (user: string, password: string) => Promise<void>;
        unauthorize: () => Promise<void>;
        getUserContext: () => UserContext;
    }
}>;

type AppSecurityParams = UIBaseParams<AppSecurityStruct>;
type AppSecurityModel = UIBaseModel<AppSecurityStruct>;

function useAppSecurity(params?: AppSecurityParams): AppSecurityModel {
    const struct: AppSecurityStruct = {
        props: {
            id: useAppSecurity.name,
            _userContext: { user: "guest", apiToken: "MOCK TOKEN" } // Initially authorized as guest
        },

        methods: {
            isAuthorized: () => !!model._userContext?.apiToken,

            authorize: async (user, password) => {
                model._userContext = await model.bus.unicast("Api.Authorize", { user, password })
            },

            unauthorize: async () => {
                model._userContext = undefined;
            },

            getUserContext: () => ({ ...model._userContext })
        },

        messages: {
            "App.Security.IsAuthorized": async () => model.isAuthorized(),

            "App.Security.AuthorizeNative": async (p) => await model.authorize(p.user, p.password),

            "App.Security.Unauthorize": async () => await model.unauthorize(),
        }
    }

    const model = useUIBase(struct, params);
    return model;
}

const AppSecurity = UECA.getFC(useAppSecurity);

export { AppSecurityParams, AppSecurityModel, useAppSecurity, AppSecurity }
