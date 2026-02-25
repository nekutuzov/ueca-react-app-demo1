import React from "react";
import * as UECA from "ueca-react";
import { Breadcrumbs as MUIBreadcrumbs, BreadcrumbsProps } from "@mui/material";
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase } from "@components";
import { asyncSafe } from "@core";

// Breadcrumbs component
type BreadcrumbsStruct = MuiBaseStruct<{
    props: {
        childrenView: React.ReactNode;
    };

    events: {
        onClick: (target: BreadcrumbsModel) => UECA.MaybePromise;
    };
}, BreadcrumbsProps>;

type BreadcrumbsParams = MuiBaseParams<BreadcrumbsStruct, BreadcrumbsProps>;
type BreadcrumbsModel = MuiBaseModel<BreadcrumbsStruct, BreadcrumbsProps>;

function useBreadcrumbs(params?: BreadcrumbsParams): BreadcrumbsModel {
    const struct: BreadcrumbsStruct = {
        props: {
            id: useBreadcrumbs.name,
            childrenView: undefined,
        },

        View: () => (
            <MUIBreadcrumbs
                id={model.htmlId()}
                children={model.childrenView}
                separator={<NavigateNextRoundedIcon />}
                onClick={() => model.onClick && asyncSafe(() => model.onClick(model))}
                {...model.mui}
            />
        ),
    };

    const model = useMuiBase(struct, params);
    return model;
}

const Breadcrumbs = UECA.getFC(useBreadcrumbs);

export { BreadcrumbsModel, BreadcrumbsParams, useBreadcrumbs, Breadcrumbs };
