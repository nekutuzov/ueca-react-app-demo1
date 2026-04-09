import * as UECA from "ueca-react";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {
    Button, ButtonModel, Col, Markdown, NavItem, RouteScreenBaseModel, RouteScreenBaseParams, RouteScreenBaseStruct, Row,
    TableModel, TableRoute, useButton, useRouteScreenBase, useTable
} from "@components";
import { CRUDScreenModel, useCRUDScreen } from "@screens";
import { Chart } from "@api";
import chartListExplanation from "./chartListExplanation.md?raw";

type ChartListScreenStruct = RouteScreenBaseStruct<{
    children: {
        crudScreen: CRUDScreenModel;
        chartsTable: TableModel<Chart>;
        addNewButton: ButtonModel;
    };

    methods: {
        doOnRefresh: () => Promise<void>;
        contentView: () => React.JSX.Element;
    };
}>;

type ChartListScreenParams = RouteScreenBaseParams<ChartListScreenStruct>;
type ChartListScreenModel = RouteScreenBaseModel<ChartListScreenStruct>;

function useChartListScreen(params?: ChartListScreenParams): ChartListScreenModel {
    const struct: ChartListScreenStruct = {
        props: {
            id: useChartListScreen.name,
        },

        children: {
            crudScreen: useCRUDScreen({
                intent: "view",
                breadcrumbs: () => [
                    { route: { path: "/charts" }, label: "Charts" }
                ],
                toolsView: () => (
                    <Row>
                        <Button
                            contentView="Explain"                        
                            onClick={() => {
                                model.crudScreen.screenLayout.drawerPanel.titleView = "Explanation";
                                model.crudScreen.screenLayout.drawerPanel.contentView = <Markdown source={chartListExplanation} />;
                                model.crudScreen.screenLayout.drawerPanel.open = true;
                            }}
                        />
                        <Button
                            contentView="Code"
                            onClick={async () => await model.openNewTab({ path: "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/demo/chart/chartListScreen.tsx" })}
                        />
                    </Row>
                ),
                contentView: () => model.contentView(),
                onRefresh: () => model.doOnRefresh(),
            }),

            chartsTable: useTable<Chart>({
                stickyHeader: true,
                size: "small",
            }),

            addNewButton: useButton({
                contentView: "Add New Chart",
                startIconView: <AddIcon />,
                variant: "contained",
                color: "primary",
                onClick: async () => {
                    await model.goToRoute({ path: "/charts/:id", params: { id: "0" } });
                },
            }),
        },

        methods: {
            doOnRefresh: async () => {
                model.chartsTable.data = await model.bus.unicast("Api.GetCharts", undefined);
            },

            contentView: () => (
                <Col fill>
                    <Row verticalAlign={"center"}>
                        Charts {model.chartsTable.data?.length}
                        <Col fill />
                        <model.addNewButton.View />
                    </Row>
                    <model.chartsTable.View />
                </Col>
            ),
        },

        constr: async () => {
            // Setup columns in constr to avoid columns state loss on refresh (e.g. sorting)
            _setupTable();
        },

        init: async () => {
            // Refresh data on every init to ensure we have the latest data
            await model.crudScreen.refresh();
        },

        View: () => <model.crudScreen.View />
    }

    const model = useRouteScreenBase(struct, params);
    return model;

    // Private methods
    function _setupTable() {
        const chartEditRoute: TableRoute<Chart> = (dataRecord) => ({ path: "/charts/:id", params: { id: dataRecord.fields.id } });
        model.chartsTable.columns = {
            title: {
                field: "title",
                titleView: "Title",
                sortable: true,
                width: 300,
                route: chartEditRoute,
            },
            type: {
                field: "type",
                titleView: "Type",
                sortable: true,
                width: 150,
                cellView: ({ dataRecord }) => (
                    <span style={{ 
                        textTransform: 'capitalize',
                        fontWeight: 'medium'
                    }}>
                        {dataRecord.fields.type}
                    </span>
                ),
            },
            description: {
                field: "description",
                titleView: "Description",
                width: 400,
                cellView: ({ dataRecord }) => (
                    <span style={{ 
                        color: dataRecord.fields.description ? 'inherit' : '#999',
                        fontStyle: dataRecord.fields.description ? 'normal' : 'italic'
                    }}>
                        {dataRecord.fields.description || 'No description'}
                    </span>
                ),
            },
            dataCount: {
                field: (rec) => rec.data?.length || 0,
                titleView: "Data Points",
                sortable: true,
                width: 120,
                align: "center",
            },
            createdAt: {
                field: "createdAt",
                titleView: "Created",
                sortable: true,
                dataType: "datetime",
                width: 180,
            },
            actions: {
                width: 50,
                actionView: ({ dataRecord }) => (
                    <NavItem
                        id={`editButton_row${dataRecord.index}`}
                        kind={"button"}
                        active={model.chartsTable.activeRecord?.index == dataRecord.index}
                        icon={<EditIcon fontSize="inherit" />}
                        text={"Edit"}
                        route={chartEditRoute(dataRecord)}
                    />
                ),
            },
        }
    }
}

const ChartListScreen = UECA.getFC(useChartListScreen);

export { ChartListScreenParams, ChartListScreenModel, useChartListScreen, ChartListScreen };