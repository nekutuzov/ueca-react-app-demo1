import React from "react";
import * as UECA from "ueca-react";
import { TableVirtuoso, TableVirtuosoProps } from "react-virtuoso";
import { TableBody, TableCell, TableContainer, TableHead, TableRow, Table as MUITable, Paper } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import {
    Block, BlockProps, Col, NavLink, Row, SortDirection, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase
} from "@components";
import { AppRoute, asyncSafe } from "@core";

type Struct<TRecord extends Record<string, unknown>> = UIBaseStruct<{
    props: {
        columns: Record<string, TableColumn<TRecord>>;
        data: TRecord[];
        activeRecord: DataRecord<TRecord>;
        activeColumn: TableColumn<TRecord>;
        size: "small" | "medium";
        stickyHeader: boolean;
        virtualization: boolean;
        _activeRecord: DataRecord<TRecord>;
        _activeColumn: TableColumn<TRecord>;
        _data: TRecord[];
        __currentSort: TableColumn<TRecord>;
        __scrollPosition: number;
        __virtuozoComponents: TableVirtuosoProps<TRecord, unknown>["components"];
    }

    events: {
        onRowHover: (activeRecord: DataRecord<TRecord>) => void;
        onCellHover: (column: TableColumn<TRecord>, activeRecord: DataRecord<TRecord>) => void;
        onSortCompare?: (a: TRecord, b: TRecord, column: TableColumn<TRecord>) => number;
        onMoreDataNeeded?: (lastRecordIndex: number) => Promise<TRecord[]>;
    },

    methods: {
        _tableHeaderView: () => React.JSX.Element;
        _tableBodyView: () => React.JSX.Element;
        _tableHeaderCellView: (props: { column: TableColumn<TRecord> }) => React.JSX.Element;
        _sortIndicatorView: (props: { column: TableColumn<TRecord> }) => React.JSX.Element;
        _tableRowView: () => React.JSX.Element;
        _tableDataRowView: (props: { dataRecord: DataRecord<TRecord> }) => React.JSX.Element;
        _tableDataCellView: (props: { column: TableColumn<TRecord>, dataRecord: DataRecord<TRecord> }) => React.JSX.Element;
        _tablePartView: (props: { view: TablePartView<TRecord>, column?: TableColumn<TRecord>, dataRecord?: DataRecord<TRecord> }) => React.JSX.Element;
    }
}>;

type TableParams<TRecord extends Record<string, unknown>> = UIBaseParams<Struct<TRecord>>;
type TableModel<TRecord extends Record<string, unknown>> = UIBaseModel<Struct<TRecord>>;

function useTable<TRecord extends Record<string, unknown>>(params?: TableParams<TRecord>): TableModel<TRecord> {
    const struct: Struct<TRecord> = {
        props: {
            id: useTable.name,
            columns: undefined,
            data: UECA.bind(
                // Avoid unnecessary re-renders on data change. Sort the new data before setting to _data.
                () => model._data,
                (data) => {
                    model.__scrollPosition = 0;
                    model.__currentSort = undefined;
                    _sortData(data, model.columns ? Object.values(model.columns).find(c => c.sorted) : undefined);
                    model._data = data;
                }),
            activeRecord: () => model._activeRecord,
            activeColumn: () => model._activeColumn,
            size: "medium",
            stickyHeader: false,
            virtualization: true,
            _activeRecord: undefined,
            _activeColumn: undefined,
            _data: undefined,
            __currentSort: undefined,
            __scrollPosition: 0,
            __virtuozoComponents: undefined,
        },

        events: {
            onChangeColumns: () => {
                _updateTableState();
            },
        },

        methods: {
            _tableHeaderView: () => {
                const headerView = model.columns ?
                    Object.keys(model.columns).map(c => <model._tableHeaderCellView key={c} column={model.columns[c]} />) :
                    null;
                return (
                    <TableRow>
                        {headerView}
                    </TableRow>
                );
            },

            _tableHeaderCellView: ({ column }) => {
                return (
                    <TableCell
                        sx={{ width: column.width }}
                        onClick={() => column.sortable && _toggleSort(column)}
                    >
                        <Row horizontalAlign={_getColumnAlign(column)}>
                            <model._tablePartView
                                column={column}
                                view={column.titleView}
                            />
                            <model._sortIndicatorView column={column} />
                        </Row>
                    </TableCell>
                );
            },

            _sortIndicatorView: ({ column }) =>
                <Block>
                    {
                        column.sorted === "asc" &&
                        <ArrowDropUpIcon fontSize={"small"} /> ||
                        column.sorted === "desc" && <ArrowDropDownIcon fontSize={"small"} /> ||
                        column.sortable && <UnfoldMoreIcon fontSize={"small"} color={"disabled"} />
                    }
                </Block>,

            _tableBodyView: () => {
                const view = model._data.map((fields, index) =>
                    <TableRow
                        key={index}
                        onMouseEnter={() => {
                            model._activeRecord = { index, fields };
                            model.onRowHover?.(model._activeRecord);
                        }
                        }
                        onMouseLeave={() => {
                            model._activeRecord = undefined;
                            model.onRowHover?.(undefined);
                        }}
                    >
                        <model._tableDataRowView key={index} dataRecord={{ index, fields }} />
                    </TableRow >
                );
                return <TableBody children={view} />;
            },

            _tableDataRowView: ({ dataRecord }) => {
                const rowView = model.columns && Object.keys(model.columns).map(c => {
                    return <model._tableDataCellView
                        key={`${dataRecord.index}_${c}`}
                        column={model.columns[c]}
                        dataRecord={dataRecord}
                    />
                });
                return <>{rowView}</>
            },


            _tableDataCellView: ({ column, dataRecord }) => {
                return (
                    <TableCell
                        align={_getColumnAlign(column)}
                        onMouseEnter={() => {
                            model._activeColumn = column;
                            model.onCellHover?.(model._activeColumn, model._activeRecord);
                        }}
                        onMouseLeave={() => {
                            model._activeColumn = undefined;
                            model.onCellHover?.(undefined, undefined);
                        }}
                    >
                        {_renderDataCellView(column, dataRecord)}

                        <Row render={!!column.actionView}
                            spacing={"tiny"}
                            padding={"tiny"}
                            horizontalAlign={column.align || "right"}
                        >
                            <model._tablePartView
                                column={column}
                                dataRecord={dataRecord}
                                view={column.actionView}
                            />
                        </Row>
                    </TableCell>
                );
            },

            _tablePartView: ({ view, column, dataRecord }) => {
                if (UECA.isFunction(view)) {
                    return <>{view({ column, dataRecord })}</>;
                }
                return <>{view}</>;
            }
        },

        constr: () => {
            model.__virtuozoComponents = _virtuosoTableComponents();
        },

        init: () => {
            _updateTableState();
        },

        View: () => {
            if (model.virtualization) {
                return (
                    <TableVirtuoso
                        id={model.htmlId()}
                        data={model._data}
                        initialTopMostItemIndex={model.__scrollPosition}
                        components={model.__virtuozoComponents}
                        fixedHeaderContent={model._tableHeaderView}
                        increaseViewportBy={1000}
                        itemContent={(index, fields) => <model._tableDataRowView dataRecord={{ index, fields }} />}
                        endReached={(i) => asyncSafe(() => _endReached(i))}
                        rangeChanged={(range) => {
                            model.__scrollPosition = range.startIndex;
                        }}
                    />
                );
            }
            return (
                <Col id={model.htmlId()} fill>
                    <TableContainer>
                        <MUITable size={model.size} stickyHeader={model.stickyHeader}>
                            <TableHead>
                                <model._tableHeaderView />
                            </TableHead>
                            <model._tableBodyView />
                        </MUITable>
                    </TableContainer>
                </Col>
            );
        }
    }

    const model = useUIBase(struct, params);
    return model;

    // Private methods
    function _virtuosoTableComponents() {
        return {
            Scroller: React.forwardRef<HTMLElement>((props, ref) => (
                <TableContainer component={Paper} {...props} ref={ref as React.Ref<HTMLDivElement>} />
            )),

            Table: (props) => (
                <MUITable
                    size={model.size}
                    stickyHeader={model.stickyHeader}
                    sx={{
                        tableLayout: "fixed",
                        "& .MuiTableCell-root": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        },
                    }}
                    {...props}
                />),

            TableHead: TableHead,

            TableRow: (props) => (
                <TableRow
                    {...props}
                    onMouseEnter={() => {
                        model._activeRecord = { index: props["data-index"], fields: props.item };
                        model.onRowHover?.(model._activeRecord);
                    }}
                    onMouseLeave={() => {
                        model._activeRecord = undefined;
                        model.onRowHover?.(undefined);
                    }}
                />
            ),

            TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />),
        } as TableVirtuosoProps<TRecord, unknown>["components"];
    }

    function _getColumnAlign(column: TableColumn<TRecord>) {
        if (column.align) {
            return column.align;
        }
        switch (column.dataType) {
            case "number":
                return "right"
            case "boolean":
                return "center"
        }
        return "left";
    }

    // Renders the cell view based on dataType or custom cellView
    function _renderDataCellView(column: TableColumn<TRecord>, dataRecord: DataRecord<TRecord>): React.ReactNode {
        let view: React.ReactNode;

        if (column.cellView) {
            view = <model._tablePartView column={column} dataRecord={dataRecord} view={column.cellView} />;
        } else {
            let value: unknown;
            if (typeof column.field === "function") {
                value = column.field(dataRecord.fields);
            } else {
                value = dataRecord.fields[column.field];
            }
            switch (column.dataType) {
                case "number": {
                    const useFormat = column.decimals != null;
                    const numericValue = Number(value);
                    view = useFormat ? numericValue.toFixed(column.decimals) : numericValue;
                    break;
                }
                case "boolean":
                    if (UECA.isBoolean(value)) {
                        return value ? "Yes" : "No";
                    }
                    if (UECA.isString(value)) {
                        return value.toLowerCase() == "true" ? "Yes" : "No";
                    }
                    view = value ? "Yes" : "No";
                    break;
                case "date":
                    view = new Date(value as string).toLocaleDateString();
                    break;
                case "time":
                    view = new Date(value as string).toLocaleTimeString();
                    break;
                case "datetime":
                    view = new Date(value as string).toLocaleString();
                    break;
                case "imageLink":
                    view = value ?
                        <img
                            src={value as string}
                            style={{ maxHeight: 30, maxWidth: 30, borderRadius: "50%", objectFit: "cover" }}
                        /> :
                        null;
                    break;
                default:
                    view = value as React.ReactNode;
            }
        }

        if (column.route) {
            const route = (typeof column.route == "function") ? column.route(dataRecord, column) : column.route;
            view = <NavLink
                id={`navCell_${column.field as string}_${dataRecord.index}`}
                route={route}
                linkView={view}
            />;
        }

        return view;
    }

    function _toggleSort(column: TableColumn<TRecord>) {
        column.sorted = column.sorted === "asc" ? "desc" : "asc";
        model.__currentSort = undefined;
        _sortTable(column);
    }

    function _sortTable(column: TableColumn<TRecord>) {
        // Clear sort on other columns        
        Object.keys(model.columns).filter(c => model.columns[c] !== column).forEach(c => model.columns[c].sorted = undefined);
        if (column == model.__currentSort) return;
        model.__scrollPosition = 0;
        _sortData(model._data, column);
    }

    function _sortData(data: TRecord[], column: TableColumn<TRecord>) {
        if (data && column) {
            if (model.onSortCompare) {
                data.sort((a, b) => model.onSortCompare(a, b, column));
            } else if (column.onSortCompare) {
                data.sort((a, b) => column.onSortCompare(a, b));
            } else {
                data.sort((a, b) => {
                    let leftVal: unknown;
                    let rightVal: unknown;
                    if (typeof column.field === "function") {
                        leftVal = column.field(a);
                        rightVal = column.field(b);
                    } else {
                        leftVal = a[column.field];
                        rightVal = b[column.field];
                    }
                    const res = leftVal < rightVal ? -1 : (leftVal > rightVal) ? 1 : 0;
                    return column.sorted === "desc" ? -res : res;
                });
            }
        }
        model.__currentSort = column;
    }

    function _updateTableState() {
        if (model._data && model.columns) {
            const sortedColName = Object.keys(model.columns).find(c => model.columns[c].sorted);
            if (sortedColName) {
                _sortTable(model.columns[sortedColName]);
            }
        }
    }

    async function _endReached(lastRecordIndex: number) {
        if (model.onMoreDataNeeded) {
            const moreData = await model.onMoreDataNeeded(lastRecordIndex);
            if (moreData?.length) {
                const sortCol = model.__currentSort;
                const sortDirection = sortCol?.sorted;
                _sortTable(undefined);
                model._data.push(...moreData);
                if (sortCol) {
                    sortCol.sorted = sortDirection;
                    _sortTable(sortCol);
                }
            }
        }
    }
}

const Table = UECA.getFC(useTable);

// Internal types
type TableColumn<TRecord extends Record<string, unknown>> = {
    field?: keyof TRecord | TableColumnValue<TRecord>;
    dataType?: ColumnDataType;
    decimals?: number;
    sortable?: boolean;
    sorted?: SortDirection;
    width?: BlockProps["width"];
    align?: "left" | "center" | "right";
    route?: TableRoute<TRecord>;
    titleView?: TablePartView<TRecord>;
    cellView?: TablePartView<TRecord>;
    actionView?: TablePartView<TRecord>;
    onSortCompare?: (a: TRecord, b: TRecord) => number;
}

type ColumnDataType =
    "string" |
    "number" |
    "boolean" |
    "date" |
    "time" |
    "datetime" |
    "imageLink";

type DataRecord<TRecord extends Record<string, unknown>> = {
    index: number;
    fields: TRecord;
}

type TableColumnValue<TRecord extends Record<string, unknown>> = (dataRecord: TRecord) => unknown;

type TablePartView<TRecord extends Record<string, unknown>> =
    ((props: { dataRecord?: DataRecord<TRecord>, column?: TableColumn<TRecord> }) => React.ReactNode) | React.ReactNode;

type TableRoute<TRecord extends Record<string, unknown>> =
    ((dataRecord?: DataRecord<TRecord>, column?: TableColumn<TRecord>) => AppRoute) | AppRoute;

export { TableParams, TableModel, useTable, Table, TableColumnValue, TablePartView, TableRoute, TableColumn, ColumnDataType, DataRecord };
