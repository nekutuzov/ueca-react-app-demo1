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
        // A selectedTabId waiting for its tab to exist. Reactive, because selectedTabId reads it
        // first: as a non-reactive prop, using it up did not make that read look again, and the id
        // went on being reported after another tab was selected in its place.
        _defaultTabId: string;
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
                () => model._defaultTabId ?? model.selectedTab?.getTabId(),
                (v) => {
                    if (model.tabs?.length) {
                        // An id that names no tab falls back to the first, as it does at start-up.
                        // Looked up alone, it deselected every tab and blanked the panel — a stale
                        // tab id in a route bound to a TabsScreen would do exactly that.
                        model.selectedTab = (v && model.getTab(v)) || model.tabs[0];
                    } else {
                        model._defaultTabId = v;
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
            _defaultTabId: undefined
        },

        methods: {
            getTab: (tabId) => model.tabs?.find(t => t.getTabId() === tabId),

            getTabIndex: (tabId) => model.tabs?.findIndex(t => t.getTabId() === tabId)
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

        if (model._defaultTabId) {
            const defaultTabId = model._defaultTabId;
            model._defaultTabId = undefined; // Clear after use, so it used only once
            model.selectedTab = model.getTab(defaultTabId);
        }

        if (model.selectedTabIndex === -1) {
            model.selectedTab = model.tabs?.length ? model.tabs[0] : undefined;
        }
    }
}

const TabsContainer = UECA.getFC(useTabsContainer);

export { TabsContainerModel, useTabsContainer, TabsContainer };