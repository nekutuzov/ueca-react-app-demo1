import * as UECA from "ueca-react";
import { LineChart as MUILineChart, LineChartProps } from "@mui/x-charts/LineChart";
import { Typography } from "@mui/material";
import { MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase, Col } from "@components";
import { Chart } from "@api";

type LineChartStruct = MuiBaseStruct<{
    props: {
        chart: Chart;
    };
}, LineChartProps>;

type LineChartParams = MuiBaseParams<LineChartStruct, LineChartProps>;
type LineChartModel = MuiBaseModel<LineChartStruct, LineChartProps>;

function useLineChart(params?: LineChartParams): LineChartModel {
    const struct: LineChartStruct = {
        props: {
            id: useLineChart.name,
            chart: undefined,
        },

        View: () => {
            const config = model.chart?.lineChartConfig;
            if (!config) return null;

            const series = [{
                id: "main",
                label: model.chart?.title,
                data: model.chart.data.map((point, index) => {
                    const xAxisType = config.xAxisType;
                    return {
                        x: xAxisType === "point" || xAxisType === "band" ? point.label || `Item ${index + 1}` : index,
                        y: point.value
                    };
                }),
                color: "#1976d2",
                curve: config.curve,
                area: config.area,
            }];

            return (
                <Col fill>
                    {model.chart?.title && (
                        <Typography
                            variant={"h6"}
                            component={"h3"}
                            align={"center"}
                            sx={{ mb: 2 }}
                        >
                            {model.chart.title}
                        </Typography>
                    )}
                    <MUILineChart
                        id={model.htmlId()}
                        width={model.extent?.width as number}
                        height={model.extent?.height as number}
                        series={series.map(s => ({
                            id: s.id,
                            label: s.label,
                            data: s.data?.map(point => point.y),
                            color: s.color,
                            curve: s.curve,
                            area: s.area,
                            connectNulls: true
                        }))}
                        xAxis={[{
                            data: series.length > 0 ? series[0]?.data?.map(point => point.x) : [],
                            scaleType: config.xAxisType,
                            label: config.xAxisLabel
                        }]}
                        yAxis={[{
                            scaleType: config.yAxisType,
                            label: config.yAxisLabel,
                            ...(config.yAxisType === "point" || config.yAxisType === "band" ? {
                                data: series.length > 0 ? series[0]?.data?.map((_, index) => `Y${index}`) : []
                            } : {})
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

const LineChart = UECA.getFC(useLineChart);

export { LineChartModel, LineChartParams, useLineChart, LineChart };