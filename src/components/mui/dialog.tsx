import * as UECA from "ueca-react";
import { Dialog as MUIDialog, DialogContent, DialogContentText, DialogProps, DialogTitle, DialogActions } from "@mui/material";
import { Row, CloseIconButton, IconButtonModel, MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase } from "@components";
import { asyncSafe } from "@core";

// Button component
type DialogStruct = MuiBaseStruct<{
    props: {
        open: boolean;
        titleView: React.ReactNode;
        contentView: React.ReactNode;
        actionView: React.ReactNode;
        fullScreen: boolean;
        fullWidth: boolean;
        maxWidth: "xs" | "sm" | "md" | "lg" | "xl" | false;
    };

    children: {
        closeButton: IconButtonModel;
    }

    events: {
        onOpen: (source: DialogModel) => UECA.MaybePromise;
        onClose: (source: DialogModel) => UECA.MaybePromise;
    };
}, DialogProps>;

type DialogParams = MuiBaseParams<DialogStruct, DialogProps>;
type DialogModel = MuiBaseModel<DialogStruct, DialogProps>;

function useDialog(params?: DialogParams): DialogModel {
    const struct: DialogStruct = {
        props: {
            id: useDialog.name,
            open: false,
            titleView: undefined,
            contentView: undefined,
            actionView: undefined,
            fullScreen: false,
            fullWidth: false,
            maxWidth: "sm",
        },

        events: {
            onChangeOpen: () => {
                if (model.open) {
                    asyncSafe(() => model.onOpen?.(model));
                } else {
                    asyncSafe(() => model.onClose?.(model));
                }
            }
        },

        constr: () => {
            if (model.open) {
                asyncSafe(() => model.onOpen?.(model));
            }
        },

        View: () => (
            <MUIDialog
                id={model.htmlId()}
                open={model.open}
                fullScreen={model.fullScreen}
                fullWidth={model.fullWidth}
                maxWidth={model.maxWidth}
                sx={{ zIndex: model.zIndex }}
                onClose={_close}
                {...model.mui}
            >
                <DialogTitle>
                    <Row verticalAlign={"center"} horizontalAlign={"spaceBetween"} >
                        <div>
                            {model.titleView}
                        </div>
                        <CloseIconButton onClick={_close} />
                    </Row>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {model.contentView}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {model.actionView}
                </DialogActions>
            </MUIDialog>
        )
    };

    const model = useMuiBase<DialogStruct, DialogProps>(struct, params);
    return model;

    //Private methods
    function _close() {
        model.open = false;
    }
}

const Dialog = UECA.getFC(useDialog);

export { DialogModel, DialogParams, useDialog, Dialog };
