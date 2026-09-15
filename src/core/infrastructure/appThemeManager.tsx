import * as UECA from "ueca-react";
import { UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import { AppThemeProps, AppThemeProvider } from "@core";

// Where the chosen mode is kept. index.html reads the same key before the first paint, so a reload
// opens in the mode last chosen without flashing the other one first. Keep the two in step.
const THEME_MODE_STORAGE_KEY = "ueca-demo1-theme-mode";

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

        events: {
            onChangeThemeMode: (mode) => {
                _writeStoredMode(mode);
            }
        },

        messages: {
            "App.Theme.GetMode": async () => model.themeMode,

            "App.Theme.SetMode": async (mode) => {
                model.themeMode = mode;
            },
        },

        // Restored in constr, before the first render: the whole UI is drawn inside this provider,
        // and the top bar's switch reads the mode from its own init.
        constr: () => {
            model.themeMode = _readStoredMode() ?? model.themeMode;
        },

        View: ({ children }) =>
            <AppThemeProvider themeMode={model.themeMode}>
                {children}
            </AppThemeProvider>
    };

    const model = useUIBase(struct, params);
    return model;

    // Private methods
    function _readStoredMode(): AppThemeProps["themeMode"] {
        // Private browsing and blocked site data throw here rather than returning null.
        try {
            const mode = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
            return mode === "light" || mode === "dark" ? mode : undefined;
        } catch {
            return undefined;
        }
    }

    function _writeStoredMode(mode: AppThemeProps["themeMode"]) {
        try {
            window.localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
        } catch {
            // Not stored: the mode still applies for this visit.
        }
    }
}

const AppThemeManager = UECA.getFC(useAppThemeManager);

export { AppThemeManagerParams, AppThemeManagerModel, useAppThemeManager, AppThemeManager }
