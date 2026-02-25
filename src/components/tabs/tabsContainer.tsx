import * as UECA from "ueca-react";
import { Tabs as MUITabs } from "@mui/material";
import { Col, EditBaseModel, EditBaseParams, EditBaseStruct, Row, TabModel, useEditBase } from "@components";
import { asyncSafe } from "@core";

type TabsContainerStruct = EditBaseStruct<{
    props: {
        tabs: TabModel[];
        selectedTab: TabModel;
        selectedTabId: string;
        selectedTabIndex: number;
        orientation: "horizontal" | "vertical";
        variant: "standard" | "scrollable" | "fullWidth";
        scrollButtons: "auto" | true | false;
        centered: boolean;
        __defaultTabId: string;
    };

    methods: {
        getTab: (tabId: string) => TabModel;
        getTabIndex: (tabId: string) => number;
    };

    events: {
        onChange: (source: TabsContainerModel) => UECA.MaybePromise;
    }

}>;

type TabsContainerParams = EditBaseParams<TabsContainerStruct>;
type TabsContainerModel = EditBaseModel<TabsContainerStruct>;

function useTabsContainer(params?: TabsContainerParams): TabsContainerModel {
    const struct: TabsContainerStruct = {
        props: {
            id: useTabsContainer.name,
            tabs: [],
            selectedTab: undefined,
            selectedTabId: UECA.bind(
                () => model.__defaultTabId ?? model.selectedTab?.getTabId(),
                (v) => {
                    if (model.tabs?.length) {
                        model.selectedTab = v ? model.getTab(v) : model.tabs[0]
                    } else {
                        model.__defaultTabId = v;
                    }
                }
            ),
            selectedTabIndex: UECA.bind(
                () => model.tabs.findIndex(t => t === model.selectedTab),
                (v) => model.selectedTab = model.tabs[v]
            ),
            orientation: "horizontal",
            variant: undefined,
            scrollButtons: undefined,
            centered: false,
        },

        events: {
            onChangeTabs: () => _initTabs(),

            onChangeSelectedTab: () => {
                model.tabs?.map(x => x.selected = false);
                if (model.selectedTab) {
                    model.selectedTab.selected = true;
                }
            }
        },

        methods: {
            getTab: (tabId) => model.tabs?.find(t => t.getTabId() === tabId),

            getTabIndex: (tabId) => model.tabs?.findIndex(t => t.getTabId() === tabId)
        },

        init: () => _initTabs(),

        View: () => {
            const tabs = <>
                <MUITabs
                    value={model.selectedTabIndex}
                    orientation={model.orientation}
                    variant={model.variant}
                    scrollButtons={model.scrollButtons}
                    centered={model.centered}
                    onChange={(_, newValue) => {
                        model.selectedTabIndex = newValue;
                        if (model.onChange) asyncSafe(() => model.onChange(model));
                    }}
                >
                    {model.tabs?.map(t => <t.View key={t.getTabId()} />)}
                </MUITabs>
                <Col fill overflow="auto">
                    {model.selectedTab?.contentView}
                </Col>
            </>

            if (model.orientation === "vertical") {
                return (
                    <Row id={model.htmlId()} fill horizontalAlign={"left"}>
                        {tabs}
                    </Row>
                );
            }

            return (
                <Col id={model.htmlId()} fill verticalAlign={"top"}>
                    {tabs}
                </Col>
            );
        }
    }

    const model = useEditBase(struct, params);
    return model;


    //Private methods
    function _initTabs() {
        model.modelsToValidate = model.tabs;

        model.tabs?.map(t => { t.container = model; })

        if (model.__defaultTabId) {
            const defaultTabId = model.__defaultTabId;
            model.__defaultTabId = undefined; // Clear after use, so it used only once
            model.selectedTab = model.getTab(defaultTabId);
        }

        if (model.selectedTabIndex === -1) {
            model.selectedTab = model.tabs?.length ? model.tabs[0] : undefined;
        }
    }
}

const TabsContainer = UECA.getFC(useTabsContainer);

export { TabsContainerModel, useTabsContainer, TabsContainer };