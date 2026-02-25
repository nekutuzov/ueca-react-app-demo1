import * as UECA from "ueca-react";
import { PieChart as MUIPieChart, PieChartProps } from "@mui/x-charts/PieChart";
import { Typography } from "@mui/material";
import { MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase, Col } from "@components";
import { Chart } from "@api";

type PieChartStruct = MuiBaseStruct<{
    props: {
        chart: Chart;
    };
}, PieChartProps>;

type PieChartParams = MuiBaseParams<PieChartStruct, PieChartProps>;
type PieChartModel = MuiBaseModel<PieChartStruct, PieChartProps>;

function usePieChart(params?: PieChartParams): PieChartModel {
    const struct: PieChartStruct = {
        props: {
            id: usePieChart.name,
            chart: undefined,
        },

        View: () => {
            const config = model.chart?.pieChartConfig;
            if (!config) return null;

            return (
                <Col fill>
                    {model.chart.title && (
                        <Typography
                            variant={"h6"}
                            component={"h3"}
                            align={"center"}
                            sx={{ mb: 2 }}
                        >
                            {model.chart.title}
                        </Typography>
                    )}
                    <MUIPieChart
                        id={model.htmlId()}
                        series={[{
                            data: model.chart.data,
                            innerRadius: config.innerRadius,
                            outerRadius: config.outerRadius,
                            paddingAngle: config.paddingAngle,
                            cornerRadius: config.cornerRadius,
                            arcLabel: config.showLabels ? ((item) => `${item.label}`) : undefined,
                        }]}
                        slots={config.showTooltip ? undefined : {
                            tooltip: () => null
                        }}
                        slotProps={{
                            legend: {
                                direction: config.legendDirection,
                                position: { ...config.legendPosition }
                            }
                        }}
                        width={model.extent?.width as number}
                        height={model.extent?.height as number}
                        margin={{ ...config.margin }}
                        hideLegend={!config.showLegend}
                        {...model.mui}
                    />
                </Col>
            );
        }
    };

    const model = useMuiBase(struct, params);
    return model;
}

const PieChart = UECA.getFC(usePieChart);

export { PieChartModel, PieChartParams, usePieChart, PieChart };
