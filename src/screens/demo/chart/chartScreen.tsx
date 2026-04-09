import * as UECA from "ueca-react";
import {
    Col, RouteScreenBaseModel, RouteScreenBaseParams, RouteScreenBaseStruct, Row, TextFieldModel, SelectModel,
    useRouteScreenBase, useTextField, useSelect, PieChartModel, usePieChart, LineChartModel, useLineChart,
    ScatterChartModel, useScatterChart, BarChartModel, useBarChart, PieChartSettingsModel, usePieChartSettings,
    LineChartSettingsModel, useLineChartSettings, ScatterChartSettingsModel, useScatterChartSettings,
    BarChartSettingsModel, useBarChartSettings,
    Block, Button, Markdown
} from "@components";
import { AppRouteParams } from "@core";
import { CRUDScreenModel, useCRUDScreen } from "@screens";
import { Chart } from "@api";
import chartExplanation from "./chartExplanation.md?raw";

type ChartScreenStruct = RouteScreenBaseStruct<{
    props: {
        routeParams: AppRouteParams<"/charts/:id">;
        chart: Chart;
    };

    children: {
        crudScreen: CRUDScreenModel;
        titleField: TextFieldModel;
        descriptionField: TextFieldModel;
        typeField: SelectModel;
        lineChartSettings: LineChartSettingsModel;
        pieChartSettings: PieChartSettingsModel;
        barChartSettings: BarChartSettingsModel;
        scatterChartSettings: ScatterChartSettingsModel;
        lineChartPreview: LineChartModel;
        pieChartPreview: PieChartModel;
        barChartPreview: BarChartModel;
        scatterChartPreview: ScatterChartModel;
    };

    methods: {
        doOnRefresh: () => Promise<void>;
        doOnValidate: () => Promise<boolean>;
        doOnSave: () => Promise<void>;
        doOnCancel: () => Promise<void>;
        doOnDelete: () => Promise<void>;
        _contentView: () => React.JSX.Element;
        _renderChartPreview: () => React.JSX.Element;
        _renderChartSettings: () => React.JSX.Element;
    };

    modelsToValidate: () => (TextFieldModel | SelectModel)[];
}>;

type ChartScreenParams = RouteScreenBaseParams<ChartScreenStruct>;
type ChartScreenModel = RouteScreenBaseModel<ChartScreenStruct>;

function useChartScreen(params?: ChartScreenParams): ChartScreenModel {
    const struct: ChartScreenStruct = {
        props: {
            id: useChartScreen.name,
            chart: undefined,
        },

        children: {
            crudScreen: useCRUDScreen({
                intent: "edit",
                breadcrumbs: () => [
                    {
                        route: { path: "/charts" },
                        label: "Charts"
                    },
                    {
                        route: { path: "/charts/:id", params: { id: model.routeParams?.id } },
                        label: model.chart?.title || "Chart"
                    }
                ],
                toolsView: () => (
                    <Row>
                        <Button
                            contentView="Explain"
                            onClick={() => {
                                model.crudScreen.screenLayout.drawerPanel.titleView = "Chart Editor Explanation";
                                model.crudScreen.screenLayout.drawerPanel.contentView = <Markdown source={chartExplanation} />;
                                model.crudScreen.screenLayout.drawerPanel.open = true;
                            }}
                        />
                        <Button
                            contentView="Code"
                            onClick={async () => await model.openNewTab({ path: "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/demo/chart/chartScreen.tsx" })}
                        />
                    </Row>
                ),
                contentView: () => model._contentView(),
                onRefresh: () => model.doOnRefresh(),
                onSave: () => model.doOnSave(),
                onValidate: () => model.doOnValidate(),
                onCancel: () => model.doOnCancel(),
                onDelete: () => model.doOnDelete(),
            }),

            titleField: useTextField({
                labelView: "Title",
                value: UECA.bind(() => model.chart, "title"),
                required: true,
                onChange: _setToModified,
            }),

            descriptionField: useTextField({
                labelView: "Description",
                value: UECA.bind(() => model.chart, "description"),
                multiline: true,
                onChange: _setToModified,
            }),

            typeField: useSelect({
                labelView: "Chart Type",
                value: UECA.bind(() => model.chart, "type") as UECA.Bond<string | number>,                                
                required: true,
                disabled: () => !model.crudScreen.getScreenState().dataNew,
                options: [
                    { value: "pie", label: "Pie Chart" },
                    { value: "line", label: "Line Chart" },
                    { value: "scatter", label: "Scatter Chart" },
                    { value: "bar", label: "Bar Chart" },
                ],
                // placeholder: "Select chart type",
                onChange: _setToModified,
            }),

            lineChartSettings: useLineChartSettings({
                chart: () => model.chart,
                onChange: _setToModified,
            }),

            pieChartSettings: usePieChartSettings({
                chart: () => model.chart,
                onChange: _setToModified,
            }),

            barChartSettings: useBarChartSettings({
                chart: () => model.chart,
                onChange: _setToModified,
            }),

            scatterChartSettings: useScatterChartSettings({
                chart: () => model.chart,
                onChange: _setToModified,
            }),

            lineChartPreview: useLineChart({
                chart: () => model.chart,
            }),

            pieChartPreview: usePieChart({
                chart: () => model.chart,
            }),

            barChartPreview: useBarChart({
                chart: () => model.chart,
            }),

            scatterChartPreview: useScatterChart({
                chart: () => model.chart,
            }),
        },

        methods: {
            doOnRefresh: async () => {
                if (model.routeParams?.id === "0") {
                    // New chart case
                    model.chart = {
                        id: "0",
                        title: "",
                        description: "",
                        type: "line",
                        data: [],
                        pieChartConfig: {
                            showLabels: true,
                            showTooltip: true,
                            showLegend: true,
                            legendDirection: "vertical",
                            legendPosition: { vertical: "bottom", horizontal: "end" },
                            innerRadius: 0,
                            outerRadius: 100,
                            paddingAngle: 0,
                            cornerRadius: 0,
                            margin: { top: 50, right: 50, bottom: 50, left: 50 }
                        },
                        lineChartConfig: {
                            showTooltip: true,
                            showLegend: true,
                            legendDirection: "vertical",
                            legendPosition: { vertical: "bottom", horizontal: "end" },
                            showGrid: true,
                            xAxisLabel: undefined,
                            yAxisLabel: undefined,
                            xAxisType: "linear",
                            yAxisType: "linear",
                            curve: "linear",
                            area: false,
                            margin: { top: 50, right: 50, bottom: 50, left: 50 },
                        },
                        scatterChartConfig: {
                            showGrid: true,
                            showLegend: true,
                            legendDirection: "vertical",
                            legendPosition: { vertical: "bottom", horizontal: "end" },
                            showTooltip: true,
                            xAxisLabel: undefined,
                            yAxisLabel: undefined,
                            xAxisType: "linear",
                            yAxisType: "linear",
                            margin: { top: 50, right: 50, bottom: 50, left: 50 },
                        },
                        barChartConfig: {
                            showGrid: true,
                            showLegend: true,
                            legendDirection: "vertical",
                            legendPosition: { vertical: "bottom", horizontal: "end" },
                            showTooltip: true,
                            xAxisLabel: undefined,
                            yAxisLabel: undefined,
                            yAxisType: "linear",
                            layout: "vertical",
                            margin: { top: 50, right: 50, bottom: 50, left: 50 },
                        },
                    };
                    model.crudScreen.setScreenState({ dataNew: true });
                    return;
                }

                // Existing chart case
                model.chart = await model.bus.unicast("Api.GetChart", { id: model.routeParams?.id });

                if (!model.chart) {
                    // Handle case where chart is not found                    
                    await model.crudScreen.goToParentScreen(true);
                }
            },

            doOnValidate: async () => {
                await model.validate();
                return model.isValid();
            },

            doOnSave: async () => {
                if (model.crudScreen.getScreenState().dataNew) {
                    model.chart = await model.bus.unicast("Api.CreateChart", model.chart);
                    await model.updateRouteParams({ id: model.chart.id }, true);
                } else {
                    model.chart = await model.bus.unicast("Api.UpdateChart", model.chart);
                }
            },

            doOnCancel: async () => {
                await model.crudScreen.refresh();
            },

            doOnDelete: async () => {
                await model.bus.unicast("Api.DeleteChart", { id: model.chart.id });
            },

            _renderChartPreview: () => {
                const chartType = model.chart?.type;
                switch (chartType) {
                    case "line":
                        return <model.lineChartPreview.View />;
                    case "scatter":
                        return <model.scatterChartPreview.View />;
                    case "bar":
                        return <model.barChartPreview.View />;
                    case "pie":
                    default:
                        return <model.pieChartPreview.View />;
                }
            },

            _renderChartSettings: () => {
                const chartType = model.chart?.type;
                switch (chartType) {
                    case "line":
                        return <model.lineChartSettings.View />;
                    case "scatter":
                        return <model.scatterChartSettings.View />;
                    case "bar":
                        return <model.barChartSettings.View />;
                    case "pie":
                    default:
                        return <model.pieChartSettings.View />;
                }
            },

            _contentView: () => (
                <Row fill divider>
                    {/* Chart Preview Panel */}
                    <Col fill padding={{ right: "small" }}>
                        {model._renderChartPreview()}
                    </Col>

                    {/* Chart Settings Panel */}
                    <Col width={400} padding={{ left: "small" }}>
                        <h5>Chart Settings</h5>
                        <Block role={"editor"}>
                            <Col
                                fill
                                spacing={"medium"}
                                padding={{ topBottom: "medium", right: "medium" }}
                            >
                                {/* Common Settings */}
                                <model.titleField.View />
                                <model.descriptionField.View />
                                <model.typeField.View />

                                {/* Chart-Specific Settings */}
                                {model._renderChartSettings()}
                            </Col>
                        </Block>
                    </Col>
                </Row>
            ),
        },

        modelsToValidate: () => [model.titleField, model.typeField],

        init: async () => {
            await model.crudScreen.refresh();
        },

        View: () => <model.crudScreen.View />
    };

    const model = useRouteScreenBase(struct, params);
    return model;

    // Private methods
    function _setToModified() {
        model.crudScreen.setScreenState({ dataModified: true });
    }
}

const ChartScreen = UECA.getFC(useChartScreen);

export { ChartScreenParams, ChartScreenModel, useChartScreen, ChartScreen };