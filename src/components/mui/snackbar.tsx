import * as UECA from "ueca-react";
import { Snackbar as MUISnackbar, Slide, SlideProps, SnackbarProps } from "@mui/material";
import { MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase } from "@components";
import { asyncSafe } from "@core";

// Snackbar component
type SnackbarStruct = MuiBaseStruct<{
    props: {
        open: boolean;
        contentView: React.ReactNode;
        messageView: React.ReactNode;
        actionView: React.ReactNode;
        anchorOrigin: { vertical: "top" | "bottom"; horizontal: "left" | "center" | "right"; };
        transition: boolean;
        simple: boolean;
        closeReasons: { timeout?: boolean; clickaway?: boolean; escapeKeyDown?: boolean; };
    };

    methods: {
        _slideTransition: (props: SlideProps) => UECA.ReactElement;
    },

    events: {
        onOpen: (source: SnackbarModel) => UECA.MaybePromise;
        onClose: (source: SnackbarModel) => UECA.MaybePromise;
    };
}, SnackbarProps>;

type SnackbarParams = MuiBaseParams<SnackbarStruct, SnackbarProps>;
type SnackbarModel = MuiBaseModel<SnackbarStruct, SnackbarProps>;

function useSnackbar(params?: SnackbarParams): SnackbarModel {
    const struct: SnackbarStruct = {
        props: {
            id: useSnackbar.name,
            open: false,
            contentView: undefined,
            messageView: undefined,
            actionView: undefined,
            anchorOrigin: { vertical: "top", horizontal: "right" },
            transition: true,
            simple: false,
            closeReasons: undefined
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

        methods: {
            _slideTransition: (props) => <Slide {...props} direction="left" />,
        },

        constr: () => {
            if (model.open) {
                asyncSafe(() => model.onOpen?.(model));
            }
        },

        View: () => (
            <MUISnackbar
                id={model.htmlId()}
                open={model.open}
                message={model.messageView}
                action={model.actionView}
                autoHideDuration={4000}
                anchorOrigin={model.anchorOrigin}
                transitionDuration={model.transition ? undefined : 0}
                onClose={(_, reason) => {
                    const flag = model.closeReasons?.[reason];
                    if (UECA.isUndefined(flag) || flag) {
                        model.open = false;
                    }
                }}
                slots={{
                    root: model.simple ? "div" : undefined,
                    transition: model.transition ? model._slideTransition : undefined,

                }}
                {...model.mui}
            >
                <div>{model.contentView}</div>
            </MUISnackbar>
        ),
    };

    const model = useMuiBase(struct, params);
    return model;
}

const Snackbar = UECA.getFC(useSnackbar);

export { SnackbarModel, SnackbarParams, useSnackbar, Snackbar };
