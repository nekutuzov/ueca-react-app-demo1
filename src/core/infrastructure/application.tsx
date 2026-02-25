import * as UECA from "ueca-react";
import { UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import {
    AppSecurityModel, useAppSecurity, AppUIModel, useAppUI, AppBrowsingHistoryModel,
    useAppBrowsingHistory
} from "@core";
import { DemoServiceApiClientModel, TutorialDataServiceModel, useDemoServiceApiClient, useTutorialDataService } from "@api";

type ApplicationStruct = UIBaseStruct<{
    props: {
        applicationName: string;
        appVersion: string;
    },

    children: {
        browsingHistory: AppBrowsingHistoryModel;
        security: AppSecurityModel;
        ui: AppUIModel;
        apiClient: DemoServiceApiClientModel;
        tutorialDataService: TutorialDataServiceModel;
    }
}>;

type ApplicationParams = UIBaseParams<ApplicationStruct>;
type ApplicationModel = UIBaseModel<ApplicationStruct>;

function useApplication(params?: ApplicationParams): ApplicationModel {
    const struct: ApplicationStruct = {
        props: {
            id: useApplication.name,
            applicationName: undefined,
            appVersion: undefined
        },

        children: {
            browsingHistory: useAppBrowsingHistory(),

            security: useAppSecurity(),

            ui: useAppUI({
                authorizedMode: () => model.security.isAuthorized()
            }),

            apiClient: useDemoServiceApiClient(),

            tutorialDataService: useTutorialDataService()
        },

        messages: {
            "App.GetInfo": async () => {
                return {
                    appName: model.applicationName,
                    appVersion: model.appVersion
                }
            }
        },

        init: () => {
            console.log(`UECA application "${model.applicationName}" initialized`);
        },

        deinit: () => {
            console.log(`UECA application "${model.applicationName}" deinitialized`);
        },

        View: () => <model.ui.View />
    }

    const model = useUIBase(struct, params);
    return model;
}

const Application = UECA.getFC(useApplication);

export { ApplicationModel, useApplication, Application }
