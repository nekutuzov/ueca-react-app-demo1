import * as UECA from "ueca-react";
import {
    CheckboxModel, Col, SelectModel, TextFieldModel, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase,
    useCheckbox, useSelect, useTextField
} from "@components";
import { Chart } from "@api";

type LineChartSettingsStruct = UIBaseStruct<{
    props: {
        chart: Chart;
    };

    children: {
        showTooltipCheckbox: CheckboxModel;
        areaCheckbox: CheckboxModel;
        showLegendCheckbox: CheckboxModel;
        legendDirectionSelect: SelectModel;
        legendVerticalPositionSelect: SelectModel;
        legendHorizontalPositionSelect: SelectModel;
        showGridCheckbox: CheckboxModel;
        xAxisLabelField: TextFieldModel;
        yAxisLabelField: TextFieldModel;
        xAxisTypeSelect: SelectModel;
        yAxisTypeSelect: SelectModel;
        curveSelect: SelectModel;
        marginTopField: TextFieldModel;
        marginRightField: TextFieldModel;
        marginBottomField: TextFieldModel;
        marginLeftField: TextFieldModel;
    };

    events: {
        onChange: () => void;
    };
}>;

type LineChartSettingsParams = UIBaseParams<LineChartSettingsStruct>;
type LineChartSettingsModel = UIBaseModel<LineChartSettingsStruct>;

function useLineChartSettings(params?: LineChartSettingsParams): LineChartSettingsModel {
    const struct: LineChartSettingsStruct = {
        props: {
            id: useLineChartSettings.name,
            chart: undefined,
        },

        children: {
            showTooltipCheckbox: useCheckbox({
                labelView: "Show Tooltip",
                checked: UECA.bind(() => model.chart?.lineChartConfig, "showTooltip"),
                onChange: () => model.onChange?.(),
            }),

            areaCheckbox: useCheckbox({
                labelView: "Fill Area Under Line",
                checked: UECA.bind(() => model.chart?.lineChartConfig, "area"),
                onChange: () => model.onChange?.(),
            }),

            showLegendCheckbox: useCheckbox({
                labelView: "Show Legend",
                checked: UECA.bind(() => model.chart?.lineChartConfig, "showLegend"),
                onChange: () => model.onChange?.(),
            }),

            legendDirectionSelect: useSelect({
                labelView: "Legend Direction",
                options: [
                    { value: "horizontal", label: "Horizontal" },
                    { value: "vertical", label: "Vertical" }
                ],
                value: UECA.bind(() => model.chart?.lineChartConfig, "legendDirection") as UECA.Bond<string | number>,
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
                value: UECA.bind(() => model.chart?.lineChartConfig?.legendPosition, "vertical") as UECA.Bond<string | number>,
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
                value: UECA.bind(() => model.chart?.lineChartConfig?.legendPosition, "horizontal") as UECA.Bond<string | number>,
                placeholder: "Select horizontal position",
                onChange: () => model.onChange?.(),
            }),

            showGridCheckbox: useCheckbox({
                labelView: "Show Grid",
                checked: UECA.bind(() => model.chart?.lineChartConfig, "showGrid"),
                onChange: () => model.onChange?.(),
            }),

            xAxisLabelField: useTextField({
                labelView: "X-Axis Label",
                value: UECA.bind(() => model.chart?.lineChartConfig, "xAxisLabel"),
                onChange: () => model.onChange?.(),
            }),

            yAxisLabelField: useTextField({
                labelView: "Y-Axis Label",
                value: UECA.bind(() => model.chart?.lineChartConfig, "yAxisLabel"),
                onChange: () => model.onChange?.(),
            }),

            xAxisTypeSelect: useSelect({
                labelView: "X-Axis Type",
                value: UECA.bind(() => model.chart?.lineChartConfig, "xAxisType") as UECA.Bond<string | number>,
                options: [
                    { value: "linear", label: "Linear" },
                    { value: "point", label: "Point" },
                    { value: "band", label: "Band" },
                    { value: "time", label: "Time" },
                    { value: "utc", label: "UTC" },
                    { value: "log", label: "Logarithmic" }
                ],
                placeholder: "Select axis type",
                onChange: () => model.onChange?.(),
            }),

            yAxisTypeSelect: useSelect({
                labelView: "Y-Axis Type",
                value: UECA.bind(() => model.chart?.lineChartConfig, "yAxisType") as UECA.Bond<string | number>,
                options: [
                    { value: "linear", label: "Linear" },
                    { value: "point", label: "Point" },
                    { value: "band", label: "Band" },
                    { value: "time", label: "Time" },
                    { value: "utc", label: "UTC" },
                    { value: "log", label: "Logarithmic" }
                ],
                placeholder: "Select axis type",
                onChange: () => model.onChange?.(),
            }),

            curveSelect: useSelect({
                labelView: "Line Curve",
                value: UECA.bind(() => model.chart?.lineChartConfig, "curve") as UECA.Bond<string | number>,
                options: [
                    { value: "linear", label: "Linear" },
                    { value: "monotoneX", label: "Smooth X" },
                    { value: "monotoneY", label: "Smooth Y" },
                    { value: "step", label: "Step" },
                    { value: "stepBefore", label: "Step Before" },
                    { value: "stepAfter", label: "Step After" }
                ],
                placeholder: "Select curve type",
                onChange: () => model.onChange?.(),
            }),

            marginTopField: useTextField({
                labelView: "Top Margin",
                value: UECA.bind(() => model.chart?.lineChartConfig?.margin, "top"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),

            marginRightField: useTextField({
                labelView: "Right Margin",
                value: UECA.bind(() => model.chart?.lineChartConfig?.margin, "right"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),

            marginBottomField: useTextField({
                labelView: "Bottom Margin",
                value: UECA.bind(() => model.chart?.lineChartConfig?.margin, "bottom"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),

            marginLeftField: useTextField({
                labelView: "Left Margin",
                value: UECA.bind(() => model.chart?.lineChartConfig?.margin, "left"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),
        },

        View: () => (
            <Col fill spacing={"large"}>
                <Col>
                    <h5>Plot Settings</h5>
                    <model.showGridCheckbox.View />
                    <model.areaCheckbox.View />
                    <model.showTooltipCheckbox.View />
                </Col>

                <Col spacing={"medium"}>
                    <h5>Legend Configuration</h5>
                    <model.showLegendCheckbox.View />
                    <model.legendDirectionSelect.View />
                    <model.legendVerticalPositionSelect.View />
                    <model.legendHorizontalPositionSelect.View />
                </Col>

                <Col spacing={"medium"}>
                    <h5>Axis Configuration</h5>
                    <model.xAxisLabelField.View />
                    <model.yAxisLabelField.View />
                    <model.xAxisTypeSelect.View />
                    <model.yAxisTypeSelect.View />
                </Col>

                <Col spacing={"medium"}>
                    <h5>Line Style</h5>
                    <model.curveSelect.View />
                </Col>

                <Col spacing={"medium"}>
                    <h5>Margins</h5>
                    <model.marginTopField.View />
                    <model.marginRightField.View />
                    <model.marginBottomField.View />
                    <model.marginLeftField.View />
                </Col>
            </Col>
        )
    };

    const model = useUIBase(struct, params);
    return model;
}

const LineChartSettings = UECA.getFC(useLineChartSettings);

export { LineChartSettingsModel, LineChartSettingsParams, useLineChartSettings, LineChartSettings };