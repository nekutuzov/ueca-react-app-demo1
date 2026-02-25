import * as UECA from "ueca-react";
import { Tab as MUITab, TabProps } from "@mui/material";
import { MuiEditBaseModel, MuiEditBaseParams, MuiEditBaseStruct, TabsContainerModel, useMuiEditBase } from "@components";
import { asyncSafe } from "@core";

// Tab component
type TabStruct = MuiEditBaseStruct<{
    props: {
        container: TabsContainerModel;
        tabId: string;
        selected: boolean;
        contentView: React.ReactNode;  // Rendered outside when this tab is selected
        visible: boolean;
        labelView: React.ReactNode;
        disabled: boolean;
        iconView: React.ReactElement<unknown>;
        iconPosition: "top" | "bottom" | "start" | "end";
        wrapped: boolean;
    };

    methods: {
        getTabId: () => string;
    };

    events: {
        onClick: (source: TabModel) => UECA.MaybePromise;
    };
}, TabProps>;

type TabParams = MuiEditBaseParams<TabStruct, TabProps>;
type TabModel = MuiEditBaseModel<TabStruct, TabProps>;

function useTab(params?: TabParams): TabModel {
    const struct: TabStruct = {
        props: {
            id: useTab.name,
            container: undefined,
            tabId: undefined,
            selected: false,
            contentView: undefined,
            visible: true,
            labelView: undefined,
            disabled: false,
            iconView: undefined,
            iconPosition: "top",
            wrapped: false,
        },

        methods: {
            getTabId: () => model.tabId ? model.tabId : model.id,
        },

        View: () => {
            const invalid = !model.isValid();
            return (
                <MUITab
                    id={model.htmlId()}
                    label={model.labelView}
                    value={model.getTabId()}
                    disabled={model.disabled}
                    icon={model.iconView}
                    iconPosition={model.iconPosition}
                    wrapped={model.wrapped}
                    onClick={() => {
                        if (model.disabled) return;
                        model.container.selectedTab = model;
                        asyncSafe(() => model.onClick?.(model));
                    }}
                    sx={(theme) => ({
                        '&.MuiTab-root': {
                            color: invalid ? theme.palette.error.main : undefined,
                        },
                        '&.Mui-selected': {
                            color: invalid ? theme.palette.error.main : undefined,
                        },
                    })}
                    {...model.mui}
                />
            )
        }
    };

    const model = useMuiEditBase(struct, params);
    return model;
}

const Tab = UECA.getFC(useTab);

export { TabModel, TabParams, useTab, Tab };
