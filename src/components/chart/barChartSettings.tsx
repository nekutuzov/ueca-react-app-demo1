import * as UECA from "ueca-react";
import {
    CheckboxModel, Col, TextFieldModel, SelectModel, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase,
    useCheckbox, useTextField, useSelect
} from "@components";
import { Chart } from "@api";

type BarChartSettingsStruct = UIBaseStruct<{
    props: {
        chart: Chart;
    };
    children: {
        showGridCheckbox: CheckboxModel;
        showLegendCheckbox: CheckboxModel;
        legendDirectionSelect: SelectModel;
        legendVerticalPositionSelect: SelectModel;
        legendHorizontalPositionSelect: SelectModel;
        showTooltipCheckbox: CheckboxModel;
        xAxisLabelField: TextFieldModel;
        yAxisLabelField: TextFieldModel;
        yAxisTypeSelect: SelectModel;
        layoutSelect: SelectModel;
        marginTopField: TextFieldModel;
        marginRightField: TextFieldModel;
        marginBottomField: TextFieldModel;
        marginLeftField: TextFieldModel;
    };
    events: {
        onChange: () => void;
    };
}>;

type BarChartSettingsParams = UIBaseParams<BarChartSettingsStruct>;
type BarChartSettingsModel = UIBaseModel<BarChartSettingsStruct>;

function useBarChartSettings(params?: BarChartSettingsParams): BarChartSettingsModel {
    const struct: BarChartSettingsStruct = {
        props: {
            id: useBarChartSettings.name,
            chart: undefined,
        },

        children: {
            showGridCheckbox: useCheckbox({
                labelView: "Show Grid",
                checked: UECA.bind(() => model.chart?.barChartConfig, "showGrid"),
                onChange: () => model.onChange?.(),
            }),

            showLegendCheckbox: useCheckbox({
                labelView: "Show Legend",
                checked: UECA.bind(() => model.chart?.barChartConfig, "showLegend"),
                onChange: () => model.onChange?.(),
            }),

            legendDirectionSelect: useSelect({
                labelView: "Legend Direction",
                options: [
                    { value: "horizontal", label: "Horizontal" },
                    { value: "vertical", label: "Vertical" }
                ],
                value: UECA.bind(() => model.chart?.barChartConfig, "legendDirection") as UECA.Bond<string | number>,
                placeholder: "Select direction",
                onChange: () => model.onChange?.(),
            }),

            legendVerticalPositionSelect: useSelect({
                labelView: "Legend Vertical Position",
                options: [
                    { value: "top", label: "Top" },
                    { value: "middle", label: "Middle" },
                    { value: "bottom", label: "Bottom" }
                ],
                value: UECA.bind(() => model.chart?.barChartConfig?.legendPosition, "vertical") as UECA.Bond<string | number>,
                placeholder: "Select vertical position",
                onChange: () => model.onChange?.(),
            }),

            legendHorizontalPositionSelect: useSelect({
                labelView: "Legend Horizontal Position",
                options: [
                    { value: "start", label: "Start" },
                    { value: "center", label: "Center" },
                    { value: "end", label: "End" }
                ],
                value: UECA.bind(() => model.chart?.barChartConfig?.legendPosition, "horizontal") as UECA.Bond<string | number>,
                placeholder: "Select horizontal position",
                onChange: () => model.onChange?.(),
            }),

            showTooltipCheckbox: useCheckbox({
                labelView: "Show Tooltip",
                checked: UECA.bind(() => model.chart?.barChartConfig, "showTooltip"),
                onChange: () => model.onChange?.(),
            }),

            xAxisLabelField: useTextField({
                labelView: () => model.chart?.barChartConfig?.layout === "horizontal" ? "Category Axis Label" : "X-Axis Label",
                value: UECA.bind(() => model.chart?.barChartConfig, "xAxisLabel"),
                onChange: () => model.onChange?.(),
            }),

            yAxisLabelField: useTextField({
                labelView: () => model.chart?.barChartConfig?.layout === "horizontal" ? "Value Axis Label" : "Y-Axis Label",
                value: UECA.bind(() => model.chart?.barChartConfig, "yAxisLabel"),
                onChange: () => model.onChange?.(),
            }),

            yAxisTypeSelect: useSelect({
                labelView: () => model.chart?.barChartConfig?.layout === "horizontal" ? "Value Axis Type" : "Y-Axis Type",
                options: [
                    { value: "linear", label: "Linear" },
                    { value: "point", label: "Point" },
                    { value: "band", label: "Band" },
                    { value: "time", label: "Time" },
                    { value: "utc", label: "UTC" },
                    { value: "log", label: "Log" }
                ],
                value: UECA.bind(() => model.chart?.barChartConfig, "yAxisType") as UECA.Bond<string | number>,
                onChange: () => model.onChange?.(),
            }),

            layoutSelect: useSelect({
                labelView: "Chart Layout",
                options: [
                    { value: "vertical", label: "Vertical Bars" },
                    { value: "horizontal", label: "Horizontal Bars" }
                ],
                value: UECA.bind(() => model.chart?.barChartConfig, "layout") as UECA.Bond<string | number>,
                onChange: () => model.onChange?.(),
            }),

            marginTopField: useTextField({
                labelView: "Top Margin",
                value: UECA.bind(() => model.chart?.barChartConfig?.margin, "top"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),

            marginRightField: useTextField({
                labelView: "Right Margin",
                value: UECA.bind(() => model.chart?.barChartConfig?.margin, "right"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),

            marginBottomField: useTextField({
                labelView: "Bottom Margin",
                value: UECA.bind(() => model.chart?.barChartConfig?.margin, "bottom"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),

            marginLeftField: useTextField({
                labelView: "Left Margin",
                value: UECA.bind(() => model.chart?.barChartConfig?.margin, "left"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),
        },

        View: () => (
            <Col fill spacing="medium">
                <h5>Plot Settings</h5>
                <model.layoutSelect.View />
                <model.showGridCheckbox.View />
                <model.showTooltipCheckbox.View />

                <h5>Legend Configuration</h5>
                <model.showLegendCheckbox.View />
                <model.legendDirectionSelect.View />
                <model.legendVerticalPositionSelect.View />
                <model.legendHorizontalPositionSelect.View />

                <h5>Axis Configuration</h5>
                <model.xAxisLabelField.View />
                <model.yAxisLabelField.View />
                <model.yAxisTypeSelect.View />

                <h5>Margins</h5>
                <model.marginTopField.View />
                <model.marginRightField.View />
                <model.marginBottomField.View />
                <model.marginLeftField.View />
            </Col>
        )
    };

    const model = useUIBase(struct, params);
    return model;
}

const BarChartSettings = UECA.getFC(useBarChartSettings);

export { BarChartSettingsModel, useBarChartSettings, BarChartSettings };