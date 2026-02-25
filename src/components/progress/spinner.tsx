import * as UECA from "ueca-react";
import { CircularProgress, CircularProgressProps, styled } from "@mui/material";
import { BlockProps, Block, MuiBaseModel, MuiBaseParams, MuiBaseStruct, useMuiBase } from "@components";

type SpinnerStruct = MuiBaseStruct<{
    props: {
        visible: boolean;
        size: number | string;
        thickness: number;
        value: number;
        variant: "determinate" | "indeterminate";
        color: "primary" | "secondary" | "inherit" | "error" | "info" | "success" | "warning";
        disableShrink: boolean;
        delayTime: number;  // milliseconds        
        _visible: boolean;
        __delayTimer: number;
    }
}, CircularProgressProps>;

type SpinnerParams = MuiBaseParams<SpinnerStruct, CircularProgressProps>;
type SpinnerModel = MuiBaseModel<SpinnerStruct, CircularProgressProps>;

function useSpinner(params?: SpinnerParams): SpinnerModel {
    const struct: SpinnerStruct = {
        props: {
            id: useSpinner.name,
            visible: false,
            size: 40,
            thickness: 3.6,
            value: 0,
            variant: "indeterminate",
            color: "primary",
            disableShrink: false,
            delayTime: undefined,
            _visible: false
        },

        events: {
            onChangeVisible: () => _updateState()
        },

        View: () =>
            <Drape
                id={model.htmlId()}
                zIndex={model.zIndex}
                render={model._visible}
            >
                <CircularProgress
                    size={model.size}
                    thickness={model.thickness}
                    value={model.value}
                    variant={model.variant}
                    color={model.color}
                    disableShrink={model.disableShrink}
                    {...model.mui}
                />
            </Drape>
    }

    const model = useMuiBase(struct, params) as SpinnerModel;
    return model;

    // private methods
    function _updateState() {
        if (model.__delayTimer || model._visible === model.visible) {
            return;
        }

        // Make the whole call asynchronous due to race condition in properties assigment
        setTimeout(() => {
            if (model.delayTime) {
                // Update visibility after delayTime timeout
                model.__delayTimer = setTimeout(() => {
                    model._visible = model.visible;
                    model.__delayTimer = undefined;
                }, model.delayTime);
            } else {
                model._visible = model.visible;
            }
        });
    }
}

const Spinner = UECA.getFC(useSpinner);

const Drape = styled(Block)<BlockProps>(p => ({
    position: "absolute",
    zIndex: (p.zIndex as string) || 1000000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
}));

export { SpinnerModel, useSpinner, Spinner };
