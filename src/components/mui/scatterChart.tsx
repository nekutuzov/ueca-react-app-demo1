import * as UECA from "ueca-react";
import { ScatterChart as MUIScatterChart, ScatterChartProps } from "@mui/x-charts/ScatterChart";
import { Typography } from "@mui/material";
import { MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase, Col } from "@components";
import { Chart } from "@api";

type ScatterChartStruct = MuiBaseStruct<{
    props: {
        chart: Chart;
    };
}, ScatterChartProps>;

type ScatterChartParams = MuiBaseParams<ScatterChartStruct, ScatterChartProps>;
type ScatterChartModel = MuiBaseModel<ScatterChartStruct, ScatterChartProps>;

function useScatterChart(params?: ScatterChartParams): ScatterChartModel {
    const struct: ScatterChartStruct = {
        props: {
            id: useScatterChart.name,
            chart: undefined,
        },

        View: () => {
            const config = model.chart?.scatterChartConfig;
            if (!config) return null;

            // Convert ChartDataPoint[] to scatter format
            const series = [{
                id: "main",
                label: model.chart.title || "Data",
                data: model.chart.data.map((point, index) => ({
                    x: typeof point.value === 'number' ? point.value : index,
                    y: typeof point.value === 'number' ? point.value + Math.random() * 10 : index,
                    id: point.id
                })),
                color: "#1976d2"
            }];

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
                    <MUIScatterChart
                        id={model.htmlId()}
                        width={model.extent?.width as number}
                        height={model.extent?.height as number}
                        series={series}
                        xAxis={[{
                            scaleType: config.xAxisType,
                            label: config.xAxisLabel
                        }]}
                        yAxis={[{
                            scaleType: config.yAxisType,
                            label: config.yAxisLabel
                        }]}
                        grid={config.showGrid ? { vertical: true, horizontal: true } : undefined}
                        margin={{ ...config.margin }}
                        hideLegend={!config.showLegend}
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

const ScatterChart = UECA.getFC(useScatterChart);

export { ScatterChartModel, ScatterChartParams, useScatterChart, ScatterChart };