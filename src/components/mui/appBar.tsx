import * as UECA from "ueca-react";
import { MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase } from "@components";
import { AppBar as MUIAppBar, AppBarProps } from "@mui/material";
import { asyncSafe } from "@core";

// AppBar component
type AppBarStruct = MuiBaseStruct<{
    props: {
        childrenView: React.ReactNode;
    };

    events: {
        onClick: (source: AppBarModel) => UECA.MaybePromise;
    };
}, AppBarProps>;

type AppBarParams = MuiBaseParams<AppBarStruct, AppBarProps>;
type AppBarModel = MuiBaseModel<AppBarStruct, AppBarProps>;

function useAppBar(params?: AppBarParams): AppBarModel {
    const struct: AppBarStruct = {
        props: {
            childrenView: undefined,
        },

        View: () => (
            <MUIAppBar
                id={model.htmlId()}
                position={"static"}
                onClick={() => model.onClick && asyncSafe(() => model.onClick(model))}
                {...model.mui}
            >
                {model.childrenView}
            </MUIAppBar>
        ),
    };

    const model = useMuiBase(struct, params);
    return model;
}

const AppBar = UECA.getFC(useAppBar);

export { AppBarParams, AppBarModel, useAppBar, AppBar };
