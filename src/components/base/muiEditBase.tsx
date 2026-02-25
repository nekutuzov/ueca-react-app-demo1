import * as UECA from "ueca-react";
import { EditBaseModel, EditBaseParams, EditBaseStruct, useEditBase } from "@components";

// Base UECA Component for all MUI components in the application
type MuiEditBasePartialStruct<MuiProps> = EditBaseStruct<{
    props: {
        // All available MUI properties (a backdoor). 
        // ReactNode properties omit ReactElement type. Declare ReactElement type property separately as [PropertyName]View.        
        mui: Partial<OmitReactElementProps<MuiProps>>;
    },
}>;

type MuiEditBaseStruct<T extends UECA.GeneralComponentStruct, MuiProps> = MuiEditBasePartialStruct<MuiProps> & EditBaseStruct<T>;
type MuiEditBaseParams<T extends MuiEditBasePartialStruct<MuiProps>, MuiProps> = EditBaseParams<T>;
type MuiEditBaseModel<T extends MuiEditBasePartialStruct<MuiProps>, MuiProps> = EditBaseModel<T>;

type OmitReactElementProps<T> = {
    [K in keyof T]: Exclude<T[K], React.ReactElement>;
};

function useMuiEditBase<T extends MuiEditBasePartialStruct<MuiProps>, MuiProps>(extStruct: T, params?: MuiEditBaseParams<T, MuiProps>): MuiEditBaseModel<T, MuiProps> {
    const struct: MuiEditBasePartialStruct<unknown> = {
        props: {
            mui: undefined,
        }
    };

    const model = UECA.useExtendedComponent(struct, extStruct, params, useEditBase);
    return model;
}

export { MuiEditBaseStruct, MuiEditBaseParams, MuiEditBaseModel, useMuiEditBase }
