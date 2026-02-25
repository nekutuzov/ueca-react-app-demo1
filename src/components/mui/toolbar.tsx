import * as UECA from "ueca-react";
import { Toolbar as MUIToolbar, ToolbarProps } from "@mui/material";
import { MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase } from "@components";
import { asyncSafe } from "@core";

// Toolbar component
type ToolbarStruct = MuiBaseStruct<{
    props: {
        childrenView: React.ReactNode;
        disableGutters: boolean;
        variant: "regular" | "dense";
    };

    events: {
        onClick: (source: ToolbarModel) => UECA.MaybePromise;
    };
}, ToolbarProps>;

type ToolbarParams = MuiBaseParams<ToolbarStruct, ToolbarProps>;
type ToolbarModel = MuiBaseModel<ToolbarStruct, ToolbarProps>;

function useToolbar(params?: ToolbarParams): ToolbarModel {
    const struct: ToolbarStruct = {
        props: {
            childrenView: undefined,
            disableGutters: false,
            variant: "regular",
        },

        View: () => (
            <MUIToolbar
                id={model.htmlId()}
                disableGutters={model.disableGutters}
                variant={model.variant}
                onClick={() => model.onClick && asyncSafe(() => model.onClick(model))}
                {...model.mui}
            >
                {model.childrenView}
            </MUIToolbar>
        ),
    };

    const model = useMuiBase(struct, params);
    return model;
}

const Toolbar = UECA.getFC(useToolbar);

export { ToolbarParams, ToolbarModel, useToolbar, Toolbar };
