import * as UECA from "ueca-react";
import { IconButton as MUIIconButton, IconButtonProps } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import { asyncSafe } from "@core";
import { MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase } from "@components";

// IconButton component
type IconButtonStruct = MuiBaseStruct<{
    props: {
        kind?: keyof typeof buttonTypes;
        iconView: React.ReactNode;
        color: "inherit" | "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
        disabled: boolean;
        size: "small" | "medium" | "large";
    };

    events: {
        onClick: (source: IconButtonModel) => UECA.MaybePromise;
    };

    methods: {
        click: () => void;
    };
}, IconButtonProps>;

type IconButtonParams = MuiBaseParams<IconButtonStruct, IconButtonProps>;
type IconButtonModel = MuiBaseModel<IconButtonStruct, IconButtonProps>;

function useIconButton(params?: IconButtonParams): IconButtonModel {
    const struct: IconButtonStruct = {
        props: {
            id: useIconButton.name,
            kind: "ok",
            iconView: undefined,
            color: "default",
            disabled: false,
            size: "medium",
        },

        methods: {
            click: () => {
                if (!model.disabled && model.onClick) asyncSafe(() => model.onClick(model));
            },
        },

        View: () => (
            <MUIIconButton
                id={model.htmlId()}
                color={model.color}
                disabled={model.disabled}
                size={model.size}
                onClick={() => model.onClick && asyncSafe(() => model.onClick(model))}
                {...model.mui}
            >
                {model.iconView || buttonTypes[model.kind]}
            </MUIIconButton>
        ),
    };

    const model = useMuiBase(struct, params);
    return model;
}

const buttonTypes = {
    ok: <DoneIcon fontSize="inherit" />,
    cancel: <CancelOutlinedIcon fontSize="inherit" />,
    close: <CloseIcon fontSize="inherit" />,
    delete: <DeleteIcon fontSize="inherit" />,
    refresh: <RefreshIcon fontSize="inherit" />,
    edit: <EditIcon fontSize="inherit" />,
};

const IconButton = UECA.getFC(useIconButton);

// Predefined IconButtons
const OKIconButton = (params: IconButtonParams) => <IconButton id={"closeIButton"} kind={"ok"} {...params} />
const CancelIconButton = (params: IconButtonParams) => <IconButton id={"closeIButton"} kind={"cancel"} {...params} />
const CloseIconButton = (params: IconButtonParams) => <IconButton id={"closeIButton"} kind={"close"} {...params} />
const DeleteIconButton = (params: IconButtonParams) => <IconButton id={"deleteIButton"} kind={"delete"} {...params} />
const RefreshIconButton = (params: IconButtonParams) => <IconButton id={"refreshIButton"} kind={"refresh"} {...params} />
const EditIconButton = (params: IconButtonParams) => <IconButton id={"editIButton"} kind={"edit"} {...params} />

export { IconButtonModel, IconButtonParams, useIconButton, IconButton };
export { OKIconButton, CancelIconButton, CloseIconButton, DeleteIconButton, RefreshIconButton, EditIconButton };
