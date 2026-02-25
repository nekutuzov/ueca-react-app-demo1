import * as UECA from "ueca-react";
import { EditBaseModel, EditBaseParams, EditBaseStruct, useEditBase } from "@components";

type RouteScreenBasePartialStruct = EditBaseStruct<{
    props: {
        routeParams: Record<string, unknown>;
    };

    methods: {
        updateRouteParams: (params: Record<string, unknown>, patch: boolean) => Promise<void>;
    };
}>;

type RouteScreenBaseStruct<T extends UECA.GeneralComponentStruct> = RouteScreenBasePartialStruct & EditBaseStruct<T>;
type RouteScreenBaseParams<T extends RouteScreenBasePartialStruct = RouteScreenBaseStruct<UECA.GeneralComponentStruct>> = EditBaseParams<T>;
type RouteScreenBaseModel<T extends RouteScreenBasePartialStruct> = EditBaseModel<T>;
type RouteScreenBaseComponent = (params: RouteScreenBaseParams) => React.JSX.Element;

function useRouteScreenBase<T extends RouteScreenBasePartialStruct>(extStruct: T, params?: RouteScreenBaseParams<T>): RouteScreenBaseModel<T> {
    const struct: RouteScreenBasePartialStruct = {
        props: {
            id: useRouteScreenBase.name,
            routeParams: {},
        },

        methods: {
            updateRouteParams: async (params, patch) => {
                await model.setRouteParams(params, patch);
                const route = await model.getRoute();
                model.routeParams = route.params;
            }
        },

        init: () => {
            // Uncomment for rendering before finishing initialization
            // model.invalidateView();  
        }
    }

    const model = UECA.useExtendedComponent(struct, extStruct, params, useEditBase);
    return model;
}

export { useRouteScreenBase, RouteScreenBaseComponent, RouteScreenBaseModel, RouteScreenBaseStruct, RouteScreenBaseParams };
