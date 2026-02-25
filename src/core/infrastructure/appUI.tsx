import * as UECA from "ueca-react";
import { ErrorFallback, Col, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase, FileSelectorModel, useFileSelector } from "@components";
import {
    asyncSafe, AbortExecutionException, AppDialogManagerModel, useAppDialogManager, AppBusyDisplayModel, useAppBusyDisplay,
    AppRouter, AppLoginForm, AppAlertManagerModel, useAppAlertManager, AppThemeManagerModel, useAppThemeManager
} from "@core";

type AppUIStruct = UIBaseStruct<{
    props: {
        authorizedMode: boolean;
    };

    children: {
        themeManager: AppThemeManagerModel;
        busyDisplay: AppBusyDisplayModel;
        dialogManager: AppDialogManagerModel;
        alertManager: AppAlertManagerModel;
        fileSelector: FileSelectorModel;
    };

    methods: {
        appView: () => UECA.ReactElement;
    };
}>;

type AppUIParams = UIBaseParams<AppUIStruct>;
type AppUIModel = UIBaseModel<AppUIStruct>;

function useAppUI(params?: AppUIParams): AppUIModel {
    const struct: AppUIStruct = {
        props: {
            id: useAppUI.name,
            authorizedMode: false,
        },

        children: {
            themeManager: useAppThemeManager(),
            busyDisplay: useAppBusyDisplay(),
            dialogManager: useAppDialogManager(),
            alertManager: useAppAlertManager(),
            fileSelector: useFileSelector(),
        },

        messages: {
            "App.UnhandledException": async (error) => {
                _processUnhandledException(error, true);
            },

            "App.SelectFiles": async (p) => {
                return await model.fileSelector.select(p.fileMask, p.multiselect);
            },
        },

        methods: {
            appView: () => {
                // return <AppRouter id={"router"} />;
                if (model.authorizedMode) {
                    return <AppRouter id={"router"} />;
                }
                return <AppLoginForm id={"loginForm"} />;
            },
        },

        View: () =>
            <ErrorFallback onError={(e) => { console.error(e) }}>
                <model.themeManager.View>
                    <Col id={model.htmlId()} fill >
                        <ErrorFallback onError={(e) => { _processReactException(e) }}>
                            <model.appView />
                        </ErrorFallback>
                        <model.busyDisplay.View />
                        <model.dialogManager.View />
                        <model.alertManager.View />
                        <model.fileSelector.View />
                    </Col>
                </model.themeManager.View>
            </ErrorFallback>
    }

    const model = useUIBase(struct, params);
    return model;

    // Private methods
    function _processUnhandledException(error: Error, ignoreAbort: boolean) {
        if (ignoreAbort && (error instanceof AbortExecutionException)) {
            return;
        }
        asyncSafe(async () => await model.dialogException("Error", error), "log");
    }

    function _processReactException(error: Error) {
        console.error("React component rendering error:\n", error);
        _processUnhandledException(error, false);
    }
}

const AppUI = UECA.getFC(useAppUI);

export { AppUIParams, AppUIModel, useAppUI, AppUI }
