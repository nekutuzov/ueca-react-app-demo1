import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import React from "react";

declare module '@mui/material/styles' {
    interface Theme {
        role: {
            editor: RoleConfig;
        };
    }

    interface ThemeOptions {
        role?: Partial<Record<keyof Theme['role'], RoleConfig>>;
    }
}

type RoleConfig = {
    fontSize: { base: number; input: number; label: number };
    componentSize: 'small' | 'medium';
    borderRadius: number;
    spacing: number;
    // you can add colors, shadows, etc.
};

type AppThemeProps = {
    children: React.ReactNode;
    themeMode?: "light" | "dark";
}

const AppTheme = (props: AppThemeProps) => {
    const theme = React.useMemo(() => {
        const th = createTheme({
            palette: {
                mode: props.themeMode || "dark",
            }
        });

        th.role = {
            editor: {
                fontSize: { base: 13, input: 14, label: 12 },
                componentSize: 'small',
                borderRadius: th.shape.borderRadius as number,
                spacing: 1.5,
            },
        };

        th.components = {
            ...th.components,
            MuiCssBaseline: {
                styleOverrides: {
                    "[data-role='editor']": {
                        '--role-font-base': `${th.role.editor.fontSize.base}px`,
                        '--role-font-input': `${th.role.editor.fontSize.input}px`,
                        '--role-font-label': `${th.role.editor.fontSize.label}px`,
                    },
                    
                    // Force portals (Select menu, Dialog, Popover, etc.) to inherit the correct font scale
                    // Portals are rendered outside the data-role context, so we need global selectors
                    '.MuiPopover-root': {
                        fontSize: `${th.role.editor.fontSize.base}px`,
                    },

                    '.MuiMenu-root .MuiMenuItem-root': {
                        fontSize: `${th.role.editor.fontSize.input}px !important`,
                    },

                    '.MuiModal-root': {
                        fontSize: `${th.role.editor.fontSize.base}px`,
                    },

                    // add more roles as needed
                },
            },
        };
        return th;
    }, [props.themeMode]);

    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            <CssBaseline enableColorScheme />
            {props.children}
        </ThemeProvider>
    );
};

const AppThemeProvider = (props: { children: React.ReactNode, themeMode?: AppThemeProps["themeMode"] }) => (
    <StyledEngineProvider injectFirst>
        <AppTheme themeMode={props.themeMode}>
            {props.children}
        </AppTheme>
    </StyledEngineProvider>
);

export { AppTheme, AppThemeProps, AppThemeProvider }
