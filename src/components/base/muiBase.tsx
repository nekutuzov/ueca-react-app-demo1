import * as UECA from "ueca-react";
import { UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";

// Base UECA Component for all MUI components in the application
type MuiBasePartialStruct<MuiProps> = UIBaseStruct<{
    props: {
        // All available MUI properties (a backdoor). 
        // ReactNode properties omit ReactElement type. Declare ReactElement type property separately as [PropertyName]View.        
        mui: Partial<OmitReactElementProps<MuiProps>>;
    },
}>;

type MuiBaseStruct<T extends UECA.GeneralComponentStruct, MuiProps> = MuiBasePartialStruct<MuiProps> & UIBaseStruct<T>;
type MuiBaseParams<T extends MuiBasePartialStruct<MuiProps>, MuiProps> = UIBaseParams<T>;
type MuiBaseModel<T extends MuiBasePartialStruct<MuiProps>, MuiProps> = UIBaseModel<T>;

type OmitReactElementProps<T> = {
    [K in keyof T]: Exclude<T[K], React.ReactElement>;
};

function useMuiBase<T extends MuiBasePartialStruct<MuiProps>, MuiProps>(extStruct: T, params?: MuiBaseParams<T, MuiProps>): MuiBaseModel<T, MuiProps> {
    const struct: MuiBasePartialStruct<unknown> = {
        props: {
            mui: undefined,
        }
    };

    const model = UECA.useExtendedComponent(struct, extStruct, params, useUIBase);
    return model;
}

export { MuiBaseStruct, MuiBaseParams, MuiBaseModel, useMuiBase }
