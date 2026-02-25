import * as UECA from "ueca-react";
import {
    CheckboxModel, Col, TextFieldModel, SelectModel, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase,
    useCheckbox, useTextField, useSelect
} from "@components";
import { Chart } from "@api";

type PieChartSettingsStruct = UIBaseStruct<{
    props: {
        chart: Chart;
    };

    children: {
        showLabelsCheckbox: CheckboxModel;
        showTooltipCheckbox: CheckboxModel;
        showLegendCheckbox: CheckboxModel;
        legendDirectionSelect: SelectModel;
        legendVerticalPositionSelect: SelectModel;
        legendHorizontalPositionSelect: SelectModel;
        innerRadiusField: TextFieldModel;
        outerRadiusField: TextFieldModel;
        paddingAngleField: TextFieldModel;
        cornerRadiusField: TextFieldModel;
        marginTopField: TextFieldModel;
        marginRightField: TextFieldModel;
        marginBottomField: TextFieldModel;
        marginLeftField: TextFieldModel;
    };

    events: {
        onChange: () => void;
    };
}>;

type PieChartSettingsParams = UIBaseParams<PieChartSettingsStruct>;
type PieChartSettingsModel = UIBaseModel<PieChartSettingsStruct>;

function usePieChartSettings(params?: PieChartSettingsParams): PieChartSettingsModel {
    const struct: PieChartSettingsStruct = {
        props: {
            id: usePieChartSettings.name,
            chart: undefined,
        },

        children: {
            showLabelsCheckbox: useCheckbox({
                labelView: "Show Labels",
                checked: UECA.bind(() => model.chart?.pieChartConfig, "showLabels"),
                onChange: () => model.onChange?.(),
            }),

            showTooltipCheckbox: useCheckbox({
                labelView: "Show Tooltip",
                checked: UECA.bind(() => model.chart?.pieChartConfig, "showTooltip"),
                onChange: () => model.onChange?.(),
            }),

            showLegendCheckbox: useCheckbox({
                labelView: "Show Legend",
                checked: UECA.bind(() => model.chart?.pieChartConfig, "showLegend"),
                onChange: () => model.onChange?.(),
            }),

            legendDirectionSelect: useSelect({
                labelView: "Legend Direction",
                options: [
                    { value: "horizontal", label: "Horizontal" },
                    { value: "vertical", label: "Vertical" }
                ],
                value: UECA.bind(() => model.chart?.pieChartConfig, "legendDirection") as UECA.Bond<string | number>,
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
                value: UECA.bind(() => model.chart?.pieChartConfig?.legendPosition, "vertical") as UECA.Bond<string | number>,
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
                value: UECA.bind(() => model.chart?.pieChartConfig?.legendPosition, "horizontal") as UECA.Bond<string | number>,
                placeholder: "Select horizontal position",
                onChange: () => model.onChange?.(),
            }),

            innerRadiusField: useTextField({
                labelView: "Inner Radius",
                value: UECA.bind(() => model.chart?.pieChartConfig, "innerRadius"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),

            outerRadiusField: useTextField({
                labelView: "Outer Radius", 
                value: UECA.bind(() => model.chart?.pieChartConfig, "outerRadius"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),

            paddingAngleField: useTextField({
                labelView: "Padding Angle",
                value: UECA.bind(() => model.chart?.pieChartConfig, "paddingAngle"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),

            cornerRadiusField: useTextField({
                labelView: "Corner Radius",
                value: UECA.bind(() => model.chart?.pieChartConfig, "cornerRadius"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),

            marginTopField: useTextField({
                labelView: "Top Margin",
                value: UECA.bind(() => model.chart?.pieChartConfig?.margin, "top"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),

            marginRightField: useTextField({
                labelView: "Right Margin",
                value: UECA.bind(() => model.chart?.pieChartConfig?.margin, "right"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),

            marginBottomField: useTextField({
                labelView: "Bottom Margin",
                value: UECA.bind(() => model.chart?.pieChartConfig?.margin, "bottom"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),

            marginLeftField: useTextField({
                labelView: "Left Margin",
                value: UECA.bind(() => model.chart?.pieChartConfig?.margin, "left"),
                type: "number",
                onChange: () => model.onChange?.(),
            }),
        },        

        View: () => (
            <Col fill spacing="medium">
                <h5>Plot Settings</h5>
                <model.showLabelsCheckbox.View />
                <model.showTooltipCheckbox.View />
                
                <h5>Legend Configuration</h5>
                <model.showLegendCheckbox.View />
                <model.legendDirectionSelect.View />
                <model.legendVerticalPositionSelect.View />
                <model.legendHorizontalPositionSelect.View />
                
                <h5>Chart Appearance</h5>
                <model.innerRadiusField.View />
                <model.outerRadiusField.View />
                <model.paddingAngleField.View />
                <model.cornerRadiusField.View />
                
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

const PieChartSettings = UECA.getFC(usePieChartSettings);

export { PieChartSettingsModel, PieChartSettingsParams, usePieChartSettings, PieChartSettings };