import * as UECA from "ueca-react";
import { ListItemButton as MUIListItemButton, ListItemButtonProps } from "@mui/material";
import { MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase } from "@components";
import { asyncSafe } from "@core";

// ListItemButton component
type ListItemButtonStruct = MuiBaseStruct<{
    props: {
        contentView: React.ReactNode;
        disabled: boolean;
        selected: boolean;
    };

    events: {
        onClick: (target: ListItemButtonModel) => UECA.MaybePromise;
    };
}, ListItemButtonProps>;

type ListItemButtonParams = MuiBaseParams<ListItemButtonStruct, ListItemButtonProps>;
type ListItemButtonModel = MuiBaseModel<ListItemButtonStruct, ListItemButtonProps>;

function useListItemButton(params?: ListItemButtonParams): ListItemButtonModel {
    const struct: ListItemButtonStruct = {
        props: {
            contentView: undefined,
            disabled: false,
            selected: false,
        },

        View: () => (
            <MUIListItemButton
                id={model.htmlId()}
                children={model.contentView}
                disabled={model.disabled}
                selected={model.selected}
                onClick={() => model.onClick && asyncSafe(() => model.onClick(model))}
                {...model.mui}
            />
        ),
    };

    const model = useMuiBase(struct, params);
    return model;
}

const ListItemButton = UECA.getFC(useListItemButton);

export { ListItemButtonModel, ListItemButtonParams, useListItemButton, ListItemButton };
