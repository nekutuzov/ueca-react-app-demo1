import * as UECA from "ueca-react";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {
    Button, ButtonModel, CheckboxModel, Col, NavItem, RouteScreenBaseModel, RouteScreenBaseParams, RouteScreenBaseStruct, Row,
    TableModel, TableRoute, useButton, useCheckbox, useRouteScreenBase, useTable, Markdown
} from "@components";
import { CRUDScreenModel, useCRUDScreen } from "@screens";
import { User } from "@api";
import userListExplanation from "./userListExplanation.md?raw";

type UserListScreenStruct = RouteScreenBaseStruct<{
    props: {
        onlyActiveUsers: boolean;
    };

    children: {
        crudScreen: CRUDScreenModel;
        usersTable: TableModel<User>;
        addNewButton: ButtonModel;
        showActiveOnlyCheckbox: CheckboxModel;
    };

    methods: {
        doOnRefresh: () => Promise<void>;
        contentView: () => React.JSX.Element;
    };
}>;

type UserListScreenParams = RouteScreenBaseParams<UserListScreenStruct>;
type UserListScreenModel = RouteScreenBaseModel<UserListScreenStruct>;

function useUserListScreen(params?: UserListScreenParams): UserListScreenModel {
    const struct: UserListScreenStruct = {
        props: {
            id: useUserListScreen.name,
            onlyActiveUsers: true,
        },

        children: {
            crudScreen: useCRUDScreen({
                intent: "view",
                breadcrumbs: () => [
                    { route: { path: "/users" }, label: "Users" }
                ],
                toolsView: () => (
                    <Row>
                        <Button
                            contentView="Explain"
                            onClick={() => {
                                model.crudScreen.screenLayout.drawerPanel.titleView = "User Management Explanation";
                                model.crudScreen.screenLayout.drawerPanel.contentView = <Markdown source={userListExplanation} />;
                                model.crudScreen.screenLayout.drawerPanel.open = true;
                            }}
                        />
                        <Button
                            contentView="Code"
                            onClick={async () => await model.openNewTab({ path: "https://github.com/nekutuzov/ueca-react-app-demo1/blob/master/src/screens/demo/user/userListScreen.tsx" })}
                        />
                    </Row>
                ),
                contentView: () => model.contentView(),
                onRefresh: () => model.doOnRefresh(),
            }),

            usersTable: useTable<User>({
                stickyHeader: true,
                size: "small",
            }),

            addNewButton: useButton({
                contentView: "Add New",
                startIconView: <AddIcon />,
                variant: "contained",
                color: "primary",
                onClick: async () => {
                    await model.goToRoute({ path: "/users/:id", params: { id: "0" } });
                },
            }),

            showActiveOnlyCheckbox: useCheckbox({
                labelView: "Show only active users",
                checked: UECA.bind(() => model, "onlyActiveUsers"),
                onChange: () => {
                    // Refresh table when filter changes
                    model.doOnRefresh();
                },
            }),
        },

        methods: {
            doOnRefresh: async () => {
                const allUsers = await model.bus.unicast("Api.GetUsers", undefined);

                // Filter users based on the checkbox state
                if (model.showActiveOnlyCheckbox.checked) {
                    model.usersTable.data = allUsers?.filter(user => user.active) || [];
                } else {
                    model.usersTable.data = allUsers || [];
                }
            },

            contentView: () => (
                <Col fill>
                    <Row verticalAlign={"center"} spacing={"huge"} >
                        <span>Users {model.usersTable.data?.length}</span>
                        <Col fill />
                        <model.showActiveOnlyCheckbox.View />
                        <model.addNewButton.View />
                    </Row>
                    <model.usersTable.View />
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
        const userEditRoute: TableRoute<User> = (dataRecord) => ({ path: "/users/:id", params: { id: dataRecord.fields.id } });
        model.usersTable.columns = {
            avatarLink: {
                field: "avatarUrl",
                titleView: "Avatar",
                dataType: "imageLink",
                width: 100,
                route: userEditRoute,
            },
            name: {
                field: "name",
                titleView: "Name",
                sortable: true,
                width: 250,
                route: userEditRoute,
            },
            country: {
                field: (rec) => rec.address.country,
                titleView: "Country",
                sortable: true,
                width: 250
            },
            email: {
                field: "email",
                titleView: "Email",
                sortable: true,
                width: 350,
            },
            active: {
                field: "active",
                titleView: "Status",
                sortable: true,
                cellView: ({ dataRecord }) => (
                    <span style={{
                        color: dataRecord.fields.active ? '#4CAF50' : '#F44336',
                        fontWeight: 'bold'
                    }}>
                        {dataRecord.fields.active ? 'Active' : 'Inactive'}
                    </span>
                ),
            },
            actions: {
                width: 100,
                actionView: ({ dataRecord }) => (
                    <NavItem
                        id={`editButton_row${dataRecord.index}`}
                        kind={"button"}
                        active={model.usersTable.activeRecord?.index == dataRecord.index}
                        icon={<EditIcon fontSize="inherit" />}
                        text={"Edit"}
                        route={userEditRoute(dataRecord)}
                    />
                ),
            },
        }
    }
}

const UserListScreen = UECA.getFC(useUserListScreen);

export { UserListScreenParams, UserListScreenModel, useUserListScreen, UserListScreen };
