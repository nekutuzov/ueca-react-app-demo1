import * as UECA from "ueca-react";
import { UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import { AppThemeProps, AppThemeProvider } from "@core";

// Theme management component following UECA patterns
type AppThemeManagerStruct = UIBaseStruct<{
    props: {
        themeMode: AppThemeProps["themeMode"];
    };
}>;

type AppThemeManagerParams = UIBaseParams<AppThemeManagerStruct>;
type AppThemeManagerModel = UIBaseModel<AppThemeManagerStruct>;

function useAppThemeManager(params?: AppThemeManagerParams): AppThemeManagerModel {
    const struct: AppThemeManagerStruct = {
        props: {
            id: useAppThemeManager.name,
            themeMode: "dark",
        },

        messages: {
            "App.Theme.GetMode": async () => model.themeMode,

            "App.Theme.SetMode": async (mode) => {
                model.themeMode = mode;
            },
        },

        View: ({ children }) =>
            <AppThemeProvider themeMode={model.themeMode}>
                {children}
            </AppThemeProvider>
    };

    const model = useUIBase(struct, params);
    return model;
}

const AppThemeManager = UECA.getFC(useAppThemeManager);

export { AppThemeManagerParams, AppThemeManagerModel, useAppThemeManager, AppThemeManager }