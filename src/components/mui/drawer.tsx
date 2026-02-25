import * as UECA from "ueca-react";
import { Drawer as MUIDrawer, DrawerProps, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Col, Row, CloseIconButton, MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase, Block } from "@components";
import { asyncSafe } from "@core";

// Drawer component
type DrawerStruct = MuiBaseStruct<{
    props: {
        open: boolean;
        titleView: React.ReactNode;
        contentView: React.ReactNode;
        actionView: React.ReactNode;
        anchor: "left" | "top" | "right" | "bottom";
        variant: "permanent" | "persistent" | "temporary";
    };

    events: {
        onOpen: (source: DrawerModel) => UECA.MaybePromise;
        onClose: (source: DrawerModel) => UECA.MaybePromise;
    };
}, DrawerProps>;

type DrawerParams = MuiBaseParams<DrawerStruct, DrawerProps>;
type DrawerModel = MuiBaseModel<DrawerStruct, DrawerProps>;

function useDrawer(params?: DrawerParams): DrawerModel {
    const struct: DrawerStruct = {
        props: {
            id: useDrawer.name,
            open: false,
            titleView: undefined,
            contentView: undefined,
            actionView: undefined,
            anchor: "left",
            variant: "temporary",
        },

        events: {
            onChangeOpen: (v) => {
                if (v) {
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
            <MUIDrawer
                id={model.htmlId()}
                anchor={model.anchor}
                open={model.open}
                variant={model.variant}
                sx={{ zIndex: model.zIndex }}
                onClose={_close}
                {...model.mui}
            >
                <Col height={"100%"}>
                    <Row verticalAlign={"center"} horizontalAlign={"spaceBetween"}>
                        <DialogTitle children={model.titleView} />
                        <Block render={model.variant != "permanent"}>
                            <CloseIconButton onClick={_close} />
                        </Block>
                    </Row>
                    <DialogContent style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
                        {model.contentView}
                    </DialogContent>
                    <DialogActions style={{ flexShrink: 0 }}>
                        {model.actionView}
                    </DialogActions>
                </ Col>
            </MUIDrawer>
        ),
    };

    const model = useMuiBase(struct, params);
    return model;

    //Private methods
    function _close() {
        model.open = false;
    }
}

const Drawer = UECA.getFC(useDrawer);

export { DrawerModel, DrawerParams, useDrawer, Drawer };
