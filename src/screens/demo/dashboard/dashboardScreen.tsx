import * as UECA from "ueca-react";
import {
    RouteScreenBaseModel, RouteScreenBaseParams, RouteScreenBaseStruct, useRouteScreenBase, CardModel,
    useCard, Row, PieChartModel, usePieChart, Block, Button, Markdown
} from "@components";
import { CRUDScreenModel, useCRUDScreen } from "@screens";
import { User, Chart, ChartDataPoint } from "@api";
import dashboardExplanation from "./dashboardExplanation.md?raw";

type DashboardScreenStruct = RouteScreenBaseStruct<{
    props: {
        usersByCountryChart: Chart;
        usersByStatusChart: Chart;
    };

    children: {
        crudScreen: CRUDScreenModel;
        usersByCountryCard: CardModel;
        usersByCountryPieChart: PieChartModel;
        usersByStatusCard: CardModel;
        usersByStatusPieChart: PieChartModel;
    };

    methods: {
        doOnRefresh: () => Promise<void>;
        contentView: () => React.JSX.Element;
        _generateCountryChartData: (users: User[]) => ChartDataPoint[];
        _generateStatusChartData: (users: User[]) => ChartDataPoint[];
    };
}>;

type DashboardScreenParams = RouteScreenBaseParams<DashboardScreenStruct>;
type DashboardScreenModel = RouteScreenBaseModel<DashboardScreenStruct>;

function useDashboardScreen(params?: DashboardScreenParams): DashboardScreenModel {
    const struct: DashboardScreenStruct = {
        props: {
            id: useDashboardScreen.name,
            usersByCountryChart: {
                id: "country-chart",
                type: "pie",
                data: [],
                pieChartConfig: {
                    showLabels: false,
                    showTooltip: true,
                    showLegend: true,
                    legendDirection: "vertical",
                    legendPosition: { vertical: "top", horizontal: "end" },
                    innerRadius: 30,
                    outerRadius: 80,
                    paddingAngle: 0,
                    cornerRadius: 0,
                    margin: {
                        top: 50,
                        right: 50,
                        bottom: 50,
                        left: 50
                    }
                }
            },
            usersByStatusChart: {
                id: "status-chart",
                type: "pie",
                data: [],
                pieChartConfig: {
                    showLabels: false,
                    showTooltip: true,
                    showLegend: true,
                    legendDirection: "vertical",
                    legendPosition: { vertical: "top", horizontal: "end" },
                    innerRadius: 30,
                    outerRadius: 80,
                    paddingAngle: 0,
                    cornerRadius: 0,
                    margin: {
                        top: 50,
                        right: 50,
                        bottom: 50,
                        left: 50
                    }
                }
            },
        },

        children: {
            crudScreen: useCRUDScreen({
                intent: "view",
                breadcrumbs: () => [
                    { route: { path: "/dashboard" }, label: "Dashboard" }
                ],
                toolsView: () => (
                    <Row>
                        <Button
                            contentView="Explain"
                            onClick={() => {
                                model.crudScreen.screenLayout.drawerPanel.titleView = "Dashboard Explanation";
                                model.crudScreen.screenLayout.drawerPanel.contentView = <Markdown source={dashboardExplanation} />;
                                model.crudScreen.screenLayout.drawerPanel.open = true;
                            }}
                        />
                        <Button
                            contentView="Code"
                            onClick={async () => await model.openNewTab({ path: "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/demo/dashboard/dashboardScreen.tsx" })}
                        />
                    </Row>
                ),
                contentView: () => model.contentView(),
                onRefresh: () => model.doOnRefresh(),
            }),

            usersByCountryPieChart: usePieChart({
                chart: () => model.usersByCountryChart,
                extent: { height: 200, width: 250 },
            }),

            usersByStatusPieChart: usePieChart({
                chart: () => model.usersByStatusChart,
                extent: { height: 200, width: 250 },
            }),

            usersByCountryCard: useCard({
                titleView: "Users by Country",
                bodyView: () => <model.usersByCountryPieChart.View />,
                subtitleView: () => `Total: ${model.usersByCountryChart.data?.reduce((sum, item) => sum + item.value, 0) || 0} users`,
                clickable: true,
                onClick: async () => {
                    await model.goToRoute({ path: "/users" });
                },
            }),

            usersByStatusCard: useCard({
                titleView: "User Status",
                bodyView: () => <model.usersByStatusPieChart.View />,
                subtitleView: () => {
                    const activeCount = model.usersByStatusChart.data?.find(item => item.id === 'active')?.value || 0;
                    return `Active: ${activeCount} users`;
                },
                clickable: true,
                onClick: async () => {
                    await model.goToRoute({ path: "/users" });
                },
            }),
        },

        methods: {
            doOnRefresh: async () => {
                // Fetch user count from API
                const users = await model.bus.unicast("Api.GetUsers", undefined);

                // Update pie chart with country data
                const countryChartData = model._generateCountryChartData(users || []);
                model.usersByCountryChart.data = countryChartData;

                // Update pie chart with status data
                const statusChartData = model._generateStatusChartData(users || []);
                model.usersByStatusChart.data = statusChartData;
            },

            contentView: () => (
                <Block>
                    <Row spacing={"large"}>
                        <model.usersByCountryCard.View />
                        <model.usersByStatusCard.View />
                    </Row>
                </Block>
            ),

            _generateCountryChartData: (users: User[]) => {
                // Count users by country
                const countryCount = users.reduce((acc: Record<string, number>, user) => {
                    const country = user.address?.country || 'Unknown';
                    acc[country] = (acc[country] || 0) + 1;
                    return acc;
                }, {});

                // Convert to chart data format with colors
                const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
                return Object.entries(countryCount).map(([country, count], index) => ({
                    id: country,
                    label: country,
                    value: count,
                    color: colors[index % colors.length],
                }));
            },

            _generateStatusChartData: (users: User[]) => {
                // Count active and inactive users
                const activeCount = users.filter(user => user.active).length;
                const inactiveCount = users.filter(user => !user.active).length;

                return [
                    {
                        id: 'active',
                        label: 'Active',
                        value: activeCount,
                        color: '#4CAF50', // Green for active
                    },
                    {
                        id: 'inactive',
                        label: 'Inactive',
                        value: inactiveCount,
                        color: '#F44336', // Red for inactive
                    },
                ].filter(item => item.value > 0); // Only show categories with data
            },
        },

        init: async () => {
            await model.crudScreen.refresh();
        },

        View: () => <model.crudScreen.View />
    }

    const model = useRouteScreenBase(struct, params);
    return model;
}

const DashboardScreen = UECA.getFC(useDashboardScreen);

export { DashboardScreenParams, DashboardScreenModel, useDashboardScreen, DashboardScreen }
