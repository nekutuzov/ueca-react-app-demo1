import * as UECA from "ueca-react";
import { BarChart as MUIBarChart, BarChartProps } from "@mui/x-charts/BarChart";
import { Typography } from "@mui/material";
import { MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase, Col } from "@components";
import { Chart } from "@api";

type BarChartStruct = MuiBaseStruct<{
    props: {
        chart: Chart;
    };
}, BarChartProps>;

type BarChartParams = MuiBaseParams<BarChartStruct, BarChartProps>;
type BarChartModel = MuiBaseModel<BarChartStruct, BarChartProps>;

function useBarChart(params?: BarChartParams): BarChartModel {
    const struct: BarChartStruct = {
        props: {
            id: useBarChart.name,
            chart: undefined,
        },

        View: () => {
            const config = model.chart?.barChartConfig;
            if (!config) return null;

            // Convert ChartDataPoint[] to bar chart format
            const series = [{
                id: "main",
                label: model.chart.title,
                data: model.chart.data.map(point => point.value),
                color: "#1976d2"
            }];

            const xAxisData = model.chart.data.map(point => point.label || point.id);

            return (
                <Col fill>
                    {model.chart.title && (
                        <Typography
                            variant="h6"
                            component="h3"
                            align="center"
                            sx={{ mb: 2 }}
                        >
                            {model.chart.title}
                        </Typography>
                    )}
                    <MUIBarChart
                        id={model.htmlId()}
                        width={model.extent?.width as number}
                        height={model.extent?.height as number}
                        series={series}
                        xAxis={[{
                            // For horizontal layout, X-axis becomes the value axis
                            ...(config.layout === "horizontal" ? {
                                scaleType: config.yAxisType,
                                label: config.yAxisLabel
                            } : {
                                // For vertical layout, X-axis is the category axis
                                data: xAxisData,
                                scaleType: "band",
                                label: config.xAxisLabel
                            })
                        }]}
                        yAxis={[{
                            // For horizontal layout, Y-axis becomes the category axis
                            ...(config.layout === "horizontal" ? {
                                data: xAxisData,
                                scaleType: "band",
                                label: config.xAxisLabel
                            } : {
                                // For vertical layout, Y-axis is the value axis
                                scaleType: config.yAxisType,
                                label: config.yAxisLabel
                            })
                        }]}
                        grid={config.showGrid ? { vertical: true, horizontal: true } : undefined}
                        margin={{ ...config.margin }}
                        hideLegend={!config.showLegend}
                        layout={config.layout}
                        slots={config.showTooltip ? undefined : { tooltip: () => null }}
                        slotProps={{
                            legend: {
                                direction: config.legendDirection,
                                position: { ...config.legendPosition }
                            }
                        }}
                        {...model.mui}
                    />
                </Col>
            );
        }
    };

    const model = useMuiBase(struct, params);
    return model;
}

const BarChart = UECA.getFC(useBarChart);

export { BarChartModel, BarChartParams, useBarChart, BarChart };